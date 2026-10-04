'use client';
// A command line where visitors can ask about my work. Answers stream
// in from /api/ask and are grounded in whatever lib/data.js says.
//
// One exchange at a time on purpose — no history, no avatars, no
// typing bubbles. It should answer a recruiter's question and get out
// of the way, not pretend to be a chatbot. What it does leave behind is
// a way onward: links to the jobs and projects the answer drew on, and
// three follow-up questions to click instead of type.
//
// Every question is sent to Umami as the `question` property of
// ask-submitted. That is the point of logging it — the event breakdown
// in the dashboard is the site's FAQ, written by the people asking.

import { useState, useRef, useEffect } from 'react';
import { track } from '@/lib/analytics';
import TransitionLink from './TransitionLink';
import styles from './AskTerminal.module.css';

const SUGGESTIONS = [
  'What AI work has she shipped?',
  'Does she have production experience at scale?',
  'What is her strongest project?',
  'Has she worked with Kubernetes?',
];

// Must match META_SEPARATOR in app/api/ask/route.js. Everything after it
// in the response is one JSON frame: { refs, followups }.
const META_SEPARATOR = '\u001e';

export default function AskTerminal() {
  const [question, setQuestion] = useState('');
  // The answer is kept as the list of chunks the stream actually
  // delivered, not one concatenated string, so each arriving chunk can
  // fade in on its own. Joining them back is cheap; splitting a single
  // growing string into "what is new since last render" is not.
  const [segments, setSegments] = useState([]);
  const [asked, setAsked] = useState('');
  const [busy, setBusy] = useState(false);
  const [refs, setRefs] = useState([]);
  const [followups, setFollowups] = useState([]);
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
    setRefs([]);
    setFollowups([]);
    setQuestion('');

    // Umami caps string properties at 500 characters; the input caps
    // at 400, so the question always fits whole.
    track('ask-submitted', { source, question: q });

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
        // Set once the separator arrives; from then on the stream is
        // metadata, buffered whole and parsed at the end.
        let meta = null;

        // Append each chunk as it lands. No buffering, no typewriter
        // timer faking it — the text appears at whatever speed the model
        // actually produces it, and the fade is per chunk for the same
        // reason: it should look like arrival, not like playback.
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;

          let text = decoder.decode(value, { stream: true });
          if (!text) continue;

          if (meta !== null) {
            meta += text;
            continue;
          }

          const at = text.indexOf(META_SEPARATOR);
          if (at !== -1) {
            meta = text.slice(at + 1);
            text = text.slice(0, at);
            if (!text) continue;
          }

          if (firstByteAt === null) firstByteAt = performance.now();
          setSegments((prev) => [...prev, text]);
        }

        if (meta) {
          try {
            const parsed = JSON.parse(meta);
            setRefs(Array.isArray(parsed.refs) ? parsed.refs : []);
            setFollowups(Array.isArray(parsed.followups) ? parsed.followups : []);
          } catch {
            // No links, default suggestions. The answer itself is fine.
          }
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

            {!busy && refs.length > 0 && (
              <ul className={styles.refs} aria-label="Related work">
                {refs.map((r) => (
                  <li key={r.href}>
                    <TransitionLink
                      href={r.href}
                      className={styles.ref}
                      data-umami-event="ask-link"
                      data-umami-event-href={r.href}
                    >
                      <span aria-hidden="true">&rarr; </span>
                      {r.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {asked && !busy && (
          <ul className={styles.suggestions} aria-label="Ask next">
            {(followups.length
              ? followups
              : SUGGESTIONS.filter((s) => s !== asked).slice(0, 3)
            ).map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className={styles.chip}
                  onClick={() => ask(s, followups.length ? 'followup' : 'suggestion')}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.note}>
          Answers are generated from this site&rsquo;s own content. For anything
          it can&rsquo;t answer, email me.
        </p>
      </div>
    </section>
  );
}
