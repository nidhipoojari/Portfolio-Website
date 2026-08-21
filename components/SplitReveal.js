'use client';
/**
 * Word-by-word mask reveal for headings. Each word sits in an
 * overflow-hidden box and slides up from underneath, one after the
 * next.
 *
 * GSAP SplitText does this and a great deal more. Here the input is a
 * single line of heading text, so splitting it is the entire algorithm
 * and the animation is six lines of CSS.
 *
 * Note the two layers below: the real string stays in the DOM for
 * screen readers and for the no-JS case, and the per-piece spans are
 * aria-hidden decoration on top of it.
 *
 * @param text    The string to animate.
 * @param as      Element to render as. Defaults to h1.
 * @param by      'word' (default) or 'char'. Character granularity is
 *                for display type large enough to carry it — one letter
 *                at a time on a subhead reads as a gimmick, and on long
 *                strings it is a lot of spans for very little. Words
 *                stay the default for exactly that reason.
 * @param stagger Milliseconds between pieces. Character mode wants a
 *                much smaller value than word mode; 13 letters at a
 *                word-mode stagger is over a second of waiting.
 * @param stack   One word per line instead of flowing inline.
 * @param inline  Render inline so siblings share the line — used by
 *                PageTitle to keep its accent period attached.
 */
import styles from './SplitReveal.module.css';

export default function SplitReveal({
  text = '',
  as: Tag = 'h1',
  by = 'word',
  stagger = 55,
  stack = false,
  inline = false,
  className = '',
  ...rest
}) {
  const words = String(text).split(' ').filter(Boolean);
  const byChar = by === 'char';

  // Character mode still groups by word. Splitting the whole string into
  // loose letters would let a line break fall mid-word, and every letter
  // would need its own margin to fake the spacing back. Keeping the word
  // as the layout unit means wrapping still works and only the animation
  // granularity changes.
  //
  // The delay has to accumulate across words rather than restart per
  // word, or every word would begin at once.
  let piece = 0;

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
        {words.map((word, i) =>
          byChar ? (
            <span key={`${word}-${i}`} className={styles.wordGroup}>
              {Array.from(word).map((ch, j) => {
                const delay = piece * stagger;
                piece += 1;
                return (
                  <span key={`${ch}-${j}`} className={styles.mask}>
                    <span
                      className={styles.word}
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      {ch}
                    </span>
                  </span>
                );
              })}
            </span>
          ) : (
            <span key={`${word}-${i}`} className={styles.mask}>
              <span
                className={styles.word}
                style={{ animationDelay: `${i * stagger}ms` }}
              >
                {word}
              </span>
            </span>
          )
        )}
      </span>
    </Tag>
  );
}
