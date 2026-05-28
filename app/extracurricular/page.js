/**
 * app/extracurricular/page.js
 */
import Section from '@/components/Section';
import { extracurricular } from '@/lib/data';

export const metadata = { title: 'Extracurricular — Nidhi Poojari' };

export default function ExtracurricularPage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Extra<span className="accent">curricular.</span>
      </h1>

      {extracurricular.map((x, idx) => (
        <Section
          key={x.id}
          index={idx + 1}
          title={x.title}
          subtitle={x.org}
          period={x.period}
          description={x.description}
          images={x.images}
        />
      ))}
    </div>
  );
}
