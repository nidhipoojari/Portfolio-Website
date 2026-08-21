// Everything the site says, in one file.
//
// Every page reads from here, and so does the AI (lib/corpus.js turns
// this into the profile it answers from). Change a job title here and
// it changes on the Experience page and in the ask box at the same
// time — there is nowhere else to update.

import {
  EXPERIENCE_IMAGES,
  EDUCATION_IMAGES,
  EXTRA_IMAGES,
  PROJECT_IMAGES,
  CERT_IMAGES,
  INTEREST_IMAGES,
} from './images';

// ---------- BSE TAPE ----------
// The ticker strip under the Bombay Stock Exchange role.
//
// Every entry is a fact from that role's description further down this
// file, shortened to tape length. It is a tape of HER RECORD, not of
// market data — the original sketch for this was scrolling synthetic FIX
// messages with occasional latency spikes, and that was dropped for the
// same reason the SHAP chart was: invented payloads that look like real
// output are the one thing a portfolio cannot afford, and a stream of
// fake trades says something about an exchange rather than about the
// engineer who kept it up.
//
// Nothing goes in here that is not also true in the `bse` entry.
export const bseTape = [
  'Real-time trading infrastructure',
  '99.99% uptime',
  'Live market hours',
  'FIX protocol — decode · parse · route',
  'Millions of transactions daily',
  'Incident detection −10%',
  'Nov 2021 – Sep 2024',
];

// ---------- NESTIQ PIPELINE ----------
// The stages NestIQ actually has, in the order data moves through them.
//
// Every number and name here is lifted from the NestIQ description
// further down this file — nothing is invented, and nothing should be
// added that is not also true in that prose. The point of the diagram is
// the first two rows: a course dataset of 49 rows became a corpus of
// 245,000, which is four orders of magnitude and the part of this project
// that is about engineering rather than about Airbnb.
//
// `scale` is a 0-1 weight, used only to size the metric type so the jump
// is felt before it is read. It is not data.
export const nestiqPipeline = [
  {
    stage: 'Course dataset',
    metric: '49',
    unit: 'rows',
    note: 'Where it started — a data-mining assignment.',
    scale: 0.1,
  },
  {
    stage: 'Production corpus',
    metric: '245,000+',
    unit: 'listings · 28 US cities',
    note: 'Rebuilt as a real ingestion problem rather than a homework set.',
    scale: 1,
  },
  {
    stage: 'Model layer',
    metric: '7',
    unit: 'data-mining models',
    note: 'scikit-learn and XGBoost, R² ≈ 0.54, every prediction traced back through SHAP attribution.',
    scale: 0.25,
  },
  {
    stage: 'Retrieval layer',
    metric: 'FAISS',
    unit: 'vector index',
    note: 'Sentence-transformer embeddings for semantic search over the corpus.',
    scale: 0.3,
  },
  {
    stage: 'Agent layer',
    metric: '5',
    unit: 'tools',
    note: 'An agentic host advisor and RAG-backed market chat over the same index.',
    scale: 0.25,
  },
  {
    stage: 'Delivery',
    metric: 'FastAPI',
    unit: '+ Next.js 14',
    note: 'Rate-limited streaming backend, containerised with Docker, quality gates in GitHub Actions.',
    scale: 0.3,
  },
];

