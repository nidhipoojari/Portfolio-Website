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
import Reveal from './Reveal';
import styles from './Section.module.css';

export default function Section({
  index,
  title,
  subtitle,
  subtitleHref,
  period,
  description = [],
  images = [],
  mediaVariant = 'portrait',
  children,
}) {
  // With no images, drop the media column entirely and let the copy run
  // full width — better than showing an empty placeholder frame.
  const hasMedia = images.length > 0;

  return (
    <Reveal
      as="article"
      className={`${styles.section} ${hasMedia ? '' : styles.textOnly}`}
    >
      <div className={styles.text}>
        {typeof index === 'number' && (
          <span className={styles.index}>
            {String(index).padStart(2, '0')}
          </span>
        )}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && (
          <p className={styles.subtitle}>
            {subtitleHref ? (
              <a
                href={subtitleHref}
                target="_blank"
                rel="noreferrer"
                className={styles.subtitleLink}
              >
                {subtitle}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : (
              subtitle
            )}
          </p>
        )}
        {period && <p className={styles.period}>{period}</p>}
        <div className={styles.body}>
          {description.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {children}
      </div>

      {hasMedia && (
        <div
          className={`${styles.media} ${
            mediaVariant === 'wide' ? styles.mediaSticky : ''
          }`}
        >
          <Carousel images={images} alt={title} variant={mediaVariant} />
        </div>
      )}
    </Reveal>
  );
}
