'use client';
// Certifications as an index rather than a grid of cards: one hairline
// row per certificate, the whole row is the link.
//
// The motion, all hand-rolled:
//   - rows reveal one after another, each hairline drawing itself in
//   - hovering a row slides its name over and quiets the other rows
//   - the issuer's logo floats beside the cursor, trailing it with a
//     lerp and leaning into the direction of travel
// Touch screens and reduced-motion visitors get the plain list — no
// floating logo, nothing that depends on a pointer.

import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import styles from './CertList.module.css';

export default function CertList({ items }) {
  const listRef = useRef(null);
  const floatRef = useRef(null);
  const [active, setActive] = useState(null);
  const [enabled, setEnabled] = useState(false);

  // Only for a real mouse, and only if motion is welcome.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !calm);
  }, []);

  // The trailing logo. Target is the raw pointer; position eases toward
  // it every frame, and the gap between the two becomes the lean.
  useEffect(() => {
    if (!enabled) return;
    const list = listRef.current;
    const el = floatRef.current;
    if (!list || !el) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let placed = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // First move: jump there, so the logo doesn't fly in from 0,0.
      if (!placed) {
        pos.x = target.x;
        pos.y = target.y;
        placed = true;
      }
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      const lean = Math.max(-14, Math.min(14, (target.x - pos.x) * 0.25));
      el.style.transform = `translate3d(${pos.x + 36}px, ${pos.y - 112}px, 0) rotate(${lean}deg)`;
      raf = requestAnimationFrame(tick);
    };

    list.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      list.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <div
      ref={listRef}
      className={`${styles.list} ${active !== null ? styles.hasActive : ''}`}
      onMouseLeave={() => setActive(null)}
    >
      <div className={styles.head} aria-hidden="true">
        <span />
        <span>Certificate</span>
        <span>Issuer</span>
        <span>Year</span>
        <span />
      </div>

      {items.map((c, idx) => (
        <Reveal
          key={c.id}
          as="a"
          href={c.link}
          target="_blank"
          rel="noreferrer"
          className={`${styles.row} ${active === idx ? styles.rowOn : ''}`}
          delay={idx * 70}
          onMouseEnter={() => setActive(idx)}
          onFocus={() => setActive(idx)}
          onBlur={() => setActive(null)}
          data-umami-event="certificate-link"
          data-umami-event-id={c.id}
        >
          {/* The mark printed on the certificate itself: KodeKloud's
              cloud on all of theirs, the UMBC badge on that one. */}
          <span className={styles.icon}>
            <img src={c.iconSrc} alt="" />
          </span>
          <span className={styles.name}>{c.name}</span>
          <span className={styles.issuer}>{c.issuer}</span>
          <span className={styles.year}>{c.year}</span>
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M6 18 L18 6 M9 6 H18 V15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Reveal>
      ))}

      {enabled && (
        <div ref={floatRef} className={styles.float} aria-hidden="true">
          {items.map((c, idx) => (
            <img
              key={c.id}
              src={c.iconSrc}
              alt=""
              className={`${styles.logo} ${active === idx ? styles.logoOn : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
