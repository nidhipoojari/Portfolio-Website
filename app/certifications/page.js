// Grid of certificate cards. The whole card is the link, so the
// clickable area is the card and not just the "View Certificate" text
// at the bottom of it.

import { certifications } from '@/lib/data';
import PageTitle from '@/components/PageTitle';
import Reveal from '@/components/Reveal';
import styles from './certifications.module.css';

export const metadata = { title: 'Certifications — Nidhi Poojari' };

export default function CertificationsPage() {
  return (
    <div className="page">
      <PageTitle text="Certifications" />

      <div className={styles.grid}>
        {certifications.map((c, idx) => (
          <Reveal
            key={c.id}
            as="a"
            href={c.link}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
            delay={(idx % 3) * 90}
          >
            <img src={c.iconSrc} alt={`${c.issuer} logo`} className={styles.icon} />
            <h3 className={styles.name}>{c.name}</h3>
            <p className={styles.issuer}>{c.issuer}</p>
            <p className={styles.year}>{c.year}</p>
            <span className={styles.cta}>View Certificate ↗</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
