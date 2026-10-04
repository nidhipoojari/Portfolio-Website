// Coursework as a row of small rounded tags, each marked with the
// school's own emblem (UMBC's shield, SIES's sun), popping in one after
// another. Hovering a tag brings the emblem into colour.

import Reveal from './Reveal';
import styles from './Coursework.module.css';

export default function Coursework({ items, icon }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Coursework</p>
      <ul className={styles.list}>
        {items.map((name, i) => (
          <Reveal as="li" key={name} className={styles.item} delay={120 + i * 70}>
            {icon && <img src={icon} alt="" className={styles.icon} />}
            {name}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
