'use client';
// Fades and lifts the content on every route change.
//
// Keying the wrapper on pathname is the whole mechanism: React tears
// down the subtree and rebuilds it, so the CSS animation replays.
// View Transitions would be the tidier answer, but App Router support
// for it landed after Next 14.2 and I did not want an experimental
// flag in a portfolio.

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
