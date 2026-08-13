'use client';
/**
 * Fade and rise as the element scrolls into view. Fires once and then
 * stops observing.
 *
 * Worth knowing: the hidden state is defined in globals.css under
 * `html.js .reveal`, not here. That class is only added by the boot
 * script in the root layout, so with JavaScript off nothing is ever
 * hidden in the first place — you get a plain page instead of a blank
 * one. All this component does is flip data-shown.
 *
 * @param as    Element to render as. Defaults to a div.
 * @param delay Milliseconds to trail behind sibling reveals.
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

    // Ancient browser with no IntersectionObserver: skip the animation
    // and show the content.
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.shown = 'true';
      return;
    }

    // Observing also fires for elements already on screen at load, so
    // above-the-fold content reveals immediately rather than waiting
    // for a scroll that may never come.
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
