// A scrolling strip. Two of them on the site: the skills list on the home
// page, and the tape under the Bombay Stock Exchange role.
//
// The trick is that the list is rendered twice and the track slides by
// exactly -50%: copy B lands where copy A started, so the loop has no
// seam. All CSS — there is no JavaScript in this file at all.
//
// @param variant 'tape' for the tighter monospace treatment with tick
//                marks. Anything else gets the default strip. The loop
//                mechanism is shared either way — that is the whole
//                reason this is one component and not two.
// @param label   Accessible name. The two strips are different content,
//                so this cannot be hardcoded.

import styles from './Marquee.module.css';

export default function Marquee({
  items = [],
  speed = 60,
  variant,
  label = 'Technologies',
}) {
  if (!items.length) return null;

  const row = (keyPrefix) =>
    items.map((item, i) => (
      <li key={`${keyPrefix}-${i}`} className={styles.item}>
        {item}
      </li>
    ));

  return (
    <div
      className={`${styles.wrap} ${variant === 'tape' ? styles.tape : ''}`.trim()}
      aria-label={label}
    >
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
