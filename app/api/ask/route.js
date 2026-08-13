/**
 * app/api/ask/route.js
 * ------------------------------------------------------------------
 * The "ask about my work" endpoint.
 *
 * Takes a visitor question, answers it grounded in lib/data.js, and
 * streams the answer back as plain text.
 *
 * The API key is read server-side only and never reaches the browser.
 * ------------------------------------------------------------------
 */
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/corpus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'claude-opus-5';
const MAX_QUESTION_CHARS = 400;

// ---------- Rate limiting ----------
// In-memory fixed window, keyed by IP. This is per server instance and
// resets on cold start, so it is a courtesy throttle against casual
// abuse — not a security boundary. Swap in Vercel KV if this page ever
// gets real traffic.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });

    // Opportunistic cleanup so the map can't grow without bound.
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
  if (!process.env.ANTHROPIC_API_KEY) {
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

  const client = new Anthropic();

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1024, // answers are 2-4 sentences by instruction
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    // Adaptive thinking at low effort: this is a grounded lookup, not a
    // reasoning problem. Preferred over disabling thinking outright,
    // which can leak internal tags into the visible answer.
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // The profile is byte-stable across requests, so every question
        // after the first reads it from cache at ~10% of input price.
        cache_control: { type: 'ephemeral' },
      },
    ],
    // The volatile part goes after the cache breakpoint.
    messages: [{ role: 'user', content: question.trim() }],
  });

  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      const send = (chunk) => controller.enqueue(encoder.encode(chunk));
      let wroteSomething = false;

      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            wroteSomething = true;
            send(event.delta.text);
          }
        }

        // Safety classifiers can decline a request; that arrives as a
        // successful response with stop_reason "refusal", not an error.
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal' && !wroteSomething) {
          send(
            "I can't answer that one. Ask me about Nidhi's work, projects, or background instead."
          );
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
