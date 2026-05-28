/**
 * scripts/copy-images.js
 * ------------------------------------------------------------------
 * Copies every file from /images  ->  /public/images
 *
 * Why? Next.js only serves files placed under the `public/` folder
 * at the URL root (e.g. /images/foo.jpeg). Your original photos live
 * in /images at the project root, so we mirror them into /public.
 *
 * Run it with:   npm run copy-images
 * (It is also safe to run repeatedly; it overwrites existing files.)
 * ------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'images');
const dest = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(src)) {
  console.error('Source folder not found:', src);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });

const files = fs.readdirSync(src);
let copied = 0;
for (const file of files) {
  const from = path.join(src, file);
  const to = path.join(dest, file);
  const stat = fs.statSync(from);
  if (stat.isFile()) {
    fs.copyFileSync(from, to);
    copied++;
  }
}
console.log(`Copied ${copied} images -> public/images`);
