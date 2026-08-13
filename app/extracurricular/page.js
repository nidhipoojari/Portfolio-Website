import Section from '@/components/Section';
import { extracurricular } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Extracurricular — Nidhi Poojari' };

export default function ExtracurricularPage() {
  return (
    <div className="page">
      <PageTitle text="Extracurricular" />

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
