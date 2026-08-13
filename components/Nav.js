'use client';
/**
 * components/Nav.js
 * ------------------------------------------------------------------
 * Top navigation. Minimal text links — no logo, no buttons.
 * `usePathname` highlights the active link.
 *
 * Below 720px the inline list is replaced by a MENU / CLOSE toggle
 * that opens a full-screen panel. Seven links wrapping into three
 * rows of 0.7rem caps was the previous behaviour.
 * ------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

const links = [
  { href: '/',                label: 'Home' },
  { href: '/experience',      label: 'Experience' },
  { href: '/education',       label: 'Education' },
  { href: '/extracurricular', label: 'Extracurricular' },
  { href: '/projects',        label: 'Projects' },
  { href: '/certifications',  label: 'Certifications' },
  { href: '/interests',       label: 'Interests' },
];

// Keep in sync with the .panel transition duration in Nav.module.css —
// this is how long the panel stays mounted after closing so its
// fade/scale-out actually gets to play instead of snapping away.
const PANEL_EXIT_MS = 300;

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Close the panel whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Mount immediately on open; stay mounted a beat after close so the
  // exit transition can play, then unmount for real.
  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), PANEL_EXIT_MS);
    return () => clearTimeout(timer);
  }, [open, visible]);

  // Escape closes; lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>NP</Link>

        <ul className={styles.list}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname === l.href ? styles.active : ''}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      {visible && (
        <div
          id="mobile-menu"
          className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
          aria-hidden={!open}
        >
          <ul className={styles.panelList}>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname === l.href ? styles.panelActive : ''}
                  tabIndex={open ? undefined : -1}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