// ---------- EXPERIENCE ----------
export const experiences = [
  {
    id: 'ga',
    title: 'Graduate Assistant, Grader',
    company: 'University of Maryland, Baltimore County',
    link: 'https://umbc.edu/',
    period: 'Jan 2026 – Present',
    description: [
      'Grading assessments and providing technical mentorship for 30+ undergraduate students across two courses, with live proctoring and real-time debugging of student code.',
      'Breaking down core engineering concepts and resolving technical issues one-on-one to facilitate deeper student understanding.',
      'Web Development Lab (IS 448) — HTML5, CSS3, JavaScript (ES6+), PHP, MySQL, AJAX, REST APIs, DOM manipulation, and responsive design.',
      'Software Security (IS 472) — secure coding standards, vulnerability detection and remediation, secure SDLC, memory safety, input validation, and access control.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'PHP', 'MySQL', 'AJAX', 'REST APIs', 'Secure SDLC', 'Linux'],
    images: EXPERIENCE_IMAGES.ga,
  },
  {
    id: 'nian',
    title: 'Full Stack Developer',
    company: 'NIAN',
    link: 'https://nashikinanutshell.bio.link/',
    mediaVariant: 'wide',
    period: 'Oct 2024 – Dec 2025',
    description: [
      'Optimized RESTful PHP (Laravel) APIs and MySQL queries, achieving 10% improvement in response times (verified via Postman).',
      'Developed React single-page applications with advanced state management (Redux / Context API) and performance optimization techniques including lazy loading and pagination, resulting in 20% improvement in app load performance.',
      'Implemented responsive UI components using CSS with cross-browser compatibility, integrated third-party APIs for seamless data flow.',
    ],
    stack: ['React', 'PHP', 'Laravel', 'MySQL', 'REST APIs', 'Postman', 'Git', 'Docker'],
    images: EXPERIENCE_IMAGES.nian,
  },
  {
    id: 'bse',
    title: 'System Engineer',
    company: 'Bombay Stock Exchange (via TCS)',
    link: 'https://www.bseindia.com/',
    period: 'Nov 2021 – Sep 2024',
    description: [
      'Managed critical real-time trading infrastructure, leading operational decisions for 99.99% uptime during live market hours.',
      'Developed Python and Shell scripts to automate infrastructure monitoring, reducing manual tasks and incident detection time by 10%.',
      'Implemented dashboards using Java and MySQL to visualize real-time system health, transaction throughput, and latency metrics.',
      'Built data processing pipelines for FIX protocol message handling (decoding, parsing, routing), handling millions of transactions daily.',
      'Diagnosed and resolved performance bottlenecks through log analysis and SQL query optimization.',
    ],
    stack: ['Python', 'Shell', 'MySQL', 'Linux', 'REST APIs', 'Jenkins', 'FIX Protocol', 'Networking', 'Broadcast', 'SVN', 'Trading Systems'],
    images: EXPERIENCE_IMAGES.bse,
  },
  {
    id: 'appoctet',
    title: 'Full Stack Developer',
    company: 'AppOctet Technologies',
    link: 'https://www.appoctet.com/',
    mediaVariant: 'wide',
    period: 'Feb 2021 – Jul 2021',
    description: [
      'Architected web apps for tourism and logistics domains, including a delivery management system that reduced dispatch overhead by 25%.',
      'Optimized MySQL database queries and React frontend components, maintaining 99% uptime across production environments.',
      'Designed responsive, mobile-first interfaces using HTML5, CSS3, Bootstrap, and modern JavaScript; managed frontend state with React hooks and component lifecycle.',
    ],
    stack: ['React', 'PHP', 'Laravel', 'CodeIgniter','MySQL', 'Bootstrap', 'JavaScript', 'Git', 'Postman', 'JQuery'],
    images: EXPERIENCE_IMAGES.appoctet,
  },
  {
    id: 'jio',
    title: 'Front End Developer Intern',
    company: 'Reliance Jio Cloud',
    link: 'https://www.jioaicloud.com/',
    period: 'Jun 2019',
    description: [
      'Redesigned JioCloud UI modules to improve usability and performance, architecting state with React hooks and lifecycle methods for maintainable, scalable components.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    images: EXPERIENCE_IMAGES.jio,
  },
];

// ---------- EDUCATION ----------
export const education = [
  {
    id: 'umbc',
    title: 'Master of Science, Information Sciences',
    institution: 'University of Maryland, Baltimore County',
    link: 'https://umbc.edu/',
    period: 'Jan 2026 – Dec 2027',
    description: [
      'GPA 4.0 / 4.0',
      'Coursework: Advanced Databases, Advanced AI, Web Development, Data Mining, Cloud Computing.',
    ],
    images: EDUCATION_IMAGES.umbc,
  },
  {
    id: 'sies',
    title: 'Bachelor of Engineering — Electronics & Telecommunication',
    institution: 'SIES Graduate School of Technology',
    period: 'Aug 2016 – Nov 2020',
    description: [
      'Relevant courses: Object Oriented Programming, Database Management, Linux System Administration, Java, Data Communications and Networks',
    ],
    images: EDUCATION_IMAGES.sies,
  },
];

// ---------- EXTRACURRICULAR ----------
export const extracurricular = [
  {
    id: 'nss',
    title: 'NSS Volunteer',
    org: 'SIES Graduate School of Technology',
    period: '2017 – 2019',
    description: [
      'Performed street plays on awareness topics, blood donation camps, and marathon camps.',
      'Collected donations in public spaces to support an autistic students’ group.',
      'Documented activities and maintained participant records.',
    ],
    images: EXTRA_IMAGES.nss,
  },
  {
    id: 'fastLane',
    title: 'Event Head — Life In A Fast Lane',
    org: 'SIES Graduate School of Technology',
    period: '2018',
    description: [
      'Led the organising committee for the event "Life In A Fast Lane" cultural event.',
      'Handled scheduling, sponsorship coordination, and on-ground execution for attendees.',
    ],
    images: EXTRA_IMAGES.fastLane,
  },
];

// ---------- PROJECTS ----------
// Order here = order on the page. Reorder freely.
// `links` keys are optional — omit one and that button simply won't render.
export const projects = [
  {
    id: 'nestiq',
    title: 'NestIQ — AI Airbnb Price Intelligence',
    period: 'Summer 2026',
    description: [
      'A production-grade full-stack AI platform rebuilt from a data-mining course project — scaled from a 49-row academic dataset to 245K+ real Airbnb listings across 28 US cities, taking a data-science idea end-to-end into a shipped product.',
      'The core is an explainable price-prediction engine built on scikit-learn and XGBoost with SHAP feature attribution (R² ≈ 0.54), so every prediction can be traced back to the features that drove it.',
      'Layered on top: a five-tool agentic host advisor, RAG-backed market chat, and semantic search using sentence-transformer embeddings with a FAISS index.',
      'Shipped as a Next.js 14 + TypeScript frontend against a rate-limited, streaming FastAPI backend serving seven data-mining models — containerized with Docker, quality gates automated through GitHub Actions.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'scikit-learn', 'XGBoost', 'SHAP', 'FAISS', 'RAG', 'Docker', 'GitHub Actions'],
    links: {
      github: 'https://github.com/nidhipoojari/NestIQ',
    },
    images: PROJECT_IMAGES.nestiq,
  },
  {
    id: 'parkPortal',
    title: 'National Park Service Portal',
    period: 'Spring 2026',
    description: [
      'A full-stack national park management portal handling visitor reservations, parking, and real-time analytics — live in production.',
      'Next.js 14 App Router frontend (TypeScript, Tailwind, Framer Motion, Recharts dashboards) backed by an Express.js / TypeScript REST API driving 11+ Oracle stored procedures over node-oracledb thin-mode connections.',
      'A Python FastAPI AI concierge handles personalized park recommendations using LangChain custom tool-use loops written from scratch rather than AgentExecutor, with RAG for grounding — plus an admin executive summary with PDF export.',
      'Auth via NextAuth v4 with Google OAuth and JWT sessions, gating role-based visitor and admin dashboards. End-to-end CI/CD through GitHub Actions across all three services (web, api, ai).',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Express.js', 'Oracle XE', 'Python', 'FastAPI', 'LangChain', 'NextAuth v4', 'Docker', 'GitHub Actions'],
    links: {
      live: 'https://national-park-portal.vercel.app/',
      github: 'https://github.com/nidhipoojari/National-Park-Portal',
    },
    images: PROJECT_IMAGES.parkPortal,
  },
  {
    id: 'ionosphericTec',
    title: 'Estimation of Ionospheric TEC for GPS Error Correction',
    period: 'Sep 2020',
    description: [
      "A Bachelor's final year research project on why a GPS device can be off by several meters and software to measure the single biggest reason why.",
      'A GPS signal travels from a satellite through the ionosphere, a charged layer of the upper atmosphere, before it reaches a receiver on the ground. That layer bends and slows the signal down, and by a different amount depending on the time of day, the season, and how active the sun is so the delay it causes is never constant. That inconsistent delay turns out to be the largest single source of GPS position error.',
      'Built a MATLAB and Python pipeline that reads raw, publicly available satellite observation data (the RINEX format used by real GPS ground stations), pulls out the dual frequency signal measurements, and calculates the Total Electron Content (TEC) — a number that estimates exactly how much delay the ionosphere added at a given moment.',
      'Published as "Review on Estimation of Ionospheric TEC" in the International Research Journal of Engineering and Technology (IRJET), Volume 07, Issue 09, September 2020.',
    ],
    stack: ['MATLAB', 'Python', 'RINEX', 'GNSS/GPS', 'Signal Processing'],
    links: {
      paper: 'https://www.irjet.net/archives/V7/i9/IRJET-V7I9461.pdf',
    },
    images: PROJECT_IMAGES.ionosphericTec,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    period: 'Jul 2025',
    description: [
      'Part portfolio, part professional diary — this site documents the move from BSE systems engineering into full-stack and AI development, with a bit of personality left in.',
      'Deliberately built on a stack I have shipped production code in, paired with hand-written CSS animations instead of a motion library, keeping the page lightweight while leaving room for some design sensibility.',
      'Black-and-white editorial layout, responsive throughout, optimized for performance and SEO.',
    ],
    stack: ['Next.js', 'React', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Vercel'],
    links: {
      live: 'https://nidhipoojari.vercel.app/',
      github: 'https://github.com/nidhipoojari/Portfolio-Website',
    },
    images: PROJECT_IMAGES.portfolio,
  },
];

// ---------- CERTIFICATIONS ----------
// Each card is fully clickable and opens the certificate in a new tab.
// All issuer logos resolve from /public/icons/.
export const certifications = [
  {
    id: 'cka',
    name: 'CKA — Certified Kubernetes Administrator',
    issuer: 'KodeKloud',
    year:   'Jun 2025',
    link:   'https://learn.kodekloud.com/certificate/83e423bc-8b6a-4f96-b28d-1303d92cf2b6',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
  {
    id: 'lfcs',
    name: 'Linux Foundation Certified System Administrator (LFCS)',
    issuer: 'KodeKloud',
    year:   'Jun 2025',
    link:   'https://learn.kodekloud.com/certificate/624680cf-f60a-4824-8b96-01555d6d472c',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
  {
    id: 'jenkins',
    name: 'Certified Jenkins Engineer',
    issuer: 'KodeKloud',
    year:   'Sep 2025',
    link:   'https://learn.kodekloud.com/certificate/5f1b2c11-129a-4956-b03b-f276ea6d4d82',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
  {
    id: 'fastapi',
    name: 'Python API Development with FastAPI',
    issuer: 'KodeKloud',
    year:   'Sep 2025',
    link:   'https://learn.kodekloud.com/certificate/54d15272-c9bc-4d58-8e82-89ef66a6527b',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
  {
    id: 'devops',
    name: 'Fundamentals of DevOps',
    issuer: 'KodeKloud',
    year:   'Jul 2025',
    link:   'https://learn.kodekloud.com/certificate/a56a32df-d8ac-4d67-b05b-b9c381b337a1',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
  {
    id: 'shell',
    name: 'Shell Scripts for Beginners',
    issuer: 'KodeKloud',
    year:   'Aug 2025',
    link:   'https://learn.kodekloud.com/certificate/6ec3cd22-bf56-4f84-9d11-21290a71719a',
    iconSrc: '/icons/kodekloud.svg',
    images: CERT_IMAGES.generic,
  },
];

// ---------- INTERESTS ----------
export const interests = [
  {
    id: 'cooking',
    title: 'Cooking',
    description: [
      'One of my favorite hobbies is experimenting with different dishes. I’m always curious about cuisines from different cultures and enjoy learning how to make them authentically while improving my skills.',
    ],
    images: INTEREST_IMAGES.cooking,
  },
  {
    id: 'painting',
    title: 'Painting',
    description: [
      'I love painting because it helps me express myself creatively. It’s something that brings me a sense of peace and personal joy.',
    ],
    images: INTEREST_IMAGES.painting,
  },
  {
    id: 'tennis',
    title: 'Tennis',
    description: [
      'I enjoy playing tennis as it keeps me active and challenges me physically and mentally. It’s a great full-body workout and one of my favorite ways to relieve stress.',
    ],
    images: INTEREST_IMAGES.tennis,
  },
];

// ---------- SKILLS ----------
// Flat list, used by the scrolling strip on the home page. Grouped
// loosely front-end → back-end → AI → data → infra so the marquee
// reads as a progression rather than a jumble.
export const skills = [
  'React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Vue.js',
  'Tailwind CSS', 'Redux', 'HTML5', 'CSS3',
  'Node.js', 'Express.js', 'Python', 'FastAPI', 'PHP', 'Laravel',
  'REST APIs', 'GraphQL', 'Microservices',
  'LangChain', 'RAG', 'LLM Orchestration', 'Tool-Use Agents',
  'Vector Search', 'Prompt Engineering',
  'MySQL', 'PostgreSQL', 'Oracle XE', 'MongoDB', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Jenkins',
  'Linux', 'Vercel', 'Git',
];

// ---------- SITE / CONTACT ----------
export const site = {
  name: 'Nidhi Poojari',
  // Primary identity — keep this and the hero in sync.
  role: 'Full-Stack Engineer, AI Systems',
  // The AI angle, stated as an extension of full-stack rather than a
  // separate title.
  fusion:
    'Full-stack systems with an AI layer — LLM agents, RAG, and products that ship.',
  tagline: 'Full-Stack Engineer · AI Systems · Baltimore, MD',
  email: 'nidhipoojari702@gmail.com',
  phone: '667-386-3363',
  linkedin: 'https://www.linkedin.com/in/nidhipoojarii/',
  github:   'https://github.com/nidhipoojari/',
  about:
    "Hi, I'm Nidhi, a full-stack engineer in Maryland who builds the AI layer too. I genuinely enjoy the messy middle of a problem, the part where the data is ugly, the requirements keep shifting, and you have to think your way out. I like building things that actually ship, where ML meets real users, real cases, and real deadlines. Outside of work you'll usually find me cooking something I've never tried before, painting on a half-finished canvas, or trying to figure out a new workout machine at the gym.",
};
