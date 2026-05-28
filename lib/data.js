/**
 * lib/data.js
 * ------------------------------------------------------------------
 * Single source of truth for all page content (titles, descriptions,
 * dates, links). Edit text here -> it updates everywhere it is shown.
 * ------------------------------------------------------------------
 */
import {
  EXPERIENCE_IMAGES,
  EDUCATION_IMAGES,
  EXTRA_IMAGES,
  PROJECT_IMAGES,
  CERT_IMAGES,
  INTEREST_IMAGES,
} from './images';

// ---------- EXPERIENCE ----------
export const experiences = [
  {
    id: 'ga',
    title: 'Graduate Assistant — Web Development Lab',
    company: 'University of Maryland, Baltimore County',
    period: 'Jan 2026 – Present',
    description: [
      'Grading assessments and providing technical mentorship for 30+ undergraduate students on full-stack web development fundamentals.',
      'Conducting live proctoring, debugging student code across HTML / CSS / JavaScript / AJAX, and resolving technical issues.',
      'Explaining core concepts (DOM manipulation, state management, REST APIs, responsive design) to facilitate deeper understanding.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'PHP', 'Linux', 'AJAX', 'MySql'],
    images: EXPERIENCE_IMAGES.ga,
  },
  {
    id: 'nian',
    title: 'Full Stack Developer',
    company: 'NIAN',
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
    title: 'Masters in Information Sciences',
    institution: 'University of Maryland, Baltimore County',
    period: 'Jan 2026 – Dec 2027',
    description: [
      'Coursework: Advanced Databases, Web Development, Data Mining, AI/Cloud Computing.',
      
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
  {
    id: 'twelfth',
    title: 'Higher Secondary (HSC) — Science',
    institution: 'State Board, Maharashtra',
    period: '2016',
    description: [
      'Completed Higher Secondary in Science stream under the state board.',
    ],
    images: EDUCATION_IMAGES.twelfth,
  },
  {
    id: 'schooling',
    title: 'Schooling (SSC)',
    institution: 'State Board, Maharashtra',
    period: '2014',
    description: [
      'Completed Secondary School Certificate under the state board.',
    ],
    images: EDUCATION_IMAGES.schooling,
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
export const projects = [
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    period: '2026',
    description: [
      'Modern, responsive single-page application showcasing projects and professional work.',
      'Built with Next.js, React, CSS animations, and responsive design; optimized for performance and SEO.',
    ],
    stack: ['Next.js', 'React', 'JavaScript (ES6+)', 'HTML5', 'CSS3'],
    links: {
      live: '#',          // TODO: replace with your Vercel URL after deploy
      github: '#',        // TODO: replace with your GitHub repo URL
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

// ---------- SITE / CONTACT ----------
export const site = {
  name: 'Nidhi Poojari',
  tagline: 'Full-Stack Developer · Baltimore, MD',
  email: 'nidhipoojari702@gmail.com',
  phone: '667-386-3363',
  linkedin: 'https://www.linkedin.com/in/nidhipoojarii/',
  github:   'https://github.com/nidhipoojari/',
  about:
    "Hi, I'm Nidhi, an AI Engineer based in Maryland who genuinely enjoys the messy middle of a problem, the part where the data is ugly, the requirements keep shifting, and you have to think your way out. I like building things that actually ship, where ML meets real users, real cases, and real deadlines. Outside of work you'll usually find me cooking something I've never tried before, painting on a half-finished canvas, or trying to figure out a new workout machine at the gym.",
};
