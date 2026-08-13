/**
 * components/Marquee.js
 * ------------------------------------------------------------------
 * Infinite horizontal strip of skills, bounded by hairlines.
 *
 * Pure CSS: the list is rendered twice and the track is translated by
 * -50%, so the second copy lands exactly where the first began and the
 * loop is seamless. No JS, no library, no layout thrash.
 * ------------------------------------------------------------------
 */
import styles from './Marquee.module.css';

export default function Marquee({ items = [], speed = 60 }) {
  if (!items.length) return null;

  const row = (keyPrefix) =>
    items.map((item, i) => (
      <li key={`${keyPrefix}-${i}`} className={styles.item}>
        {item}
      </li>
    ));

  return (
    <div className={styles.wrap} aria-label="Technologies">
      <div
        className={styles.track}
        style={{ animationDuration: `${speed}s` }}
      >
        <ul className={styles.list}>{row('a')}</ul>
        {/* Duplicate copy — hidden from assistive tech. */}
        <ul className={styles.list} aria-hidden="true">
          {row('b')}
        </ul>
      </div>
    </div>
  );
}
