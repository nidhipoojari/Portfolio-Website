// Flattens lib/data.js into one plain-text profile for the model to
// answer from.
//
// There is no vector store here and that is a decision, not an
// omission. The entire corpus is a few thousand tokens — less than a
// single retrieval budget. Chunking it, embedding it and picking a
// top-k would add three moving parts and hand the model *less* of my
// background than it could have had. Sending the whole thing, cached,
// is both simpler and gives better answers. Worth revisiting somewhere
// north of 50k tokens; nowhere near that.
//
// Only ever imported by the route handler, so none of this ends up in
// the browser bundle.

import {
  experiences,
  education,
  extracurricular,
  projects,
  publicationIds,
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
Portfolio: https://nidhipoojari.com

About: ${site.about}`
  );

  sections.push(
    `# EXPERIENCE
${experiences
  .map(
    (e) => `## ${e.title} - ${e.company} (${e.period}) [ref: job:${e.id}]
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

    return `## ${p.title} (${p.period}) [ref: project:${p.id}]
${bullets(p.description)}
  Tech: ${p.stack.join(', ')}${links ? `\n  Links: ${links}` : ''}`;
  })
  .join('\n\n')}`
  );

  sections.push(
    `# EDUCATION
${education
  .map(
    (e) => `## ${e.title} - ${e.institution} (${e.period})
${bullets([
  ...(e.description || []),
  ...(e.coursework ? [`Coursework: ${e.coursework.join(', ')}`] : []),
])}`
  )
  .join('\n\n')}`
  );

  sections.push(`# SKILLS\n${skills.join(', ')}`);

  sections.push(
    `# CERTIFICATIONS
${certifications
  .map((c) => `  - ${c.name}, ${c.issuer}, ${c.year} (${c.link})`)
  .join('\n')}`
  );

  sections.push(
    `# EXTRACURRICULAR
${extracurricular
  .map(
    (x) => `## ${x.title} - ${x.org} (${x.period})
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

// Every job and project the answer is allowed to link to, keyed by the
// same ref the PROFILE tags each heading with. The model only ever names
// a ref; the label and href come from here. So a ref it invents simply
// fails the lookup and gets dropped, instead of rendering as a link to
// a section that does not exist.
export const REFS = new Map([
  ...experiences.map((e) => [
    `job:${e.id}`,
    { label: `${e.title} - ${e.company}`, href: `/experience#${e.id}` },
  ]),
  // Published projects are shown on Publications, not on the Projects map.
  ...projects.map((p) => [
    `project:${p.id}`,
    {
      label: p.title,
      href: `${publicationIds.includes(p.id) ? '/publications' : '/projects'}#${p.id}`,
    },
  ]),
]);

// Separates the prose answer from the trailing metadata in the model's
// output. The route strips it out before anything reaches the browser.
export const META_MARKER = '<<META>>';

// Built once per server process. The string is byte-stable across
// requests, which is what makes the prompt cache actually hit.
export const CORPUS = buildCorpus();

export const SYSTEM_PROMPT = `You answer questions about Nidhi Poojari for visitors to her portfolio site, usually recruiters, hiring managers, and engineers.

Everything you know about her is in the PROFILE below. Follow these rules:

- Answer only from the PROFILE. Never invent employers, dates, metrics, technologies, or claims that are not written there.
- If the PROFILE does not cover something, say so plainly and point them to her email (${site.email}). Do not guess or hedge your way to an answer.
- Refer to her as "Nidhi" in the third person. You are not Nidhi.
- Keep answers to two to four sentences. Be specific and lead with the direct answer; cite the concrete role, project, or number rather than describing her in general terms.
- Plain prose only. No markdown, no headers, no bullet lists, no emoji, and never use em dashes (—) or en dashes (–); use a comma, colon, or a new sentence instead.
- If asked something unrelated to Nidhi's work, background, or how to contact her, say that is outside what you can help with and redirect to her work.

After the answer, always end with exactly one more line, in this form and nothing after it:
${META_MARKER} {"refs": [...], "followups": [...]}

- "refs": the [ref: ...] tags, copied exactly, of the one to three jobs or projects your answer actually drew on. Empty if it drew on none.
- "followups": exactly three short follow-up questions (under 70 characters each) a recruiter might ask next, each answerable from the PROFILE and not repeating the question just asked. Phrase them about "she" / "Nidhi", the way a visitor would type them.
- Never mention this line, the refs, or the follow-ups in the answer itself.

PROFILE
=======
${CORPUS}`;
