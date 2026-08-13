// The endpoint behind the ask box. Question in, plain text out,
// streamed, grounded in lib/data.js.
//
// This file is the only place the API key is touched, and it runs on
// the server — the key never gets near the browser bundle.

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/corpus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'claude-opus-5';
const MAX_QUESTION_CHARS = 400;

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
    max_tokens: 1024, // the prompt asks for 2-4 sentences; this is headroom
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    // Low effort on purpose. Answering "has she used Kubernetes" from
    // a profile that is already in the prompt is a lookup, not a
    // reasoning problem. Turning thinking off entirely is worse — it
    // can leak internal tags into what the visitor sees.
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // The corpus is identical byte for byte on every request, so
        // caching it means only the first visitor pays full price for
        // those tokens. Everyone after that reads it at ~10%.
        cache_control: { type: 'ephemeral' },
      },
    ],
    // Everything volatile has to sit after the cache breakpoint, or
    // there is nothing stable left to cache.
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

        // A declined request is not an exception — it comes back as a
        // perfectly successful response whose stop_reason is
        // "refusal". Without this check the visitor just gets silence.
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
