'use client';
/**
 * Word-by-word mask reveal for headings. Each word sits in an
 * overflow-hidden box and slides up from underneath, one after the
 * next.
 *
 * GSAP SplitText does this and a great deal more. Here the input is a
 * single line of heading text, so `split(' ')` is the entire algorithm
 * and the animation is six lines of CSS.
 *
 * Note the two layers below: the real string stays in the DOM for
 * screen readers and for the no-JS case, and the per-word spans are
 * aria-hidden decoration on top of it.
 *
 * @param text    The string to animate.
 * @param as      Element to render as. Defaults to h1.
 * @param stagger Milliseconds between words.
 * @param stack   One word per line instead of flowing inline.
 * @param inline  Render inline so siblings share the line — used by
 *                PageTitle to keep its accent period attached.
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
