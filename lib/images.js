// Which photos show up where.
//
// Every array is written out by hand rather than globbed or sliced
// from a pool. It is more typing, but a photo can never appear in a
// section I did not put it in, and reordering a carousel is just
// moving a line.
//
// To add one: drop the file in /public/images/<folder>/ and add its
// path below. Forward slashes — these are URLs, not Windows paths.
//
// On disk:
//   /public/images/home
//   /public/images/experience/{NIAN, TCS, APPOCTET, JIO, GA}
//   /public/images/education/{umbc, sies, school}
//   /public/images/extra-curricullum
//   /public/images/interests
//   /public/images/projects

// ---------- HOME ----------
export const HOME_IMAGES = [
  '/images/home/1.jpeg',
  '/images/home/2.jpeg',
];

// ---------- EXPERIENCE ----------
export const EXPERIENCE_IMAGES = {
  // Graduate Assistant — UMBC Web Development Lab
  ga: [
    '/images/experience/GA/1.jpeg',
    '/images/experience/GA/2.jpeg',
  ],

  // Product screenshot — rendered through the carousel's "wide" variant.
  nian: [
    '/images/experience/NIAN/1.png',
  ],

  // Bombay Stock Exchange (via TCS)
  bse: [
    '/images/experience/TCS/3.jpeg',
    '/images/experience/TCS/1.jpeg',
    '/images/experience/TCS/4.jpeg',
    '/images/experience/TCS/5.jpeg',
    '/images/experience/TCS/8.jpeg',
    '/images/experience/TCS/10.jpeg',
    '/images/experience/TCS/11.jpeg',
  ],

  // Landscape (2.2:1 screenshot + a wide shot) — also "wide" variant.
  appoctet: [
    '/images/experience/APPOCTET/1.png',
    '/images/experience/APPOCTET/1.jpeg',
  ],

  jio: [
    '/images/experience/JIO/1.jpeg',
    '/images/experience/JIO/2.jpeg',
    '/images/experience/JIO/3.jpeg',
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

  // SSC / HSC entries were removed from the site — the photos remain on
  // disk under /images/education/school/ if they are ever needed again.
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
// Product screenshots (landscape). These render through the carousel's
// "wide" variant so they are letterboxed instead of cropped.
export const PROJECT_IMAGES = {
  nestiq:        ['/images/projects/NestIQ.png'],
  purpal:        ['/images/projects/Purpal.png'],
  parkPortal:    ['/images/projects/Park_Portal.png'],
  ionosphericTec: ['/images/projects/GPS_Error_Correction.png'],
  portfolio:     ['/images/projects/Portfolio.png'],
};

// ---------- CERTIFICATIONS ----------
// Decorative photos shown on each cert card. Add real cert thumbnails
// when you have them.
export const CERT_IMAGES = {
  generic: [
    // '/images/projects/cert-1.png',
  ],
};
