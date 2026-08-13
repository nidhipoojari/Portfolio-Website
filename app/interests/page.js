// The non-engineer half. Same Section block as everywhere else.

import Section from '@/components/Section';
import { interests } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Interests — Nidhi Poojari' };

export default function InterestsPage() {
  return (
    <div className="page">
      <PageTitle text="Interests" />

      {interests.map((it, idx) => (
        <Section
          key={it.id}
          index={idx + 1}
          title={it.title}
          description={it.description}
          images={it.images}
        />
      ))}
    </div>
  );
}
