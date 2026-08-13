'use client';
/**
 * components/Cursor.js
 * ------------------------------------------------------------------
 * A small circle that trails the pointer, drawn with
 * mix-blend-mode: difference so it inverts whatever it passes over —
 * white on black, black on white. Costs nothing on a monochrome site
 * and is the one flourish that reads as "designed".
 *
 * Only mounts for devices with a fine pointer (mouse/trackpad) and
 * only when the visitor hasn't asked for reduced motion. Position is
 * driven through a rAF lerp so it lags the cursor slightly.
 * ------------------------------------------------------------------
 */
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
      // Lerp toward the pointer — 0.18 gives a soft trail without
      // feeling laggy.
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
