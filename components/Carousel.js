'use client';
/**
 * components/Carousel.js
 * ------------------------------------------------------------------
 * Lightweight image carousel — no external libraries.
 *
 * Props:
 *   images : string[]   Array of image URLs (e.g. /images/foo.jpeg)
 *   alt    : string     Alt-text prefix used for accessibility
 *
 * Features:
 *   - Prev / Next arrow buttons
 *   - Dot indicators
 *   - Keyboard arrow keys
 *   - Auto-clamps index when the array length changes
 * ------------------------------------------------------------------
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({ images = [], alt = 'photo' }) {
  const [i, setI] = useState(0);

  // Guard against empty arrays
  const total = images.length;
  const safeIndex = total ? ((i % total) + total) % total : 0;

  const prev = useCallback(() => setI((n) => n - 1), []);
  const next = useCallback(() => setI((n) => n + 1), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!total) {
    return <div className={styles.empty}>No images yet</div>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <img
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt={`${alt} ${safeIndex + 1}`}
          className={`${styles.img} bw`}
          loading="lazy"
        />

        <button
          className={`${styles.btn} ${styles.left}`}
          onClick={prev}
          aria-label="Previous image"
        >‹</button>

        <button
          className={`${styles.btn} ${styles.right}`}
          onClick={next}
          aria-label="Next image"
        >›</button>
      </div>

      <div className={styles.dots} role="tablist">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === safeIndex ? styles.activeDot : ''}`}
            onClick={() => setI(idx)}
            aria-label={`Go to image ${idx + 1}`}
            aria-selected={idx === safeIndex}
            role="tab"
          />
        ))}
      </div>

      <div className={styles.counter}>
        {String(safeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}
