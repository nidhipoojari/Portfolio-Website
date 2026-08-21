// Home. Four movements: hero, skills strip, about, ask box.

import { HOME_IMAGES } from '@/lib/images';
import { site, skills } from '@/lib/data';
import SplitReveal from '@/components/SplitReveal';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import AskTerminal from '@/components/AskTerminal';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './home.module.css';

export default function HomePage() {
  // Two photos if there are two; otherwise the hero shot does double
  // duty further down the page.
  const [hero, second] = HOME_IMAGES;
  const aboutPhoto = second || hero;

  return (
    <>
      <section className={styles.hero}>
        {/* ---------- LEFT ---------- */}
        <div className={styles.left}>
          {/* The only heading on the site big enough for letter
              granularity. Everything else — every PageTitle — stays on
              words, where one letter at a time would read as a gimmick.
              Stagger drops from 90ms to 34ms because there are now 12
              pieces instead of 2. */}
          <SplitReveal
            as="h1"
            text="Nidhi Poojari"
            by="char"
            stack
            stagger={34}
            className={styles.name}
          />

          <Reveal as="p" className={styles.tagline} delay={260}>
            {site.role}
          </Reveal>

          <Reveal as="p" className={styles.fusion} delay={380}>
            {site.fusion}
          </Reveal>

          <Reveal className={styles.ctaRow} delay={500}>
            <a
              href={`mailto:${site.email}`}
              className={styles.cta}
              data-umami-event="contact"
              data-umami-event-via="email"
            >
              EMAIL ME
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className={styles.cta}
              data-umami-event="contact"
              data-umami-event-via="github"
            >
              GITHUB
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.cta}
              data-umami-event="contact"
              data-umami-event-via="linkedin"
            >
              LINKEDIN
            </a>
            <ThemeToggle />
          </Reveal>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className={styles.right}>
          <Reveal className={styles.circle} delay={180}>
            {/* Three transforms, three elements, on purpose. Reveal owns
                the wrapper's, the scroll drift owns this span's, and the
                hover zoom owns the image's. Stack any two of them onto
                one element and the animation silently wins over the
                hover — which is exactly what happened when the drift
                class sat on the img. */}
            <span className={`${styles.drifter} drift`}>
              <img src={hero} alt="Nidhi" className="bw" />
            </span>
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
