'use client';
// A structured alternative to a Section's paragraphs, for the one or two
// entries that deserve more than prose. Reads `story` from lib/data.js;
// the plain `description` stays there too, because the ask box answers
// from it.
//
// Four pieces, each optional: a lede line, a stepped diagram you can
// hover or tap through, count-up figures, and tabs. All hand-rolled CSS
// transitions, same as the rest of the site — and every one of them
// renders its final state with JavaScript off or reduced motion on.

import { useEffect, useRef, useState } from 'react';
import styles from './Story.module.css';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fires once, the first time the element is properly on screen.
function useSeen(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

// ---------- Stepped diagram ----------
// Walks itself through once when it scrolls into view, then hands over
// to the visitor: the first hover or tap stops the autoplay for good.
function Steps({ from, to, steps }) {
  const ref = useRef(null);
  const seen = useSeen(ref);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!seen || touched || reducedMotion()) return;
    if (active >= steps.length - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), 2200);
    return () => clearTimeout(t);
  }, [seen, touched, active, steps.length]);

  const pick = (i) => {
    setTouched(true);
    setActive(i);
  };

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <div ref={ref} className={styles.steps}>
      <div className={styles.ends}>
        <span>{from}</span>
        <span>{to}</span>
      </div>

      <div className={styles.track} style={{ '--p': progress }}>
        <span className={styles.fill} aria-hidden="true" />
        <ol className={styles.nodes} role="tablist" aria-label="How the handshake works">
          {steps.map((s, i) => (
            <li key={s.label}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${styles.node} ${i <= active ? styles.nodeOn : ''}`}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.nodeLabel}>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Keyed on the step so each change replays the fade-in. */}
      <p key={active} className={styles.stepDetail} aria-live="polite">
        <span className={styles.stepNo}>
          {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </span>
        {steps[active].detail}
      </p>
    </div>
  );
}

// ---------- Count-up figure ----------
// Server-renders the real number, so no-JS and reduced-motion visitors
// see it straight away; only animates once it is actually on screen.
function Stat({ value, prefix = '', suffix = '', label }) {
  const ref = useRef(null);
  const seen = useSeen(ref);
  const [n, setN] = useState(value);

  useEffect(() => {
    if (!seen || reducedMotion()) return;
    const start = performance.now();
    const dur = 1400;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  return (
    <div ref={ref} className={styles.stat}>
      <span className={styles.statValue}>
        {prefix}
        {n.toLocaleString('en-US')}
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

// ---------- agentHire face ----------
// The face from agenthire.biz, used as a list bullet. Same geometry as
// the original 160-unit SVG; only the strokes are thickened, because at
// 2 units they disappear entirely at 1em. currentColor, so it follows
// the theme like the text does.
function Face() {
  return (
    <svg className={styles.face} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <circle cx="80" cy="80" r="62" fill="none" stroke="currentColor" strokeWidth="11" />
      <g className={styles.faceBrows} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
        <path d="M 46 56 Q 56 49 66 55" />
        <path d="M 94 55 Q 104 49 114 56" />
      </g>
      <g className={styles.faceEyes} fill="currentColor">
        <circle cx="58" cy="78" r="10" />
        <circle cx="102" cy="78" r="10" />
      </g>
      <path
        className={styles.faceMouth}
        d="M 58 102 Q 80 112 102 102"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------- Tabs ----------
function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" style={{ '--i': active, '--n': tabs.length }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`${styles.tab} ${i === active ? styles.tabOn : ''}`}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
        <span className={styles.tabBar} aria-hidden="true" />
      </div>

      <ul key={active} className={styles.tabPanel} role="tabpanel">
        {tabs[active].items.map((item, i) => (
          <li key={item} style={{ animationDelay: `${i * 60}ms` }}>
            <Face />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Award row ----------
// Hovering (or tapping) a row throws a small burst of confetti out of the
// trophy. Each piece is a span with its own random end point, spin and
// delay fed in as custom properties; one CSS animation does the rest, and
// the pieces remove themselves when it ends. A short cooldown keeps a
// mouse skimming over the row from turning it into a fountain.
const PIECES = 14;
const COOLDOWN_MS = 900;

function Award({ by, title }) {
  const [bursts, setBursts] = useState([]);
  const last = useRef(0);

  const burst = () => {
    const now = Date.now();
    if (now - last.current < COOLDOWN_MS || reducedMotion()) return;
    last.current = now;

    const pieces = Array.from({ length: PIECES }, (_, i) => {
      // Fan upward and outward, never straight down into the row below.
      const angle = (-160 + Math.random() * 140) * (Math.PI / 180);
      const dist = 40 + Math.random() * 55;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        r: Math.random() * 540 - 270,
        d: Math.random() * 120,
        shape: i % 3,
      };
    });
    const id = now;
    setBursts((b) => [...b, { id, pieces }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1600);
  };

  return (
    <li className={styles.award} onMouseEnter={burst} onClick={burst}>
      <span className={styles.trophy} aria-hidden="true">
        🏆
        {bursts.map((b) => (
          <span key={b.id} className={styles.confetti}>
            {b.pieces.map((p) => (
              <i
                key={p.id}
                className={styles[`piece${p.shape}`]}
                style={{
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                  '--r': `${p.r}deg`,
                  animationDelay: `${p.d}ms`,
                }}
              />
            ))}
          </span>
        ))}
      </span>
      <span className={styles.awardBy}>{by}</span>
      <span className={styles.awardTitle}>{title}</span>
    </li>
  );
}

export default function Story({ story }) {
  const { lede, awards, steps, stats, tabs, footnote } = story;

  return (
    <div className={styles.story}>
      {lede && <p className={styles.lede}>{lede}</p>}

      {awards?.length > 0 && (
        <ul className={styles.awards}>
          {awards.map((a) => (
            <Award key={a.title} {...a} />
          ))}
        </ul>
      )}

      {steps && <Steps {...steps} />}

      {stats?.length > 0 && (
        <div className={styles.stats}>
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      )}

      {tabs?.length > 0 && <Tabs tabs={tabs} />}

      {footnote && <p className={styles.footnote}>{footnote}</p>}
    </div>
  );
}
