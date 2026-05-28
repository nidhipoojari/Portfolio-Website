# Nidhi Poojari — Portfolio

A minimal black & white editorial-style portfolio built with **Next.js 14 (App Router) + React**. Deploys free to Vercel.

---

## 1. Run locally (Windows / PowerShell)

```powershell
# 1. Install dependencies (only the first time)
npm install

# 2. Copy your photos from /images into /public/images
#    (Next.js can only serve files from /public)
npm run copy-images

# 3. Start the dev server with hot-reload
npm run dev
```

Then open <http://localhost:3000> in your browser.

> **Live editing tip:** keep VS Code on one half of the screen and the browser on the other. Every time you save a file the browser refreshes automatically (hot reload). No restart needed unless you change `next.config.mjs`, `package.json`, or add new images (re-run `npm run copy-images`).

---

## 2. Project structure

```
.
├── app/                       Next.js App Router (one folder = one URL)
│   ├── layout.js              Wraps every page (Nav + font)
│   ├── globals.css            Site-wide black/white theme
│   ├── page.js                /              (Home – editorial cover)
│   ├── home.module.css        Styles scoped to the home page
│   ├── experience/page.js     /experience
│   ├── education/page.js      /education
│   ├── extracurricular/page.js
│   ├── projects/page.js       /projects
│   └── certifications/        /certifications  (+ its module CSS)
│
├── components/
│   ├── Nav.js / Nav.module.css         Top navigation
│   ├── Carousel.js / .module.css       Image slider (custom, no library)
│   └── Section.js / .module.css        Two-column “text + carousel” block
│
├── lib/
│   ├── data.js                Edit this to change ALL text content
│   └── images.js              Edit this to map photos to sections
│
├── public/images/             Photos served at /images/<filename>
├── images/                    Your original photos (untouched)
├── scripts/copy-images.js     Mirrors /images -> /public/images
├── CODE_EXPLAINED.txt         Beginner-friendly walkthrough of the code
├── package.json
└── next.config.mjs
```

### Editing content

| You want to change …        | Open this file              |
|------------------------------|-----------------------------|
| Any text on Experience / Education / Projects / etc. | `lib/data.js` |
| Which photos appear where    | `lib/images.js`             |
| Site title / contact links   | `site` object in `lib/data.js` |
| Theme colours, font sizes    | `app/globals.css`           |
| Home page collage layout     | `app/home.module.css`       |

---

## 3. Deploy free to Vercel

You already have Vercel — two ways to deploy:

### Option A — Push to GitHub, import on Vercel (recommended)

1. Create a new GitHub repo (e.g. `nidhi-portfolio`).
2. In this folder:
   ```powershell
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nidhi-portfolio.git
   git push -u origin main
   ```
3. Go to <https://vercel.com/new> → **Import** the repo → click **Deploy**.
   Vercel auto-detects Next.js, runs `npm run build`, and gives you a public URL like `https://nidhi-portfolio.vercel.app`.
4. Every future `git push` redeploys automatically.

### Option B — Vercel CLI

```powershell
npm i -g vercel
vercel           # first time: links the folder + asks a few questions
vercel --prod    # deploy to production
```

> **Important:** Vercel runs `npm run build`, not `npm run copy-images`. To make sure images are bundled, either:
> - commit the `public/images/` folder to git (simplest), OR
> - add `"build": "npm run copy-images && next build"` in `package.json` so Vercel does it for you.

---

## 4. Tech stack

- **Next.js 14** (App Router) — routing, file-based pages, SSR/SSG
- **React 18** — component model
- **JavaScript (ES6+)** — no TypeScript, kept beginner-friendly
- **CSS Modules + global CSS** — scoped styles, no Tailwind / no CSS-in-JS
- **Google Fonts (Forum)** — auto-self-hosted via `next/font`
- **Vercel** — hosting + CI/CD

Read `CODE_EXPLAINED.txt` for a line-by-line walkthrough you can use to prep for interviews.
