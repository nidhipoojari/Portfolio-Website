'use client';
// The "Tech roles / All roles" switch on the Experience page.
//
// Every role is rendered server-side regardless; this only flips
// data-view on the list, and CSS hides the non-tech roles. The role
// numbers are a CSS counter (see RoleFilter.module.css), so a filtered
// list renumbers itself instead of showing 01, 03, 04. With JavaScript
// off the switch does nothing and every role shows, numbered in order.
//
// "Tech roles" is the default, and is already what the server renders,
// so there is no flash of the full list. Switching to everything is
// mirrored into ?view=all, so that link can be shared and survives a
// reload.

import { useEffect, useState } from 'react';
import styles from './RoleFilter.module.css';

const pad = (n) => String(n).padStart(2, '0');

export default function RoleFilter({ techCount, allCount, children }) {
  const [view, setView] = useState('tech');

  const pick = (next) => {
    setView(next);
    const url = new URL(location.href);
    if (next === 'all') url.searchParams.set('view', 'all');
    else url.searchParams.delete('view');
    history.replaceState(null, '', url);
  };

  useEffect(() => {
    // A link straight to a non-tech role (/experience#orientation) would
    // otherwise land on a hidden section: show everything, then scroll
    // to it once it's back in the layout.
    const revealHashTarget = () => {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!el?.closest('[data-kind="other"]')) return false;
      pick('all');
      requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
      return true;
    };

    if (!revealHashTarget() && new URLSearchParams(location.search).get('view') === 'all') {
      setView('all');
    }
    window.addEventListener('hashchange', revealHashTarget);
    return () => window.removeEventListener('hashchange', revealHashTarget);
  }, []);

  const options = [
    { id: 'tech', label: 'Tech roles', count: techCount },
    { id: 'all', label: 'All roles', count: allCount },
  ];

  return (
    <>
      <div className={styles.bar} role="group" aria-label="Filter roles">
        <span className={styles.hint}>Show</span>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.option} ${view === o.id ? styles.on : ''}`}
            aria-pressed={view === o.id}
            onClick={() => pick(o.id)}
            data-umami-event="experience-filter"
            data-umami-event-view={o.id}
          >
            {o.label}
            <sup className={styles.count}>{pad(o.count)}</sup>
          </button>
        ))}
      </div>

      <div className={styles.list} data-view={view}>
        {children}
      </div>
    </>
  );
}
