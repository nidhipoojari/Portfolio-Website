'use client';
/**
 * components/Reveal.js
 * ------------------------------------------------------------------
 * Fade + 20px rise as the element scrolls into view. Fires once.
 *
 * The hidden state lives in globals.css under `html.js .reveal`, so a
 * visitor without JavaScript sees the content normally instead of a
 * blank page. This component only flips the data-shown attribute.
 *
 * Props:
 *   as    : element type to render (default 'div')
 *   delay : ms to stagger this element behind its siblings
 * ------------------------------------------------------------------
 */
import { useEffect, useRef } from 'react';

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browser) — just show it.
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.shown = 'true';
      return;
    }

    // Already in view on load (above the fold): show immediately so the
    // first screen isn't blank while waiting for a scroll event.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.shown = 'true';
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-shown="false"
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
