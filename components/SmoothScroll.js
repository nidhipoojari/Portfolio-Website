'use client';
// Lenis: inertial smooth scrolling.
//
// The one item on the roadmap marked "adopt cautiously". Smooth scroll
// is the single most divisive thing on a site like this — it either
// reads as considered or as the page fighting your trackpad, and which
// one it is depends on the input device more than on the easing. So it
// ships behind a switch: set NEXT_PUBLIC_SMOOTH_SCROLL=off and this
// component does nothing, no rebuild of anything else required.
//
// Lenis drives the real scroll position rather than transforming a
// wrapper, which is why position: sticky, anchor links and keyboard
// scrolling all keep working — the usual casualties of smooth-scroll
// libraries.

import { useEffect } from 'react';

const ENABLED = process.env.NEXT_PUBLIC_SMOOTH_SCROLL !== 'off';

export default function SmoothScroll() {
  useEffect(() => {
    if (!ENABLED) return;

    // Someone who asked the OS for less motion did not mean "less motion
    // except for the scrolling", and hijacked scroll is the most
    // nausea-adjacent thing on the page.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches) return;

    let lenis;
    let frame;
    let cancelled = false;

    // Imported here rather than at module scope so the library is not in
    // the bundle any visitor has to download before first paint.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        // Just long enough to read as weight rather than lag. Past about
        // 1.2s it starts feeling like the page owes you a scroll.
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Touch devices already have inertial scrolling from the OS, and
        // doubling it is what makes smooth-scroll sites feel broken on a
        // phone. Leave the platform alone there.
        smoothWheel: true,
        syncTouch: false,
      });

      const raf = (time) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
