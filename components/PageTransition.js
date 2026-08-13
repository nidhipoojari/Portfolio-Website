'use client';
/**
 * components/PageTransition.js
 * ------------------------------------------------------------------
 * Fades and lifts the page content on every route change.
 *
 * Keyed on pathname so React remounts the subtree and the CSS
 * animation replays. The native View Transitions API would be the
 * nicer mechanism, but App Router support for it landed after
 * Next 14.2 — this achieves the same read with no experimental flags.
 * ------------------------------------------------------------------
 */
import { usePathname } from 'next/navigation';
import styles from './PageTransition.module.css';

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles.page}>
      {children}
    </div>
  );
}
