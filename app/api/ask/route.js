// The endpoint behind the ask box. Question in, plain text out,
// streamed, grounded in lib/data.js.
//
// The model is asked to finish with one metadata line — the jobs and
// projects it drew on, and three follow-up questions. That line never
// reaches the browser as text. The prose streams through untouched; the
// metadata is cut off at the marker, validated here, and sent last as a
// single frame after an ASCII record separator (META_SEPARATOR). The
// client splits on that one character. A model that skips the line, or
// mangles it, costs the links and follow-ups and nothing else.
//
// Provider is OpenRouter through its OpenAI-compatible API, which
// means the official openai client works unchanged — only the base URL
// differs. Point OPENAI_BASE_URL at api.openai.com and this talks to
// OpenAI direct instead, with nothing else to rewrite.
//
// This file is the only place the API key is touched, and it runs on
// the server — the key never gets near the browser bundle.

import OpenAI from 'openai';
import { SYSTEM_PROMPT, REFS, META_MARKER } from '@/lib/corpus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = process.env.AI_MODEL || 'openai/gpt-4o-mini';
const MAX_QUESTION_CHARS = 400;
const META_SEPARATOR = '\u001e';
const MAX_REFS = 3;
const MAX_FOLLOWUPS = 3;
const MAX_FOLLOWUP_CHARS = 120;

// How much of the tail of `text` could still turn out to be the start of
// the marker once the next chunk lands. That much has to be held back —
// a chunk boundary can fall anywhere, including mid-marker. Trailing
// whitespace is held too, so the newline before the marker never makes
// it out as a dangling blank line under the answer.
function holdBack(text) {
  let keep = 0;
  for (let k = Math.min(META_MARKER.length - 1, text.length); k > 0; k--) {
    if (META_MARKER.startsWith(text.slice(-k))) {
      keep = k;
      break;
    }
  }
  let cut = text.length - keep;
  while (cut > 0 && /\s/.test(text[cut - 1])) cut--;
  return cut;
}

// Everything the model wrote after the marker, reduced to what is safe
// to render. Refs are looked up, never trusted; follow-ups are trimmed,
// capped, and deduped. Anything malformed becomes an empty list.
function parseMeta(raw, question) {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }

  const refs = [];
  for (const id of Array.isArray(parsed.refs) ? parsed.refs : []) {
    const ref = typeof id === 'string' && REFS.get(id.trim());
    if (ref && !refs.some((r) => r.href === ref.href)) refs.push(ref);
    if (refs.length === MAX_REFS) break;
  }

  const seen = new Set([question.toLowerCase()]);
  const followups = [];
  for (const q of Array.isArray(parsed.followups) ? parsed.followups : []) {
    if (typeof q !== 'string') continue;
    const clean = q.trim();
    if (!clean || clean.length > MAX_FOLLOWUP_CHARS) continue;
    if (seen.has(clean.toLowerCase())) continue;
    seen.add(clean.toLowerCase());
    followups.push(clean);
    if (followups.length === MAX_FOLLOWUPS) break;
  }

  return { refs, followups };
}

