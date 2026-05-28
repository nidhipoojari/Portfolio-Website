/**
 * components/Section.js
 * ------------------------------------------------------------------
 * Reusable two-column section block:
 *   left = title + meta + description (+ optional children)
 *   right = carousel of images
 *
 * Used by Experience, Education, Extracurricular, Projects pages.
 * ------------------------------------------------------------------
 */
import Carousel from './Carousel';
import styles from './Section.module.css';

export default function Section({
  index,
  title,
  subtitle,
  period,
  description = [],
  images = [],
  children,
}) {
  return (
    <article className={styles.section}>
      <div className={styles.text}>
        {typeof index === 'number' && (
          <span className={styles.index}>
            {String(index).padStart(2, '0')}
          </span>
        )}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {period && <p className={styles.period}>{period}</p>}
        <div className={styles.body}>
          {description.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {children}
      </div>

      <div className={styles.media}>
        <Carousel images={images} alt={title} />
      </div>
    </article>
  );
}
