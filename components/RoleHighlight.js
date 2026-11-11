// An event inside a role (a poster, a talk), shown as a sub-entry
// under that role's copy on the Experience page. Content lives on the
// role's `highlights` in lib/data.js.

import styles from './RoleHighlight.module.css';

export default function RoleHighlight({ h, roleId }) {
  return (
    <div className={styles.highlight}>
      <p className={styles.meta}>
        {h.label} · {h.event} · {h.period}
      </p>
      <h3 className={styles.title}>{h.title}</h3>
      <div className={styles.body}>
        {h.description.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {h.link && (
        <a
          href={h.link.href}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          data-umami-event="role-highlight-link"
          data-umami-event-role={roleId}
        >
          {h.link.label} ↗
        </a>
      )}
    </div>
  );
}
