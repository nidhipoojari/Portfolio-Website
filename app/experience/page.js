// One <Section/> per role, under a Tech / All filter (components/
// RoleFilter). The roles themselves live in lib/data.js.

import Section from '@/components/Section';
import RoleFilter from '@/components/RoleFilter';
import Marquee from '@/components/Marquee';
import { experiences, bseTape } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Experience - Nidhi Poojari' };

export default function ExperiencePage() {
  const techCount = experiences.filter((e) => e.tech !== false).length;

  return (
    <div className="page">
      <PageTitle text="Experience" />

      <RoleFilter techCount={techCount} allCount={experiences.length}>
        {experiences.map((exp) => (
          <div key={exp.id} data-kind={exp.tech === false ? 'other' : 'tech'}>
            <Section
              id={exp.id}
              // Numbered by a CSS counter, so the filter can renumber.
              index={<span className="role-number" />}
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

            {/* Full width, between roles — a divider rather than something
                wedged into the copy column. Reduced-motion behaviour comes
                free from Marquee, which turns the strip into a scrollable
                list rather than stopping it dead. */}
            {exp.id === 'bse' && (
              <Marquee
                items={bseTape}
                speed={48}
                variant="tape"
                label="Bombay Stock Exchange: role metrics"
              />
            )}
          </div>
        ))}
      </RoleFilter>
    </div>
  );
}
