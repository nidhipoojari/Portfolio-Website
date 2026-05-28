/**
 * app/page.js — HOME
 * ------------------------------------------------------------------
 * Two-column hero modelled on the supplied reference:
 *   LEFT  : name (large blue serif), subtitle, "EMAIL ME" oval button
 *   RIGHT : 2x2 grid of circular B&W photos + one half-hidden circle
 *           peeking from behind the top-left circle.
 * ------------------------------------------------------------------
 */
import { HOME_IMAGES } from '@/lib/images';
import { site } from '@/lib/data';
import styles from './home.module.css';

export default function HomePage() {
  // Single hero photo on the home page.
  const [hero, second] = HOME_IMAGES;
  const aboutPhoto = second || hero;

  return (
    <>
      <section className={styles.hero}>
        {/* ---------- LEFT ---------- */}
        <div className={styles.left}>
          <h1 className={styles.name}>
            <span>Nidhi</span>
            <span>Poojari</span>
          </h1>

          <p className={styles.tagline}>AI Engineer</p>

          <div className={styles.ctaRow}>
            <a href={`mailto:${site.email}`} className={styles.cta}>
              EMAIL ME
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className={styles.cta}>
              GITHUB
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={styles.cta}>
              LINKEDIN
            </a>
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className={styles.right}>
          <div className={styles.circle}>
            <img src={hero} alt="Nidhi" className="bw" />
          </div>
        </div>
      </section>

      {/* ---------- ABOUT ME ---------- */}
      <section className={styles.about}>
        <div className={styles.aboutPhoto}>
          <img src={aboutPhoto} alt="Nidhi Poojari" />
        </div>
        <div className={styles.aboutText}>
          <h2 className={styles.aboutHeading}>About me</h2>
          <p className={styles.aboutBody}>{site.about}</p>
        </div>
      </section>
    </>
  );
}
