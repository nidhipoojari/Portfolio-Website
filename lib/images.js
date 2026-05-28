/**
 * lib/images.js
 * ------------------------------------------------------------------
 * Central image registry.
 *
 * Every section gets an EXPLICIT list of image paths — no slices,
 * no pools. Pick exactly which files you want to show by adding,
 * removing, or reordering lines.
 *
 * Path format:  /images/<folder>/<file>
 *   (Forward slashes — these are web URLs, not Windows paths.)
 *
 * Adding a photo:
 *   1. Drop the file into /public/images/<folder>/
 *   2. Add a new line below in the relevant array
 *
 * Folder layout on disk:
 *   /public/images/home
 *   /public/images/experience/{NIAN, TCS, APPOCTET, JIO, GA}
 *   /public/images/education/{umbc, sies, school}
 *   /public/images/extra-curricullum
 *   /public/images/interests
 *   /public/images/projects
 * ------------------------------------------------------------------
 */

// ---------- HOME ----------
export const HOME_IMAGES = [
  '/images/home/1.jpeg',
  '/images/home/2.jpeg',
  '/images/home/3.jpeg',
  '/images/home/4.jpeg',
];

// ---------- EXPERIENCE ----------
export const EXPERIENCE_IMAGES = {
  // Graduate Assistant — UMBC Web Development Lab
  ga: [
    '/images/experience/GA/1.jpeg',
    '/images/experience/GA/2.jpeg',
  ],

  nian: [
    '/images/experience/NIAN/2.jpeg',
    '/images/experience/NIAN/3.jpeg',
  ],

  // Bombay Stock Exchange (via TCS)
  bse: [
    '/images/experience/TCS/3.jpeg',
    '/images/experience/TCS/2.jpeg',
    '/images/experience/TCS/1.jpeg',
    '/images/experience/TCS/4.jpeg',
    '/images/experience/TCS/5.jpeg',
    '/images/experience/TCS/8.jpeg',
    '/images/experience/TCS/10.jpeg',
    '/images/experience/TCS/11.jpeg',
    '/images/experience/TCS/12.jpeg',
  ],

  appoctet: [
    '/images/experience/APPOCTET/1.jpeg',
  ],

  jio: [
    '/images/experience/JIO/1.jpeg',
    '/images/experience/JIO/2.jpeg',
    '/images/experience/JIO/3.jpeg',
    '/images/experience/JIO/4.jpeg',
  ],
};

// ---------- EDUCATION ----------
export const EDUCATION_IMAGES = {
  umbc: [
    '/images/education/umbc/1.jpeg',
    '/images/education/umbc/2.jpeg',
    '/images/education/umbc/3.jpeg',
    '/images/education/umbc/4.jpeg',
    '/images/education/umbc/5.jpeg',
    '/images/education/umbc/6.jpeg',
  ],

  sies: [
    '/images/education/sies/1.jpeg',
    '/images/education/sies/2.jpeg',
    '/images/education/sies/3.jpeg',
    '/images/education/sies/4.jpeg',
    '/images/education/sies/5.jpeg',
    '/images/education/sies/6.jpeg',
  ],

  // 12th — pick whichever school photos belong here
  twelfth: [
    '/images/education/school/1.jpeg',
  ],

  // Earlier schooling
  schooling: [
    '/images/education/school/2.jpeg',
    '/images/education/school/3.jpeg',
  ],
};

// ---------- EXTRACURRICULAR ----------
export const EXTRA_IMAGES = {
  nss: [
    '/images/extra-curricullum/1.jpeg',
    '/images/extra-curricullum/2.jpeg',
    '/images/extra-curricullum/4.jpeg',
    '/images/extra-curricullum/7.jpeg',
    '/images/extra-curricullum/6.jpeg',

  ],

  fastLane: [
    '/images/extra-curricullum/3.jpeg',
  ],
};

// ---------- INTERESTS ----------
export const INTEREST_IMAGES = {
  cooking: [
    '/images/interests/10.jpeg',
    '/images/interests/4.jpeg',
    '/images/interests/7.jpeg',
    '/images/interests/11.jpeg',
  ],

  painting: [
    '/images/interests/5.jpeg',
    '/images/interests/9.jpeg',
  ],

  tennis: [
    '/images/interests/1.jpeg',
    '/images/interests/2.jpeg',  ],
};

// ---------- PROJECTS ----------
// /public/images/projects is empty for now. Add real screenshots there
// and list them below.
export const PROJECT_IMAGES = {
  portfolio: [
    // '/images/projects/portfolio-1.png',
  ],
};

// ---------- CERTIFICATIONS ----------
// Decorative photos shown on each cert card. Add real cert thumbnails
// when you have them.
export const CERT_IMAGES = {
  generic: [
    // '/images/projects/cert-1.png',
  ],
};
