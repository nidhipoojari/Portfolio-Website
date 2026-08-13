/**
 * lib/corpus.js
 * ------------------------------------------------------------------
 * Flattens lib/data.js into a single plain-text profile that gets sent
 * to the model as grounding context.
 *
 * Why no vector search: the whole corpus is a few thousand tokens —
 * smaller than one retrieval budget. Embedding it, storing vectors and
 * selecting a top-k subset would add moving parts and *remove* context
 * the model could have used. Sending all of it, cached, is simpler and
 * answers better. Revisit only if this grows past ~50k tokens.
 *
 * Server-only: imported by the route handler, never by a client
 * component, so none of this ships in the browser bundle.
 * ------------------------------------------------------------------
 */
import {
  experiences,
  education,
  extracurricular,
  projects,
  certifications,
  interests,
  skills,
  site,
} from './data';

const bullets = (lines) => lines.map((l) => `  - ${l}`).join('\n');

function buildCorpus() {
  const sections = [];

  sections.push(
    `# PROFILE
Name: ${site.name}
Role: ${site.role}
Focus: ${site.fusion}
Location: Baltimore, Maryland
Email: ${site.email}
LinkedIn: ${site.linkedin}
GitHub: ${site.github}
Portfolio: https://nidhipoojari.vercel.app

About: ${site.about}`
  );

  sections.push(
    `# EXPERIENCE
${experiences
  .map(
    (e) => `## ${e.title} — ${e.company} (${e.period})
${bullets(e.description)}
  Tech: ${e.stack.join(', ')}`
  )
  .join('\n\n')}`
  );

  sections.push(
    `# PROJECTS
${projects
  .map((p) => {
    const links = [
      p.links?.live && `live: ${p.links.live}`,
      p.links?.github && `source: ${p.links.github}`,
    ]
      .filter(Boolean)
      .join(', ');

    return `## ${p.title} (${p.period})
${bullets(p.description)}
  Tech: ${p.stack.join(', ')}${links ? `\n  Links: ${links}` : ''}`;
  })
  .join('\n\n')}`
  );

  sections.push(
    `# EDUCATION
${education
  .map(
    (e) => `## ${e.title} — ${e.institution} (${e.period})
${bullets(e.description)}`
  )
  .join('\n\n')}`
  );

  sections.push(`# SKILLS\n${skills.join(', ')}`);

  sections.push(
    `# CERTIFICATIONS
${certifications
  .map((c) => `  - ${c.name} — ${c.issuer}, ${c.year} (${c.link})`)
  .join('\n')}`
  );

  sections.push(
    `# EXTRACURRICULAR
${extracurricular
  .map(
    (x) => `## ${x.title} — ${x.org} (${x.period})
${bullets(x.description)}`
  )
  .join('\n\n')}`
  );

  sections.push(
    `# INTERESTS
${interests.map((i) => `## ${i.title}\n${bullets(i.description)}`).join('\n\n')}`
  );

  return sections.join('\n\n');
}

// Built once per server process. The string is byte-stable across
// requests, which is what makes the prompt cache actually hit.
export const CORPUS = buildCorpus();

export const SYSTEM_PROMPT = `You answer questions about Nidhi Poojari for visitors to her portfolio site — usually recruiters, hiring managers, and engineers.

Everything you know about her is in the PROFILE below. Follow these rules:

- Answer only from the PROFILE. Never invent employers, dates, metrics, technologies, or claims that are not written there.
- If the PROFILE does not cover something, say so plainly and point them to her email (${site.email}) — do not guess or hedge your way to an answer.
- Refer to her as "Nidhi" in the third person. You are not Nidhi.
- Keep answers to two to four sentences. Be specific and lead with the direct answer; cite the concrete role, project, or number rather than describing her in general terms.
- Plain prose only. No markdown, no headers, no bullet lists, no emoji.
- If asked something unrelated to Nidhi's work, background, or how to contact her, say that is outside what you can help with and redirect to her work.

PROFILE
=======
${CORPUS}`;
