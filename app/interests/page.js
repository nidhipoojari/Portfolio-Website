/**
 * app/interests/page.js
 * Lists each interest from lib/data.js as a <Section/>.
 */
import Section from '@/components/Section';
import { interests } from '@/lib/data';

export const metadata = { title: 'Interests — Nidhi Poojari' };

export default function InterestsPage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Interests<span className="accent">.</span>
      </h1>

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
