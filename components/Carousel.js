'use client';
/**
 * The image carousel. Arrows, dots, keyboard, swipe — written out
 * rather than pulled in, because Swiper and Embla both weigh more than
 * this whole component and I only needed two behaviours from either.
 *
 * @param images  Image URLs, e.g. ['/images/home/1.jpeg'].
 * @param alt     Alt-text prefix; each slide gets "<alt> <n>".
 * @param variant 'portrait' is a 4:5 cover frame and suits photos.
 *                'wide' is 16:10 and contains rather than crops —
 *                product screenshots lose their point when the edges
 *                get cut off.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({ images = [], alt = 'photo', variant = 'portrait' }) {
  const [i, setI] = useState(0);

  // The index counter runs unbounded in both directions and gets
  // wrapped here, so prev() at slide 0 lands on the last image instead
  // of stalling at -1.
  const total = images.length;
  const safeIndex = total ? ((i % total) + total) % total : 0;

  const frameRef = useRef(null);

  const prev = useCallback(() => setI((n) => n - 1), []);
  const next = useCallback(() => setI((n) => n + 1), []);

  // Arrow keys. The scoping here is not premature — the first version
  // put a bare window listener on every instance, so one keypress on
  // the Experience page advanced all five carousels in unison. Now
  // only the one being hovered or focused answers.
  useEffect(() => {
    if (total < 2) return;

    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      const el = frameRef.current;
      if (!el) return;

      const engaged =
        el.matches(':hover') || el.contains(document.activeElement);
      if (!engaged) return;

      e.preventDefault();  // otherwise the page scrolls too
      if (e.key === 'ArrowLeft') prev();
      else next();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, total]);

  // Swipe. Pointer events handle touch, pen and mouse through one code
  // path, so there is no parallel touchstart/mousedown branch to keep
  // in sync. Past the threshold horizontally and it commits; anything
  // shorter, or anything more vertical than horizontal, was a scroll.
  const dragRef = useRef(null);
  const SWIPE_THRESHOLD = 45; // px
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    if (total < 2) return;
    if (e.button && e.button !== 0) return;  // right/middle click isn't a swipe
    dragRef.current = { x: e.clientX, y: e.clientY, settled: false };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.settled) return;

    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;

    // More vertical than horizontal — they're scrolling, not swiping.
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
