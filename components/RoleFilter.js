'use client';
// The "Tech roles / All roles" switch on the Experience page.
//
// Every role is rendered server-side regardless; this only flips
// data-view on the list, and CSS hides the non-tech roles. The role
// numbers are a CSS counter (see RoleFilter.module.css), so a filtered
// list renumbers itself instead of showing 01, 03, 04. With JavaScript
// off the switch does nothing and every role shows, numbered in order.
//
// The choice is mirrored into ?view=tech, so a filtered link can be
// shared and survives a reload.

import { useEffect, useState } from 'react';
import styles from './RoleFilter.module.css';

const pad = (n) => String(n).padStart(2, '0');

export default function RoleFilter({ techCount, allCount, children }) {
  const [view, setView] = useState('all');

  const pick = (next) => {
    setView(next);
    const url = new URL(location.href);
    if (next === 'tech') url.searchParams.set('view', 'tech');
    else url.searchParams.delete('view');
    history.replaceState(null, '', url);
  };

  useEffect(() => {
    // A link straight to a non-tech role (/experience?view=tech#orientation)
    // would otherwise land on a hidden section: show everything, then
    // scroll to it once it's back in the layout.
    const revealHashTarget = () => {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!el?.closest('[data-kind="other"]')) return false;
      pick('all');
      requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
      return true;
    };

    if (!revealHashTarget() && new URLSearchParams(location.search).get('view') === 'tech') {
      setView('tech');
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
