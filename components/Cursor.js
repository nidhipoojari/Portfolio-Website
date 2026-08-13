'use client';
// A dot that trails the pointer, painted with mix-blend-mode:
// difference so it inverts whatever it crosses. On a site that is only
// ever black or white, that costs nothing and is the one flourish I
// kept.
//
// Mice and trackpads only, and never for anyone who asked for reduced
// motion.

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(finePointer && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      // Ease toward the pointer instead of snapping to it. 0.18 was
      // picked by eye: high enough that the dot never feels broken,
      // low enough that it visibly trails.
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      const el = dotRef.current;
      if (el) {
        el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={dotRef} aria-hidden="true" className={styles.dot} />;
}