// Fixed window per IP, held in memory. Being honest about what this
// is: it lives in one instance and resets on cold start, so it slows
// down someone idly hammering the box and nothing more. If this page
// ever sees real traffic the state belongs in Vercel KV.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });

    // Sweep expired entries occasionally, otherwise the map grows for
    // as long as the instance lives.
    if (hits.size > 5000) {
      for (const [key, value] of hits) {
        if (now > value.resetAt) hits.delete(key);
      }
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

const text = (body, status) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return text(
      'The assistant is not configured yet. Reach Nidhi directly at nidhipoojari702@gmail.com.',
      503
    );
  }

  if (rateLimited(clientIp(request))) {
    return text(
      'That is a lot of questions in a short time. Give it a few minutes, or just email Nidhi at nidhipoojari702@gmail.com.',
      429
    );
  }

  let question;
  try {
    ({ question } = await request.json());
  } catch {
    return text('Could not read that request.', 400);
  }

  if (typeof question !== 'string' || !question.trim()) {
    return text('Ask a question first.', 400);
  }
  if (question.length > MAX_QUESTION_CHARS) {
    return text(`Keep it under ${MAX_QUESTION_CHARS} characters.`, 400);
  }

  const asked = question.trim();

  const client = new OpenAI({
    baseURL: BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    // OpenRouter attributes traffic with these. Harmless when the base
    // URL points somewhere else — OpenAI just ignores them.
    defaultHeaders: {
      'HTTP-Referer': 'https://nidhipoojari.com',
      'X-Title': 'Nidhi Poojari - Portfolio',
    },
  });

  // This await has to be guarded. Unlike a lazily-iterated stream, the
  // openai client fires the request here and throws on the spot for a
  // bad key, a rate limit upstream, or an unreachable provider — all
  // before the ReadableStream below exists to catch anything. Letting
  // that escape hands the visitor a blank 500, which is the one thing
  // this endpoint is not allowed to do.
  let stream;
  try {
    stream = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024, // the prompt asks for 2-4 sentences; this is headroom
      // Low temperature on purpose. Answering "has she used Kubernetes"
      // from a profile already sitting in the prompt is a lookup, not a
      // creative task, and invention is the one failure mode that would
      // actually matter here.
      temperature: 0.3,
      stream: true,
      messages: [
        // The corpus goes first and never varies, so it stays a stable
        // prefix across every request. That ordering is what lets the
        // provider's automatic prompt caching hit at all — put the
        // question above it and there is nothing stable left to cache.
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: asked },
      ],
    });
  } catch (error) {
    console.error('[ask] could not open stream:', error);
    return text(
      'Something went wrong reaching the assistant. Email Nidhi at nidhipoojari702@gmail.com.',
      502
    );
  }

  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      const send = (chunk) => controller.enqueue(encoder.encode(chunk));
      let wroteSomething = false;
      let stopReason = null;

      // Prose not yet sent, because its tail might be the marker.
      let pending = '';
      // Everything after the marker, once it has been seen.
      let meta = null;

      const flush = (upTo) => {
        if (upTo <= 0) return;
        wroteSomething = true;
        send(pending.slice(0, upTo));
        pending = pending.slice(upTo);
      };

      try {
        for await (const chunk of stream) {
          const choice = chunk.choices?.[0];
          if (!choice) continue;

          if (choice.finish_reason) stopReason = choice.finish_reason;

          // The separator is the framing, so it can never be content.
          const delta = choice.delta?.content?.replaceAll(META_SEPARATOR, '');
          if (!delta) continue;

          if (meta !== null) {
            meta += delta;
            continue;
          }

          pending += delta;
          const at = pending.indexOf(META_MARKER);
          if (at !== -1) {
            meta = pending.slice(at + META_MARKER.length);
            pending = pending.slice(0, at).trimEnd();
            flush(pending.length);
          } else {
            flush(holdBack(pending));
          }
        }

        pending = pending.trimEnd();
        flush(pending.length);

        // A declined request is not an exception — it comes back as a
        // perfectly successful stream that simply carries no content,
        // flagged on the way out. Without this the visitor gets silence.
        if (!wroteSomething) {
          send(
            stopReason === 'content_filter'
              ? "I can't answer that one. Ask me about Nidhi's work, projects, or background instead."
              : 'The assistant had nothing to say to that. Try rephrasing, or email Nidhi at nidhipoojari702@gmail.com.'
          );
        } else if (meta !== null) {
          const parsed = parseMeta(meta, asked);
          if (parsed) send(META_SEPARATOR + JSON.stringify(parsed));
        }
      } catch (error) {
        console.error('[ask] stream failed:', error);
        if (!wroteSomething) {
          send(
            'Something went wrong reaching the assistant. Email Nidhi at nidhipoojari702@gmail.com.'
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
