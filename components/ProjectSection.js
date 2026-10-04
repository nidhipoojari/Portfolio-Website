// One project, rendered as a full section: copy, stack, links, and the
// bespoke figure where a project has one. Shared by the Projects map
// (as a stacked detail pane) and the Publications page (as a normal
// section), so there is one copy to edit.
//
// `anchored` puts the project's id on the section. The Projects map
// turns it off: the map owns /projects#id, and an anchor here would make
// the browser jump on arrival, racing the map's own scroll.

import Section from '@/components/Section';
import Pipeline from '@/components/Pipeline';
import InterferenceFigure from '@/components/InterferenceFigure';
import Story from '@/components/Story';
import styles from '@/app/projects/projects.module.css';

export default function ProjectSection({ p, index, stacked = false, anchored = true }) {
  return (
    <Section
      id={anchored ? p.id : undefined}
      index={index}
      title={p.title}
      subtitle={p.subtitle}
      period={p.period}
      description={p.story ? [] : p.description}
      images={p.images}
      mediaVariant="wide"
      stacked={stacked}
    >
      {p.story && <Story story={p.story} />}

      <p className={styles.stack}>{p.stack.join(' · ')}</p>

      <div className={styles.links}>
        {p.links?.live && (
          <a
            href={p.links.live}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
            data-umami-event="project-link"
            data-umami-event-project={p.id}
            data-umami-event-kind="live"
          >
            Live ↗
          </a>
        )}
        {p.links?.github && (
          <a
            href={p.links.github}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
            data-umami-event="project-link"
            data-umami-event-project={p.id}
            data-umami-event-kind="github"
          >
            GitHub ↗
          </a>
        )}
        {p.links?.paper && (
          <a
            href={p.links.paper}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
            data-umami-event="project-link"
            data-umami-event-project={p.id}
            data-umami-event-kind="paper"
          >
            Paper ↗
          </a>
        )}
      </div>

      {/* Two projects carry a bespoke piece each, both showing what
          their prose otherwise only claims. */}
      {p.id === 'nestiq' && <Pipeline />}
      {p.id === 'ionosphericTec' && <InterferenceFigure />}
    </Section>
  );
}
