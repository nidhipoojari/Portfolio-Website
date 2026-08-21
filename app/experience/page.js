// One <Section/> per role. The roles themselves live in lib/data.js.

import { Fragment } from 'react';
import Section from '@/components/Section';
import Marquee from '@/components/Marquee';
import { experiences, bseTape } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Experience — Nidhi Poojari' };

export default function ExperiencePage() {
  return (
    <div className="page">
      <PageTitle text="Experience" />

      {experiences.map((exp, idx) => (
        <Fragment key={exp.id}>
          <Section
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

          {/* Full width, between roles — a divider rather than something
              wedged into the copy column. Reduced-motion behaviour comes
              free from Marquee, which turns the strip into a scrollable
              list rather than stopping it dead. */}
          {exp.id === 'bse' && (
            <Marquee
              items={bseTape}
              speed={48}
              variant="tape"
              label="Bombay Stock Exchange — role metrics"
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
