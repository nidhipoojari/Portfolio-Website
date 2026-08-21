// The NestIQ pipeline, assembling as you scroll it.
//
// A vertical flow rather than the usual left-to-right architecture
// diagram, for two reasons: it reads on a phone without turning into a
// scroll-sideways box, and vertical is the axis the reader is already
// moving along, so each stage arriving as it enters the viewport lands as
// one continuous motion instead of a sequence played at them.
//
// No 'use client', no useEffect, no library. Each stem and each stage own
// a CSS view timeline, so the assembly is scrubbed by scroll position and
// the component ships as markup and a stylesheet.
//
// Resting state is fully assembled — stems at full height, stages at full
// opacity. The collapsed state exists only inside the keyframes, so where
// view timelines are unsupported this is a finished diagram rather than an
// empty column. Firefox is that case today.

import { nestiqPipeline } from '@/lib/data';
import styles from './Pipeline.module.css';

export default function Pipeline() {
  return (
    <figure className={styles.wrap}>
      <figcaption className={styles.caption}>
        <span className={styles.title}>From assignment to production</span>
        <span className={styles.sub}>How NestIQ is put together</span>
      </figcaption>

      <ol className={styles.flow}>
        {nestiqPipeline.map((s, i) => (
          <li className={styles.stage} key={s.stage}>
            {/* The connector belongs to the stage below it, not the one
                above, so the first stage does not carry a stem hanging
                off nothing. */}
            {i > 0 && <span className={styles.stem} aria-hidden="true" />}

            <div className={styles.body}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={styles.text}>
                <h3 className={styles.stageName}>{s.stage}</h3>

                <p className={styles.metricRow}>
                  {/* Type size carries the scale, so the 49 -> 245,000
                      jump is felt a beat before it is read. */}
                  <span
                    className={styles.metric}
                    style={{ '--scale': s.scale }}
                  >
                    {s.metric}
                  </span>
                  <span className={styles.unit}>{s.unit}</span>
                </p>

                <p className={styles.note}>{s.note}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
