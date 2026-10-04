'use client';
/**
 * The image carousel. Arrows, dots, keyboard, swipe — written out
 * rather than pulled in, because Swiper and Embla both weigh more than
 * this whole component and I only needed two behaviours from either.
 *
 * @param images  Image URLs, e.g. ['/images/home/1.jpeg']. An entry can
 *                also be { youtube: '<video id>', title } to show a video
 *                in the same frame, at the same size, as the photos,
 *                or { preview: '<url>', title } to show the top of a
 *                live site, running, scaled down into the frame.
 * @param alt     Alt-text prefix; each slide gets "<alt> <n>".
 * @param variant 'portrait' is a 4:5 cover frame and suits photos.
 *                'wide' is 16:10 and contains rather than crops —
 *                product screenshots lose their point when the edges
 *                get cut off.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Carousel.module.css';

// The size a live preview is rendered at before being scaled to fit.
// A desktop viewport, so the site lays out the way it was designed to
// be seen; 16:10, so it fills the wide frame with nothing cropped.
const PREVIEW_W = 1280;
const PREVIEW_H = 800;

// A live site, running in an iframe, shrunk to the frame. Not
// interactive: a full site at a third of its size is not usable, and
// an iframe that eats wheel events would trap the page's scroll. The
// whole frame is a link to the real thing instead.
function LivePreview({ url, title, className }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / PREVIEW_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <a
      ref={boxRef}
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.preview} ${className}`}
      aria-label={`${title}: open the live site`}
      data-umami-event="live-preview"
      data-umami-event-url={url}
    >
      <iframe
        src={url}
        title={title}
        width={PREVIEW_W}
        height={PREVIEW_H}
        className={styles.previewFrame}
        style={{ transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        scrolling="no"
      />
    </a>
  );
}

// A long hairline arrow pointing right; the previous button mirrors it.
function Arrow() {
  return (
    <svg viewBox="0 0 34 12" width="34" height="12" aria-hidden="true" focusable="false">
      <path
        d="M0 6 H32 M27 1 L32 6 L27 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          total > 1 ? `${alt}: image gallery, use arrow keys or swipe` : undefined
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {images[safeIndex]?.preview ? (
          <LivePreview
            key={images[safeIndex].preview}
            url={images[safeIndex].preview}
            title={images[safeIndex].title || alt}
            className={wide ? styles.imgWide : 'bw'}
          />
        ) : images[safeIndex]?.youtube ? (
          // youtube-nocookie: no YouTube cookies until the visitor
          // presses play, which keeps the site cookie-free like Umami.
          <iframe
            key={images[safeIndex].youtube}
            src={`https://www.youtube-nocookie.com/embed/${images[safeIndex].youtube}?rel=0`}
            title={images[safeIndex].title || `${alt} video`}
            className={`${styles.video} ${wide ? styles.imgWide : 'bw'}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <img
            key={images[safeIndex]}
            src={images[safeIndex]}
            alt={`${alt} ${safeIndex + 1}`}
            className={`${styles.img} ${wide ? styles.imgWide : 'bw'}`}
            loading="lazy"
          />
        )}

      </div>

      {total > 1 && (
        <>
          {/* Arrows live under the media, not on it: bare hairline
              arrows either side of the dots, so nothing sits on top of
              a photo or a video's own controls. */}
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={prev}
              aria-label="Previous image"
            >
              <Arrow />
            </button>

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

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={next}
              aria-label="Next image"
            >
              <Arrow />
            </button>
          </div>

          <div className={styles.counter}>
            {String(safeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </>
      )}
    </div>
  );
}
