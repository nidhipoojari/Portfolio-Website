// The scrolling skills strip on the home page.
//
// The trick is that the list is rendered twice and the track slides by
// exactly -50%: copy B lands where copy A started, so the loop has no
// seam. All CSS — there is no JavaScript in this file at all.

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
