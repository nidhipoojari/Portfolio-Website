'use client';
/**
 * components/Nav.js
 * ------------------------------------------------------------------
 * Top navigation. Minimal text links — no logo, no buttons.
 * `usePathname` highlights the active link.
 * ------------------------------------------------------------------
 */
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

export default function Nav() {
  const pathname = usePathname();
  return (
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
    </nav>
  );
}
