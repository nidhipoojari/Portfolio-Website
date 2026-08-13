// One <Section/> per role. The roles themselves live in lib/data.js.

import Section from '@/components/Section';
import { experiences } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Experience — Nidhi Poojari' };

export default function ExperiencePage() {
  return (
    <div className="page">
      <PageTitle text="Experience" />

      {experiences.map((exp, idx) => (
        <Section
          key={exp.id}
          index={idx + 1}
          title={exp.title}
          subtitle={exp.company}
          subtitleHref={exp.link}
          period={exp.period}
          description={exp.description}
          images={exp.images}
          mediaVariant={exp.mediaVariant}
        >
          <p className="subtle" style={{ marginTop: '1rem', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {exp.stack.join(' · ')}
          </p>
        </Section>
      ))}
    </div>
  );
}
