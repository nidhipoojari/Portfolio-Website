'use client';
// Flips data-theme on <html> and remembers the choice. Because that
// attribute lives on the root layout, which never unmounts between
// routes, one click here re-themes the entire site and not just the
// page the button happens to sit on.
//
// The theme starts as null and is only read after mount: localStorage
// does not exist on the server, so reading it during render would make
// the server HTML and the first client render disagree. The cost is one
// frame of a placeholder label, which is cheaper than a hydration
// mismatch.

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={
        theme === null
          ? 'Toggle color theme'
          : theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {theme === null ? 'MODE' : theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
    </button>
  );
}
