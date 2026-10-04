// Publications: the published projects, each shown exactly as it
// appears on the Projects page. Which ones count lives in lib/data.js.

import PageTitle from '@/components/PageTitle';
import ProjectSection from '@/components/ProjectSection';
import { projects, publicationIds } from '@/lib/data';

export const metadata = { title: 'Publications - Nidhi Poojari' };

export default function PublicationsPage() {
  const published = publicationIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="page">
      <PageTitle text="Publications" />

      {published.map((p, idx) => (
        <ProjectSection key={p.id} p={p} index={idx + 1} />
      ))}
    </div>
  );
}
