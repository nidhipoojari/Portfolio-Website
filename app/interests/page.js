// The non-engineer half, as a slow orbit you hover to choose from.

import InterestOrbit from '@/components/InterestOrbit';
import { interests } from '@/lib/data';
import PageTitle from '@/components/PageTitle';

export const metadata = { title: 'Interests - Nidhi Poojari' };

export default function InterestsPage() {
  return (
    <div className="page">
      <PageTitle text="Interests" />
      <InterestOrbit items={interests} />
    </div>
  );
}
