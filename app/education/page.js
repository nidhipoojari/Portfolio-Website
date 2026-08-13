import Section from '@/components/Section';
import { education } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Education — Nidhi Poojari' };

export default function EducationPage() {
  return (
    <div className="page">
      <PageTitle text="Education" />

      {education.map((e, idx) => (
        <Section
          key={e.id}
          index={idx + 1}
          title={e.title}
          subtitle={e.institution}
          subtitleHref={e.link}
          period={e.period}
          description={e.description}
          images={e.images}
        />
      ))}
    </div>
  );
}
