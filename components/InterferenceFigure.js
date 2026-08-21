// The interference field as an illustration rather than as atmosphere.
//
// It began behind the hero, where it was ambient — and ambient motion
// argues with the rule globals.css sets out for the whole site, that
// motion reveals and never decorates. Sitting with the project it came
// from, captioned, it is doing the same job as the NestIQ pipeline and
// the BSE tape: showing the thing the prose claims instead of asserting
// it. The prose says the ionosphere delays a GPS signal by an amount that
// is never constant. This is what that looks like.
//
// A server component wrapping the client canvas, so only the canvas
// itself ships as client JavaScript.

import InterferenceField from './InterferenceField';
import styles from './InterferenceFigure.module.css';

export default function InterferenceFigure() {
  return (
    <figure className={styles.wrap}>
      <div className={styles.frame}>
        {/* Far more visible than the hero version was. Faint enough to go
            unnoticed is exactly wrong when the pattern is the point. */}
        <InterferenceField alpha={0.85} step={14} />
      </div>

      <figcaption className={styles.caption}>
        Travelling ionospheric disturbances — four plane waves summed. Not a
        measurement: the expression the project models, drawn live.
      </figcaption>
    </figure>
  );
}
