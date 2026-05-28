/**
 * app/education/page.js
 */
import Section from '@/components/Section';
import { education } from '@/lib/data';

export const metadata = { title: 'Education — Nidhi Poojari' };

export default function EducationPage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Education<span className="accent">.</span>
      </h1>

      {education.map((e, idx) => (
        <Section
          key={e.id}
          index={idx + 1}
          title={e.title}
          subtitle={e.institution}
          period={e.period}
          description={e.description}
          images={e.images}
        />
      ))}
    </div>
  );
}
