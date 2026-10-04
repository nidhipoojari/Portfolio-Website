<div align="center">

# ◐ Nidhi Poojari · Portfolio

My personal site, with a small AI assistant that answers questions about my work.

**[nidhipoojari.com](https://nidhipoojari.com)**

<img src="public/images/projects/Portfolio.jpg" alt="Home page of nidhipoojari.com" width="800">

</div>

---

## About

I built this from scratch rather than starting from a template. I wanted it to look like mine, and it gave me a place to practise what I like doing most: careful front-end work, a small backend, and an AI feature that behaves.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 14 (App Router), React 18 |
| Styling | CSS Modules, no UI kit or CSS framework |
| AI | GPT-4o-mini via OpenRouter, streamed with the OpenAI SDK |
| Motion | Hand-written CSS and JS, plus Lenis, anime.js and Motion |
| Hosting | Vercel |

## How it works

```
                     ┌──────────────► every page (rendered on the server)
lib/data.js ─────────┤
(all site content)   └──► lib/corpus.js ──► system prompt
                                                 │
   Ask box (browser) ──► POST /api/ask ──────────┤
          ▲                                      ▼
          └──────── streamed answer ◄──────── OpenRouter
```

All the content lives in one file, `lib/data.js`. The pages read from it and so does the AI, so a change in one place shows up everywhere.

Pages are built ahead of time, so they load fast. The only live part is the `/api/ask` endpoint.

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

---

<div align="center">

Designed and built by **Nidhi Poojari** · [LinkedIn](https://www.linkedin.com/in/nidhipoojarii/)

</div>
