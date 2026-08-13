'use client';
/**
 * components/SplitReveal.js
 * ------------------------------------------------------------------
 * Word-by-word mask reveal for display type. Each word sits inside an
 * overflow-hidden box and slides up from below with a stagger.
 *
 * Splitting is done here rather than with GSAP SplitText — the text is
 * a single line of a heading, so `String.split(' ')` is the whole job.
 *
 * The plain text is always present for screen readers and for the
 * no-JS case; only the visual layer is split into spans.
 *
 * Props:
 *   text    : string to animate
 *   as      : element type (default 'h1')
 *   stagger : ms between words (default 55)
 *   stack   : one word per line instead of flowing inline
 *   inline  : render as an inline box, so siblings sit on the same line
 * ------------------------------------------------------------------
 */
import styles from './SplitReveal.module.css';

export default function SplitReveal({
  text = '',
  as: Tag = 'h1',
  stagger = 55,
  stack = false,
  inline = false,
  className = '',
  ...rest
}) {
  const words = String(text).split(' ').filter(Boolean);

  return (
    <Tag
      className={`${styles.split} ${inline ? styles.inlineSplit : ''} ${className}`
        .replace(/\s+/g, ' ')
        .trim()}
      {...rest}
    >
      {/* Accessible copy — the spans below are decorative duplicates. */}
      <span className={styles.sr}>{text}</span>

      <span
        aria-hidden="true"
        className={`${styles.visual} ${stack ? styles.stacked : ''}`.trim()}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className={styles.mask}>
            <span
              className={styles.word}
              style={{ animationDelay: `${i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
