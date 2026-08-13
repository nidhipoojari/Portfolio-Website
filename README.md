# Nidhi Poojari — Portfolio

A black-and-white, editorial-style portfolio built with Next.js 14 (App Router) and React. Live at [nidhipoojari.vercel.app](https://nidhipoojari.vercel.app).

## Stack

- **Next.js 14** (App Router) + **React 18**
- **CSS Modules** + a small set of global design tokens — no CSS framework, no CSS-in-JS
- **@anthropic-ai/sdk** — powers the "ask about my work" box, grounded in the site's own content
- **Vercel** — hosting and CI/CD

## Structure

```
app/                 Routes (one folder = one URL) + the ask-terminal API route
components/          Shared UI — nav, carousel, reveal/transition primitives
lib/data.js          All page copy (experience, education, projects, etc.)
lib/images.js        Maps photos to sections
public/images/       Served photos
scripts/copy-images.js   Local helper for staging new photos into public/images
```

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To enable the "ask about my work" assistant locally, copy `.env.local.example` to `.env.local` and add an Anthropic API key. Without it, that feature just tells visitors to email instead — nothing else on the site depends on it.

## Editing content

| To change…                                  | Edit…                          |
|----------------------------------------------|---------------------------------|
| Any text (experience, education, projects…)   | `lib/data.js`                   |
| Which photos appear where                     | `lib/images.js`                 |
| Theme (colors, spacing, motion)               | `app/globals.css`               |
| Home page layout                              | `app/home.module.css`           |

## Deploy

Push to `main` — Vercel redeploys automatically on every push.
