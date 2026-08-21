'use client';
// A command line where visitors can ask about my work. Answers stream
// in from /api/ask and are grounded in whatever lib/data.js says.
//
// One exchange at a time on purpose — no history, no avatars, no
// typing bubbles. It should answer a recruiter's question and get out
// of the way, not pretend to be a chatbot.

import { useState, useRef, useEffect } from 'react';
import { track } from '@/lib/analytics';
import styles from './AskTerminal.module.css';

const SUGGESTIONS = [
  'What AI work has she shipped?',
  'Does she have production experience at scale?',
  'What is her strongest project?',
  'Has she worked with Kubernetes?',
];

export default function AskTerminal() {
  const [question, setQuestion] = useState('');
  // The answer is kept as the list of chunks the stream actually
  // delivered, not one concatenated string, so each arriving chunk can
  // fade in on its own. Joining them back is cheap; splitting a single
  // growing string into "what is new since last render" is not.
  const [segments, setSegments] = useState([]);
  const [asked, setAsked] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const answer = segments.join('');
  // Waiting on the first byte reads differently from watching text
  // arrive, so the two states get different indicators.
  const thinking = busy && segments.length === 0;

  // Navigate away mid-answer and the request should die with the
  // component, not keep streaming into a setState that no longer has
  // anywhere to go.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(raw, source) {
    const q = raw.trim();
    if (!q || busy) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setBusy(true);
    setAsked(q);
    setSegments([]);
    setQuestion('');

    track('ask-submitted', { source });

    // Time to first byte is the number that decides whether this feels
    // broken, and it is invisible from the server side — the model is
    // upstream of us. Measured here, reported on the way out.
    const startedAt = performance.now();
    let firstByteAt = null;

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });

      // A refusal still carries a readable body — the route answers
      // every failure in plain prose rather than an error shape — so the
      // body gets rendered either way and only the reporting branches.
      const failed = !res.ok;

      if (!res.body) {
        setSegments([await res.text()]);
      } else {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        // Append each chunk as it lands. No buffering, no typewriter
        // timer faking it — the text appears at whatever speed the model
        // actually produces it, and the fade is per chunk for the same
        // reason: it should look like arrival, not like playback.
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          if (!text) continue;

          if (firstByteAt === null) firstByteAt = performance.now();
          setSegments((prev) => [...prev, text]);
        }
      }

      if (failed) {
        track('ask-failed', { status: res.status });
      } else {
        track('ask-answered', {
          ttfb: Math.round((firstByteAt ?? performance.now()) - startedAt),
          ms: Math.round(performance.now() - startedAt),
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSegments([
          'Could not reach the assistant. Email Nidhi at nidhipoojari702@gmail.com.',
        ]);
        track('ask-failed', { status: 0 });
      }
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section className={styles.wrap} aria-labelledby="ask-heading">
      <div className={styles.inner}>
        <p id="ask-heading" className={styles.label}>
          Ask about my work
        </p>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            ask(question, 'typed');
          }}
        >
          <span className={styles.caret} aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="does she have production experience at scale?"
            className={styles.input}
            aria-label="Ask a question about Nidhi's work"
            maxLength={400}
            disabled={busy}
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={busy || !question.trim()}
          >
            {busy ? '…' : 'Ask'}
          </button>
        </form>

        {!asked && (
          <ul className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => ask(s, 'suggestion')}
                  disabled={busy}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {asked && (
          <div className={styles.exchange}>
            <p className={styles.question}>
              <span aria-hidden="true">&gt; </span>
              {asked}
            </p>

            {/* Hidden from assistive tech: announcing a live region on
                every chunk would read the whole answer back dozens of
                times. The mirror below says it once, when it is whole. */}
            <p className={styles.answer} aria-hidden="true">
              {segments.map((seg, i) => (
                <span key={i} className={styles.seg}>
                  {seg}
                </span>
              ))}
              {busy && (
                <span
                  className={thinking ? styles.thinking : styles.cursor}
                  aria-hidden="true"
                />
              )}
            </p>

            <p className={styles.srOnly} aria-live="polite">
              {busy ? '' : answer}
            </p>
          </div>
        )}

        <p className={styles.note}>
          Answers are generated from this site&rsquo;s own content. For anything
          it can&rsquo;t answer, email me.
        </p>
      </div>
    </section>
  );
}
