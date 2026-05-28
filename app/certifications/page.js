/**
 * app/certifications/page.js
 * Simple grid of certificate cards with icon + link.
 */
import { certifications } from '@/lib/data';
import styles from './certifications.module.css';

export const metadata = { title: 'Certifications — Nidhi Poojari' };

export default function CertificationsPage() {
  return (
    <div className="page">
      <h1 className="page-title">
        Certifications<span className="accent">.</span>
      </h1>

      <div className={styles.grid}>
        {certifications.map((c) => (
          <a
            key={c.id}
            href={c.link}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <img src={c.iconSrc} alt={`${c.issuer} logo`} className={styles.icon} />
            <h3 className={styles.name}>{c.name}</h3>
            <p className={styles.issuer}>{c.issuer}</p>
            <p className={styles.year}>{c.year}</p>
            <span className={styles.cta}>View Certificate ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
