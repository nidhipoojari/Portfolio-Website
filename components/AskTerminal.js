'use client';
/**
 * components/AskTerminal.js
 * ------------------------------------------------------------------
 * A monospace command line where visitors can ask about Nidhi's work.
 * Answers stream in from /api/ask, grounded in lib/data.js.
 *
 * Deliberately one exchange at a time — no chat history, no avatars.
 * The point is to answer a recruiter's question, not to be a chatbot.
 * ------------------------------------------------------------------
 */
import { useState, useRef, useEffect } from 'react';
import styles from './AskTerminal.module.css';

const SUGGESTIONS = [
  'What AI work has she shipped?',
  'Does she have production experience at scale?',
  'What is her strongest project?',
  'Has she worked with Kubernetes?',
];

export default function AskTerminal() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asked, setAsked] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Cancel any in-flight request if the component goes away.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(raw) {
    const q = raw.trim();
    if (!q || busy) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setBusy(true);
    setAsked(q);
    setAnswer('');
    setQuestion('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });

      if (!res.body) {
        setAnswer(await res.text());
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Stream tokens straight into the answer as they arrive.
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setAnswer(
          'Could not reach the assistant. Email Nidhi at nidhipoojari702@gmail.com.'
        );
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
            ask(question);
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
                  onClick={() => ask(s)}
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
            <p className={styles.answer} aria-live="polite">
              {answer}
              {busy && <span className={styles.cursor} aria-hidden="true" />}
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
