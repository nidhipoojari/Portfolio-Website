/**
 * app/projects/page.js
 */
import Section from '@/components/Section';
import { projects } from '@/lib/data';

export const metadata = { title: 'Projects — Nidhi Poojari' };

export default function ProjectsPage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Projects<span className="accent">.</span>
      </h1>

      {projects.map((p, idx) => (
        <Section
          key={p.id}
          index={idx + 1}
          title={p.title}
          period={p.period}
          description={p.description}
          images={p.images}
        >
          <p className="subtle" style={{ marginTop: '1rem', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {p.stack.join(' · ')}
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.25rem', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <a href={p.links.live}   target="_blank" rel="noreferrer" style={{ borderBottom: '1px solid var(--fg-muted)' }}>Live ↗</a>
            <a href={p.links.github} target="_blank" rel="noreferrer" style={{ borderBottom: '1px solid var(--fg-muted)' }}>GitHub ↗</a>
          </div>
        </Section>
      ))}
    </div>
  );
}
