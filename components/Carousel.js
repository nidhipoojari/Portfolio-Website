'use client';
/**
 * components/Carousel.js
 * ------------------------------------------------------------------
 * Lightweight image carousel — no external libraries.
 *
 * Props:
 *   images  : string[]   Array of image URLs (e.g. /images/foo.jpeg)
 *   alt     : string     Alt-text prefix used for accessibility
 *   variant : 'portrait' | 'wide'
 *             'portrait' (default) — 4:5 frame, cover. For photos.
 *             'wide'               — 16:10 frame, contain. For product
 *                                    screenshots, which must not be cropped.
 *
 * Features:
 *   - Prev / Next arrow buttons
 *   - Dot indicators
 *   - Keyboard arrow keys (scoped to the hovered/focused carousel)
 *   - Swipe / drag via pointer events
 *   - Auto-clamps index when the array length changes
 *   - Controls hide themselves when there is only one image
 * ------------------------------------------------------------------
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({ images = [], alt = 'photo', variant = 'portrait' }) {
  const [i, setI] = useState(0);

  // Guard against empty arrays
  const total = images.length;
  const safeIndex = total ? ((i % total) + total) % total : 0;

  const frameRef = useRef(null);

  const prev = useCallback(() => setI((n) => n - 1), []);
  const next = useCallback(() => setI((n) => n + 1), []);

  // Keyboard navigation.
  //
  // Scoped deliberately: a page can hold several carousels (Experience
  // has five), and a bare window listener per instance made one arrow
  // press advance every carousel at once. Only the carousel the user is
  // actually pointing at or focused inside responds.
  useEffect(() => {
    if (total < 2) return;

    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const el = frameRef.current;
      if (!el) return;

      const engaged =
        el.matches(':hover') || el.contains(document.activeElement);
      if (!engaged) return;

      e.preventDefault();  // don't also scroll the page
      if (e.key === 'ArrowLeft') prev();
      else next();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, total]);

  // ---------- Swipe / drag ----------
  // Pointer events cover touch, pen and mouse in one path, so there is
  // no separate touchstart/mousedown handling. A horizontal move past
  // the threshold commits; anything shorter, or anything more vertical
  // than horizontal, is treated as a scroll and ignored.
  const dragRef = useRef(null);
  const SWIPE_THRESHOLD = 45; // px
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    if (total < 2) return;
    // Ignore secondary buttons; let the arrow buttons handle their own clicks.
    if (e.button && e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY, settled: false };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.settled) return;

    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;

    // Vertical intent — the visitor is scrolling the page, not swiping.
    if (Math.abs(dy) > Math.abs(dx)) {
      dragRef.current = null;
      setDragging(false);
      return;
    }

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    drag.settled = true;
    if (dx < 0) next();
    else prev();
    dragRef.current = null;
    setDragging(false);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const wide = variant === 'wide';

  if (!total) {
    return (
      <div className={`${styles.empty} ${wide ? styles.emptyWide : ''}`}>
        No images yet
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div
        ref={frameRef}
        className={`${styles.frame} ${wide ? styles.frameWide : ''} ${dragging ? styles.dragging : ''}`}
        tabIndex={total > 1 ? 0 : undefined}
        role={total > 1 ? 'group' : undefined}
        aria-label={
          total > 1 ? `${alt} — image gallery, use arrow keys or swipe` : undefined
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <img
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt={`${alt} ${safeIndex + 1}`}
          className={`${styles.img} ${wide ? styles.imgWide : 'bw'}`}
          loading="lazy"
        />

        {total > 1 && (
          <>
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
          </>
        )}
      </div>

      {total > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}
