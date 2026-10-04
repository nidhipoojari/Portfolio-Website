// Projects as a mind map: every project on a branch on the left, the
// picked one on the right (components/MindMap). Content in lib/data.js,
// as always.
//
// Published projects (publicationIds) live on the Publications page
// instead, so they're left off the map.

import PageTitle from '@/components/PageTitle';
import ProjectSection from '@/components/ProjectSection';
import MindMap from '@/components/MindMap';
import { projects, projectGroups, publicationIds } from '@/lib/data';

export const metadata = {
  title: 'Projects - Nidhi Poojari',
  description:
    'Selected work: hackathon builds, AI platforms, agentic LLM systems, and full-stack products.',
};

export default function ProjectsPage() {
  const unpublished = projects.filter((p) => !publicationIds.includes(p.id));

  const details = Object.fromEntries(
    unpublished.map((p) => [
      p.id,
      <ProjectSection key={p.id} p={p} stacked anchored={false} />,
    ])
  );

  return (
    <div className="page">
      <PageTitle text="Projects" />

      <MindMap
        groups={projectGroups}
        items={unpublished}
        details={details}
        hubLabel="My work"
        name="projects"
      />
    </div>
  );
}
