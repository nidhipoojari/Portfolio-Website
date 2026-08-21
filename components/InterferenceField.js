'use client';
// A slow interference field behind the hero, from the ionospheric TEC
// project's own physics.
//
// Travelling ionospheric disturbances — the wave-like perturbations in
// total electron content that a GPS receiver sees as ranging error — are
// modelled as a superposition of plane waves. That is literally what this
// draws: four plane waves at different wavelengths, bearings and phase
// speeds, summed, sampled on a grid. The pattern is not a decorative
// noise function that happens to look wavy; it is the same expression,
// with amplitudes picked to look like something rather than to match a
// measurement.
//
// Canvas 2D rather than WebGL on purpose: this is a few thousand one-pixel
// rectangles, which the 2D context handles without a shader pipeline, a
// context loss path, or 150 kB of library.

import { useEffect, useRef } from 'react';
import styles from './InterferenceField.module.css';

// amp: relative weight · len: wavelength in px · dir: bearing in radians
// speed: phase speed, sign sets direction of travel · phase: offset so the
// four are not born aligned.
// Speeds are ~5x the first draft. The marks sit on a fixed grid and only
// their brightness changes, so the eye has no moving object to latch
// onto — it reads the pattern's travel instead. At the original 0.055 the
// bands crossed the screen at about 10px/s, which is below the threshold
// where that registers as motion at all: it looked like a static texture.
const WAVES = [
  { amp: 1.0, len: 190, dir: 0.35, speed: 0.27, phase: 0.0 },
  { amp: 0.7, len: 120, dir: 2.1, speed: -0.2, phase: 1.7 },
  { amp: 0.45, len: 74, dir: 1.05, speed: 0.39, phase: 3.4 },
  { amp: 0.3, len: 47, dir: 4.0, speed: -0.47, phase: 5.1 },
];

const FPS = 30; // the field drifts; 60 would buy nothing and cost double
const MAX_DPR = 1.5; // the marks are ~2px, so full retina is wasted work

/**
 * @param alpha Peak opacity of the brightest crests. Ambient texture and
 *              an illustrative panel want very different values — faint
 *              enough to go unnoticed is exactly wrong when the pattern
 *              IS the point.
 * @param step  Pixels between samples. Lower is denser and costs more.
 */
export default function InterferenceField({ alpha = 0.3, step = 22 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const ampSum = WAVES.reduce((s, w) => s + w.amp, 0);
    const waves = WAVES.map((w) => ({
      ...w,
      kx: (Math.PI * 2 * Math.cos(w.dir)) / w.len,
      ky: (Math.PI * 2 * Math.sin(w.dir)) / w.len,
      omega: Math.PI * 2 * w.speed,
      // Filled on resize: sin/cos of the x-term for every column. See the
      // angle-addition trick in draw().
      colSin: null,
      colCos: null,
    }));

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;
    // Two independent conditions, tracked separately on purpose. Folding
    // them into one flag makes the tab-hidden case unrecoverable: the
    // handler would AND the new state against an already-false flag and
    // the field would never restart.
    let inView = true;
    let pageVisible = true;

    function readColor() {
      // The palette lives in CSS custom properties, and canvas cannot read
      // those. Taking the computed `color` off the element means the CSS
      // stays the single source of truth for both themes.
      ctx.fillStyle = getComputedStyle(canvas).color || '#888';
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / step) + 1;
      rows = Math.ceil(height / step) + 1;

      for (const w of waves) {
        w.colSin = new Float32Array(cols);
        w.colCos = new Float32Array(cols);
        for (let i = 0; i < cols; i += 1) {
          const a = w.kx * (i * step);
          w.colSin[i] = Math.sin(a);
          w.colCos[i] = Math.cos(a);
        }
      }

      readColor();
    }

    function draw(t) {
      ctx.clearRect(0, 0, width, height);

      for (let j = 0; j < rows; j += 1) {
        const y = j * step;

        // Per row, per wave, reduce the whole plane wave to two constants.
        // sin(A + B) = sinA·cosB + cosA·sinB, where A is the x-term
        // precomputed above and B is everything that depends on y and t.
        // The inner loop is then multiply-add only — no trig at all, which
        // is what makes a few thousand samples a frame free.
        const sinB = [];
        const cosB = [];
        for (let k = 0; k < waves.length; k += 1) {
          const w = waves[k];
          const b = w.ky * y - w.omega * t + w.phase;
          sinB[k] = Math.sin(b);
          cosB[k] = Math.cos(b);
        }

        for (let i = 0; i < cols; i += 1) {
          let v = 0;
          for (let k = 0; k < waves.length; k += 1) {
            const w = waves[k];
            v += w.amp * (w.colSin[i] * cosB[k] + w.colCos[i] * sinB[k]);
          }

          // -ampSum..ampSum -> 0..1, then squared. The gamma is what keeps
          // this a field with a few bright crests rather than an even grey
          // wash over the type.
          const n = (v / ampSum + 1) * 0.5;
          const a = n * n * n * alpha;
          if (a < 0.012) continue; // invisible: not worth the fill

          ctx.globalAlpha = a;
          const size = 1 + n * 1.4;
          ctx.fillRect(i * step, y, size, size);
        }
      }

      ctx.globalAlpha = 1;
    }

    const loop = (now) => {
      frame = requestAnimationFrame(loop);
      if (!inView || !pageVisible) return;
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now / 1000);
    };

    resize();
    frame = requestAnimationFrame(loop);

    // Off-screen or backgrounded, this should cost nothing. A hero field
    // still animating three sections down, or in a tab nobody is looking
    // at, is pure battery.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      // Reset the throttle so the first frame back is drawn immediately
      // rather than waiting out a stale timestamp.
      if (pageVisible) last = 0;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Light/dark is an attribute flip on <html>, with no event to listen
    // for, so the colour is re-read when it changes.
    const mo = new MutationObserver(readColor);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [alpha, step]);

  return <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />;
}
