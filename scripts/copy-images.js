// Mirrors /images into /public/images.
//
// Next only serves what sits under public/, but I keep originals in a
// plain /images folder at the project root while sorting through them.
// This is the bridge between the two. Run `npm run copy-images`; it
// overwrites, so running it twice is harmless.

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
