'use client';
/**
 * Interests as a slow orbit: three points on a hairline ring that
 * drifts on its own. Hovering (or tapping, or tabbing to) a point
 * selects it — the ring eases to a stop, a small marker glides along
 * the circle to the point, and the copy and photos swap underneath.
 *
 * anime.js drives the continuous parts (ring drift, marker travel);
 * motion handles the content crossfade. Both go still under
 * prefers-reduced-motion.
 *
 * @param items Entries from `interests` in lib/data.js.
 */
import { useEffect, useRef, useState } from 'react';
import { animate, createTimer } from 'animejs';
import { AnimatePresence, motion } from 'motion/react';
import Carousel from './Carousel';
import styles from './InterestOrbit.module.css';

const DRIFT = 5; // degrees per second while idle
const R = 42; // ring radius, % of the box

export default function InterestOrbit({ items }) {
  const [active, setActive] = useState(0);
  const ringRef = useRef(null);
  const markerRef = useRef(null);
  // Mutable animation state, kept out of React so the 60fps loop
  // never re-renders anything.
  const s = useRef({ rot: 0, vel: DRIFT, marker: -90, reduced: false });

  // Points spaced evenly, the first at twelve o'clock.
  const angles = items.map((_, i) => -90 + (360 / items.length) * i);

  useEffect(() => {
    const st = s.current;
    st.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (st.reduced) st.vel = 0;

    const timer = createTimer({
      onUpdate: (self) => {
        st.rot = (st.rot + (st.vel * self.deltaTime) / 1000) % 360;
        ringRef.current?.style.setProperty('--rot', `${st.rot}deg`);
      },
    });
    return () => timer.revert();
  }, []);

  const placeMarker = () => {
    const a = (s.current.marker * Math.PI) / 180;
    markerRef.current?.style.setProperty('--mx', `${50 + R * Math.cos(a)}%`);
    markerRef.current?.style.setProperty('--my', `${50 + R * Math.sin(a)}%`);
  };

  const setDrift = (v) => {
    if (s.current.reduced) return;
    animate(s.current, { vel: v, duration: 900, ease: 'outQuad' });
  };

  const select = (i) => {
    setActive(i);
    const st = s.current;
    // Shortest way round, so the marker never takes the long arc.
    const delta = ((angles[i] - st.marker + 540) % 360) - 180;
    animate(st, {
      marker: st.marker + delta,
      duration: st.reduced ? 0 : 700,
      ease: 'inOutCubic',
      onUpdate: placeMarker,
    });
  };

  useEffect(placeMarker, []);

  // A click (not a hover) from further down the page brings the orbit
  // and its copy back into view, clear of the sticky nav.
  const wrapRef = useRef(null);
  const reveal = () => {
    const el = wrapRef.current;
    if (!el) return;
    const offset = 96;
    const top = el.getBoundingClientRect().top;
    if (top > 0 && top < offset * 1.5) return;
    const target = window.scrollY + top - offset;
    if (window.__lenis) window.__lenis.scrollTo(target, { immediate: s.current.reduced });
    else window.scrollTo({ top: target, behavior: s.current.reduced ? 'auto' : 'smooth' });
  };

  const item = items[active];
  const fade = {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -6, filter: 'blur(4px)' },
    transition: { duration: 0.45, ease: [0.22, 0.68, 0.12, 1] },
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.left}>
        <div
          ref={ringRef}
          className={styles.orbit}
          role="tablist"
          aria-label="Interests"
          onPointerEnter={() => setDrift(0)}
          onPointerLeave={() => setDrift(DRIFT)}
        >
          <div className={styles.ring}>
            <svg viewBox="0 0 100 100" className={styles.circle} aria-hidden="true">
              <circle cx="50" cy="50" r={R} />
            </svg>
            <span ref={markerRef} className={styles.marker} aria-hidden="true" />

            {items.map((it, i) => {
              const a = (angles[i] * Math.PI) / 180;
              return (
                <button
                  key={it.id}
                  type="button"
                  role="tab"
                  id={`orbit-tab-${it.id}`}
                  aria-selected={i === active}
                  aria-controls="orbit-panel"
                  className={`${styles.node} ${i === active ? styles.on : ''}`}
                  style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%` }}
                  onPointerEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onClick={() => {
                    select(i);
                    reveal();
                  }}
                >
                  <span className={styles.dot} />
                  <span className={styles.label}>
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    {it.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div id="orbit-panel" role="tabpanel" aria-labelledby={`orbit-tab-${item.id}`} className={styles.copy}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={item.id} {...fade}>
              <h2 className={styles.title}>{item.title}</h2>
              {item.description.map((line, i) => (
                <p key={i} className={styles.body}>{line}</p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.media}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={item.id} {...fade}>
            <Carousel images={item.images} alt={item.title} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
