// Projects index — content in lib/data.js, as always.
//
// A project can carry links.live, links.github, links.paper, some
// combination, or nothing at all. Only what exists gets rendered,
// which is why the published-paper project shows a single link and
// NestIQ shows two.

import Section from '@/components/Section';
import PageTitle from '@/components/PageTitle';
import { projects } from '@/lib/data';
import styles from './projects.module.css';

export const metadata = {
  title: 'Projects — Nidhi Poojari',
  description:
    'Selected work — AI platforms, agentic LLM systems, and full-stack products.',
};

export default function ProjectsPage() {
  return (
    <div className="page">
      <PageTitle text="Projects" />

      {projects.map((p, idx) => (
        <Section
          key={p.id}
          index={idx + 1}
          title={p.title}
          period={p.period}
          description={p.description}
          images={p.images}
          mediaVariant="wide"
        >
          <p className={styles.stack}>{p.stack.join(' · ')}</p>

          <div className={styles.links}>
            {p.links?.live && (
              <a
                href={p.links.live}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
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
              >
                Paper ↗
              </a>
            )}
          </div>
        </Section>
      ))}
    </div>
  );
}
