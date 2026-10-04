<div align="center">

# ◐ Nidhi Poojari · Portfolio

My personal site, with a small AI assistant that answers questions about my work.

**[nidhipoojari.com](https://nidhipoojari.com)**

[![Live](https://img.shields.io/badge/Live-nidhipoojari.com-000000?logo=vercel&logoColor=white)](https://nidhipoojari.com)
[![Next.js](https://img.shields.io/badge/Next.js%2014-App%20Router-black?logo=next.js)](https://nextjs.org/docs/14/app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Styling-CSS%20Modules-1572B6?logo=css3&logoColor=white)](https://nextjs.org/docs/14/app/building-your-application/styling/css-modules)
[![AI](https://img.shields.io/badge/AI-OpenRouter%20%C2%B7%20gpt--4o--mini%20%C2%B7%20streaming-blueviolet?logo=openai&logoColor=white)](#the-ask-box)
[![Motion](https://img.shields.io/badge/Motion-anime.js%20%C2%B7%20Motion%20%C2%B7%20Lenis-FF4D6D)](#tech-stack)
[![Analytics](https://img.shields.io/badge/Analytics-Umami%20%C2%B7%20no%20cookies-2E8B57)](https://umami.is/docs)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%C2%B7%20push--to--main-000000?logo=vercel&logoColor=white)](#architecture)

<img src="public/images/projects/Portfolio.jpg" alt="Home page of nidhipoojari.com" width="800">

</div>

---

## About

I built this from scratch rather than starting from a template. I wanted it to look like mine, and it gave me a place to practise what I like doing most: careful front-end work, a small backend, and an AI feature that behaves.

## Tech stack

| Category | What's used | Where |
|---|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/docs/14/app) App Router, [React 18](https://react.dev/), Server Components by default, `next/font` (Forum, self-hosted) | `app/`, `components/` |
| **Styling & design** | [CSS Modules](https://nextjs.org/docs/14/app/building-your-application/styling/css-modules), one monochrome token set, fluid `clamp()` type, light/dark themes at WCAG AA contrast | `app/globals.css`, `*.module.css` |
| **Motion & interaction** | Hand-written CSS/JS reveals, View Transitions API, CSS scroll-driven animation, Canvas 2D, [Lenis](https://github.com/darkroomengineering/lenis), [anime.js](https://animejs.com/), [Motion](https://motion.dev/) | `components/SplitReveal.js`, `InterestOrbit.js`, `InterferenceField.js` |
| **AI** | [OpenRouter](https://openrouter.ai/docs) → gpt-4o-mini via the [OpenAI SDK](https://github.com/openai/openai-node), token streaming, site-grounded prompt with validated links and follow-ups | `app/api/ask/route.js`, `lib/corpus.js`, `components/AskTerminal.js` |
| **Backend & API** | Next.js Route Handlers (Node runtime), `ReadableStream` responses, per-IP rate limiting, input validation, `next/og` link-preview image | `app/api/`, `app/opengraph-image.js` |
| **Data & content** | All site copy in one JS module, an explicit image registry, a plain-text corpus built from the same data | `lib/data.js`, `lib/images.js` |
| **Delivery & analytics** | [Vercel](https://vercel.com/docs) (push to `main` deploys), [Umami](https://umami.is/docs) privacy analytics, GitHub | `components/Analytics.js`, `lib/analytics.js` |

## Architecture

```mermaid
flowchart TD
    subgraph content["Content layer - edit here, it updates everywhere"]
        D["lib/data.js<br/>experience, education, projects,<br/>publications, certifications, interests, site"]
        I["lib/images.js<br/>explicit photo registry"]
        C["lib/corpus.js<br/>flattens data.js into a plain-text profile"]
    end
    subgraph app["Next.js 14 App Router - React Server Components"]
        L["app/layout.js<br/>Nav, theme script, motion chrome, analytics"]
        R["8 routes<br/>home, experience, education, extracurricular,<br/>projects, publications, certifications, interests"]
        OG["app/opengraph-image.js<br/>generated link-preview image"]
    end
    subgraph ui["Client components"]
        S["Section, Carousel, ProjectSection"]
        P["MindMap, Story, RoleFilter,<br/>InterestOrbit, CertList, Coursework"]
        M["SplitReveal, Reveal, PageTransition,<br/>TransitionLink, Marquee, Cursor, SmoothScroll"]
        F["Pipeline + InterferenceFigure<br/>scroll-driven project figures"]
        T["AskTerminal"]
    end
    subgraph api["Route handlers - server only"]
        RT["POST /api/ask<br/>rate limit, validate, stream"]
        H["GET /api/health<br/>keyConfigured probe"]
    end
    CL["OpenRouter<br/>OpenAI-compatible, gpt-4o-mini"]
    UM["Umami<br/>privacy analytics, no cookies"]

    I --> D
    D --> C
    D --> R
    L --> R
    R --> S
    R --> P
    R --> M
    R --> F
    R --> T
    L --> UM
    T -->|question| RT
    C -->|system prompt| RT
    RT -->|openai client| CL
    CL -->|content deltas| RT
    RT -->|ReadableStream| T
```

**The ask box request path, end to end:**

```
visitor types a question
   → AbortController cancels any in-flight request
   → POST /api/ask
   → IP rate-limit gate  (12 requests / 10 min, per instance)
   → validate + 400-char cap
   → system prompt = full site corpus   [stable prefix, cacheable]
   → user message = the question        [the only volatile part]
   → OpenRouter → gpt-4o-mini, temperature 0.3, stream: true
   → prose deltas → TextEncoder → ReadableStream
   → trailing metadata line cut off, validated, sent as one last frame
     (links to the jobs/projects used + three follow-up questions)
   → reader.read() loop → answer types itself out on screen
```

Every hop has a fallback: no API key → a "just email me" message; rate-limited → a friendly 429; network failure → my email address. The page never shows a broken state.

All the content lives in one file, `lib/data.js`. The pages read from it and so does the AI, so a change in one place shows up everywhere. Pages are built ahead of time, so they load fast; the only live part is the `/api/ask` endpoint.

**Built with:**
[Next.js 14](https://nextjs.org/docs/14/app) ·
[React 18](https://react.dev/) ·
[CSS Modules](https://nextjs.org/docs/14/app/building-your-application/styling/css-modules) ·
[OpenRouter](https://openrouter.ai/docs) ·
[OpenAI Node SDK](https://github.com/openai/openai-node) ·
[Lenis](https://github.com/darkroomengineering/lenis) ·
[anime.js](https://animejs.com/) ·
[Motion](https://motion.dev/) ·
[Umami](https://umami.is/docs) ·
[Vercel](https://vercel.com/docs) ·
[Mermaid](https://mermaid.js.org/) (this diagram)

## The ask box

Visitors can ask things like *"Has she worked with RAG?"* and get a short answer that streams in.

- **It only uses what's on the site.** The whole site is turned into one text profile and sent with every question. The model is told to stick to it and to say when it doesn't know. The profile is small, so I didn't need a vector database.
- **It links back to the site.** Answers come with links to the jobs or projects they used, plus three follow-up questions. The model only gives an ID and the server looks up the link, so it can't make one up.
- **It has limits.** Questions max out at 400 characters, each visitor gets 12 questions every 10 minutes, and the API key never leaves the server.
- **It fails gracefully.** If the AI is down or the limit is hit, visitors see how to contact me instead of an error.

## Other parts

- **Projects map:** projects sit on a tree, and picking one swaps in its details.
- **Experience filter:** switch between tech roles and all roles; the link remembers the choice.
- **Project figures:** a diagram of how NestIQ grew from 49 rows to 245,000 listings, and an animated figure for my GPS research paper.
- **Reduced motion:** animations switch off for anyone who turns down motion on their device.
- **Light and dark mode**, with no white flash on load.

## Project structure

Folders end in `/`; every name is a link to that file or folder on GitHub.

<pre>
<b>Portfolio-Website/</b>
├── <a href="app">app/</a>                                      # pages and server code (App Router)
│   ├── <a href="app/layout.js">layout.js</a>                             # root layout: nav, theme script, analytics
│   ├── <a href="app/page.js">page.js</a>                               # home: hero, skills, about, ask box
│   ├── <a href="app/globals.css">globals.css</a>                           # design tokens, reset, shared classes
│   ├── <a href="app/home.module.css">home.module.css</a>                       # home page styles
│   ├── <a href="app/opengraph-image.js">opengraph-image.js</a>                    # link-preview image
│   ├── <a href="app/icon.svg">icon.svg</a>                              # favicon
│   ├── <a href="app/api">api/</a>                                  # server-only route handlers
│   │   ├── <a href="app/api/ask">ask/</a>
│   │   │   └── <a href="app/api/ask/route.js">route.js</a>                      # POST /api/ask, streaming AI endpoint
│   │   └── <a href="app/api/health">health/</a>
│   │       └── <a href="app/api/health/route.js">route.js</a>                      # GET /api/health, is the key set?
│   ├── <a href="app/experience">experience/</a>
│   │   └── <a href="app/experience/page.js">page.js</a>                           # /experience
│   ├── <a href="app/education">education/</a>
│   │   └── <a href="app/education/page.js">page.js</a>                           # /education
│   ├── <a href="app/extracurricular">extracurricular/</a>
│   │   └── <a href="app/extracurricular/page.js">page.js</a>                           # /extracurricular
│   ├── <a href="app/projects">projects/</a>
│   │   ├── <a href="app/projects/page.js">page.js</a>                           # /projects
│   │   └── <a href="app/projects/projects.module.css">projects.module.css</a>               # projects page styles
│   ├── <a href="app/publications">publications/</a>
│   │   └── <a href="app/publications/page.js">page.js</a>                           # /publications
│   ├── <a href="app/certifications">certifications/</a>
│   │   └── <a href="app/certifications/page.js">page.js</a>                           # /certifications
│   └── <a href="app/interests">interests/</a>
│       └── <a href="app/interests/page.js">page.js</a>                           # /interests
├── <a href="components">components/</a>                               # client components (+ .module.css where styled)
│   ├── <a href="components/Analytics.js">Analytics.js</a>                          # Umami tracker, only when configured
│   ├── <a href="components/AskTerminal.js">AskTerminal.js</a> + <a href="components/AskTerminal.module.css">.module.css</a>          # the ask box: streamed answers, links, follow-ups
│   ├── <a href="components/Carousel.js">Carousel.js</a> + <a href="components/Carousel.module.css">.module.css</a>             # photos, video and live previews; arrows, dots, swipe
│   ├── <a href="components/CertList.js">CertList.js</a> + <a href="components/CertList.module.css">.module.css</a>             # certifications list
│   ├── <a href="components/Coursework.js">Coursework.js</a> + <a href="components/Coursework.module.css">.module.css</a>           # course list on Education
│   ├── <a href="components/Cursor.js">Cursor.js</a> + <a href="components/Cursor.module.css">.module.css</a>               # difference-blend trailing dot
│   ├── <a href="components/InterestOrbit.js">InterestOrbit.js</a> + <a href="components/InterestOrbit.module.css">.module.css</a>        # Interests orbit (anime.js + Motion)
│   ├── <a href="components/InterferenceField.js">InterferenceField.js</a> + <a href="components/InterferenceField.module.css">.module.css</a>    # canvas plane-wave field
│   ├── <a href="components/InterferenceFigure.js">InterferenceFigure.js</a> + <a href="components/InterferenceFigure.module.css">.module.css</a>   # that field, framed for the TEC project
│   ├── <a href="components/Marquee.js">Marquee.js</a> + <a href="components/Marquee.module.css">.module.css</a>              # skills strip
│   ├── <a href="components/MindMap.js">MindMap.js</a> + <a href="components/MindMap.module.css">.module.css</a>              # Projects page tree and detail pane
│   ├── <a href="components/Nav.js">Nav.js</a> + <a href="components/Nav.module.css">.module.css</a>                  # desktop links + mobile panel
│   ├── <a href="components/PageTitle.js">PageTitle.js</a>                          # page heading
│   ├── <a href="components/PageTransition.js">PageTransition.js</a> + <a href="components/PageTransition.module.css">.module.css</a>       # route-change fade
│   ├── <a href="components/Pipeline.js">Pipeline.js</a> + <a href="components/Pipeline.module.css">.module.css</a>             # NestIQ pipeline figure
│   ├── <a href="components/ProjectSection.js">ProjectSection.js</a>                     # one project, shared by Projects and Publications
│   ├── <a href="components/Reveal.js">Reveal.js</a>                             # fade-up on scroll
│   ├── <a href="components/RoleFilter.js">RoleFilter.js</a> + <a href="components/RoleFilter.module.css">.module.css</a>           # Experience: tech roles / all roles
│   ├── <a href="components/Section.js">Section.js</a> + <a href="components/Section.module.css">.module.css</a>              # two-column copy + media block
│   ├── <a href="components/SmoothScroll.js">SmoothScroll.js</a>                       # Lenis, lazy-loaded
│   ├── <a href="components/SplitReveal.js">SplitReveal.js</a> + <a href="components/SplitReveal.module.css">.module.css</a>          # word- or letter-by-letter heading reveal
│   ├── <a href="components/Story.js">Story.js</a> + <a href="components/Story.module.css">.module.css</a>                # HireWire story layout
│   ├── <a href="components/ThemeToggle.js">ThemeToggle.js</a> + <a href="components/ThemeToggle.module.css">.module.css</a>          # light / dark
│   └── <a href="components/TransitionLink.js">TransitionLink.js</a>                     # links with View Transitions
├── <a href="lib">lib/</a>                                      # data and helpers
│   ├── <a href="lib/data.js">data.js</a>                               # ★ every word on the site
│   ├── <a href="lib/images.js">images.js</a>                             # photo registry per section
│   ├── <a href="lib/corpus.js">corpus.js</a>                             # data.js → the AI's profile
│   └── <a href="lib/analytics.js">analytics.js</a>                          # wrapper around Umami
├── <a href="public">public/</a>                                   # static files
│   ├── <a href="public/images">images/</a>                               # photos, one folder per section
│   └── <a href="public/icons">icons/</a>                                # logos and badges
├── <a href="scripts">scripts/</a>
│   └── <a href="scripts/copy-images.js">copy-images.js</a>                        # stages photos into public/images
├── <a href=".env.local.example">.env.local.example</a>                        # every env var the project takes
├── <a href="jsconfig.json">jsconfig.json</a>                             # @/ path aliases
├── <a href="next.config.mjs">next.config.mjs</a>                           # Next.js config
└── <a href="package.json">package.json</a>                              # scripts and dependencies
</pre>

---

<div align="center">

Designed and built by **Nidhi Poojari** · [LinkedIn](https://www.linkedin.com/in/nidhipoojarii/)

</div>
