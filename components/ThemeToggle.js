'use client';
/**
 * components/ThemeToggle.js
 * ------------------------------------------------------------------
 * Flips the `data-theme` attribute on <html> between 'light' and
 * 'dark' and remembers the choice in localStorage. The attribute
 * lives on the root layout, which never unmounts between routes, so
 * one click here changes every page on the site, not just Home.
 *
 * Rendered `null`-until-mounted so the server-rendered markup and the
 * first client render match exactly (localStorage isn't available on
 * the server) — avoids a hydration warning at the cost of a one-frame
 * placeholder label.
 * ------------------------------------------------------------------
 */
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
