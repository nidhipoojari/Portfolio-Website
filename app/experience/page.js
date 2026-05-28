/**
 * app/experience/page.js
 * Lists each role from lib/data.js as a <Section/>.
 */
import Section from '@/components/Section';
import { experiences } from '@/lib/data';

export const metadata = { title: 'Experience — Nidhi Poojari' };

export default function ExperiencePage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Experience<span className="accent">.</span>
      </h1>

      {experiences.map((exp, idx) => (
        <Section
          key={exp.id}
          index={idx + 1}
          title={exp.title}
          subtitle={exp.company}
          period={exp.period}
          description={exp.description}
          images={exp.images}
        >
          <p className="subtle" style={{ marginTop: '1rem', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {exp.stack.join(' · ')}
          </p>
        </Section>
      ))}
    </div>
  );
}
