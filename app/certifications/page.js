// Certifications as an index list — see components/CertList for the
// motion. Content in lib/data.js, as always.

import { certifications } from '@/lib/data';
import PageTitle from '@/components/PageTitle';
import CertList from '@/components/CertList';

export const metadata = { title: 'Certifications - Nidhi Poojari' };

export default function CertificationsPage() {
  return (
    <div className="page">
      <PageTitle text="Certifications" />
      <CertList items={certifications} />
    </div>
  );
}
