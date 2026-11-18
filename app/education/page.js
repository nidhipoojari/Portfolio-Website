import Section from '@/components/Section';
import { education } from '@/lib/data';
import PageTitle from '@/components/PageTitle';
import Coursework from '@/components/Coursework';
import { Fragment } from 'react';

export const metadata = { title: 'Education - Nidhi Poojari' };

export default function EducationPage() {
  return (
    <div className="page">
      <PageTitle text="Education" />

      {education.map((e, idx) => (
        <Fragment key={e.id}>
          <Section
            index={idx + 1}
            title={e.title}
            subtitle={e.institution}
            subtitleHref={e.link}
            period={e.period}
            description={e.description}
            images={e.images}
            hasChildren={!!e.highlights?.length}
          >
            {e.coursework && <Coursework items={e.coursework} icon={e.courseIcon} />}
          </Section>
          {/* Unnumbered and nested, so it reads as part of the degree
              and the degrees keep their 01 / 02. */}
          {e.highlights?.map((h) => (
            <Section
              key={h.id}
              id={h.id}
              title={h.title}
              subtitle={h.subtitle}
              description={h.description}
              images={h.images}
              mediaVariant="wide"
              nested
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
