// The endpoint behind the ask box. Question in, plain text out,
// streamed, grounded in lib/data.js.
//
// Provider is OpenRouter through its OpenAI-compatible API, which
// means the official openai client works unchanged — only the base URL
// differs. Point OPENAI_BASE_URL at api.openai.com and this talks to
// OpenAI direct instead, with nothing else to rewrite.
//
// This file is the only place the API key is touched, and it runs on
// the server — the key never gets near the browser bundle.

import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/corpus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = process.env.AI_MODEL || 'openai/gpt-4o-mini';
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

  const client = new OpenAI({
    baseURL: BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    // OpenRouter attributes traffic with these. Harmless when the base
    // URL points somewhere else — OpenAI just ignores them.
    defaultHeaders: {
      'HTTP-Referer': 'https://nidhipoojari.vercel.app',
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
        { role: 'user', content: question.trim() },
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

      try {
        for await (const chunk of stream) {
          const choice = chunk.choices?.[0];
          if (!choice) continue;

          if (choice.finish_reason) stopReason = choice.finish_reason;

          const delta = choice.delta?.content;
          if (delta) {
            wroteSomething = true;
            send(delta);
          }
        }

        // A declined request is not an exception — it comes back as a
        // perfectly successful stream that simply carries no content,
        // flagged on the way out. Without this the visitor gets silence.
        if (!wroteSomething) {
          send(
            stopReason === 'content_filter'
              ? "I can't answer that one. Ask me about Nidhi's work, projects, or background instead."
              : 'The assistant had nothing to say to that. Try rephrasing, or email Nidhi at nidhipoojari702@gmail.com.'
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
