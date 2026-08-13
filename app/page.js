/**
 * app/page.js — HOME
 * ------------------------------------------------------------------
 *   HERO    : name (mask-revealed word by word), role, the AI line,
 *             and the contact links
 *   MARQUEE : infinite strip of the stack
 *   ABOUT   : portrait + copy, revealed on scroll
 * ------------------------------------------------------------------
 */
import { HOME_IMAGES } from '@/lib/images';
import { site, skills } from '@/lib/data';
import SplitReveal from '@/components/SplitReveal';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import AskTerminal from '@/components/AskTerminal';
import ThemeToggle from '@/components/ThemeToggle';
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
          <SplitReveal
            as="h1"
            text="Nidhi Poojari"
            stack
            stagger={90}
            className={styles.name}
          />

          <Reveal as="p" className={styles.tagline} delay={260}>
            {site.role}
          </Reveal>

          <Reveal as="p" className={styles.fusion} delay={380}>
            {site.fusion}
          </Reveal>

          <Reveal className={styles.ctaRow} delay={500}>
            <a href={`mailto:${site.email}`} className={styles.cta}>
              EMAIL ME
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className={styles.cta}>
              GITHUB
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={styles.cta}>
              LINKEDIN
            </a>
            <ThemeToggle />
          </Reveal>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className={styles.right}>
          <Reveal className={styles.circle} delay={180}>
            <img src={hero} alt="Nidhi" className="bw" />
          </Reveal>
        </div>
      </section>

      {/* ---------- STACK STRIP ---------- */}
      <Marquee items={skills} speed={70} />

      {/* ---------- ABOUT ME ---------- */}
      <section className={styles.about}>
        <Reveal className={styles.aboutPhoto}>
          <img src={aboutPhoto} alt="Nidhi Poojari" />
        </Reveal>
        <div className={styles.aboutText}>
          <SplitReveal as="h2" text="About me" className={styles.aboutHeading} />
          <Reveal as="p" className={styles.aboutBody} delay={160}>
            {site.about}
          </Reveal>
        </div>
      </section>

      {/* ---------- ASK ---------- */}
      <AskTerminal />
    </>
  );
}
