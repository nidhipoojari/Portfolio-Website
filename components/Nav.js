'use client';
// Top nav — text links only, no logo, no buttons.
//
// Under 720px the inline list becomes a Menu/Close toggle over a
// full-screen panel. Seven links at 0.7rem used to wrap into three
// stacked rows on a phone, which looked less like a navigation and
// more like a mistake.

import { useState, useEffect } from 'react';
import Link from '@/components/TransitionLink';
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

// Must match the .panel transition duration in Nav.module.css. It is
// how long the panel lingers after close so the fade-out can finish
// instead of the whole thing vanishing mid-animation.
const PANEL_EXIT_MS = 300;

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Tapping a link should close the menu — the route change is the
  // signal, so nothing needs to be wired to the links themselves.
  useEffect(() => setOpen(false), [pathname]);

  // Mount straight away on open, hang around for one transition on
  // close, then actually unmount.
  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), PANEL_EXIT_MS);
    return () => clearTimeout(timer);
  }, [open, visible]);

  // Escape closes it, and the body stops scrolling underneath while
  // it's open. Restoring the previous overflow value rather than
  // blanking it keeps this from fighting anything else that might set
  // it later.
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
      <nav className={`${styles.nav} vtStable`}>
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
