/**
 * app/layout.js
 * ------------------------------------------------------------------
 * Root layout — wraps every page.
 * Loads the Forum font from Google Fonts and renders the shared Nav,
 * the motion chrome (grain, vignette, cursor) and the route-change
 * transition.
 * ------------------------------------------------------------------
 */
import { Forum } from 'next/font/google';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import PageTransition from '@/components/PageTransition';
import './globals.css';

// next/font auto-self-hosts the font for performance + privacy.
const forum = Forum({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-forum',
});

export const metadata = {
  metadataBase: new URL('https://nidhipoojari.vercel.app'),
  title: 'Nidhi Poojari — Full Stack Engineer',
  description:
    'Full Stack Engineer building production web apps with an AI layer — React, Next.js, Node, FastAPI, LLM agents and RAG.',
};

/**
 * Runs in <head>, before first paint:
 *  - marks the document as JavaScript-capable, which is what gates the
 *    scroll-reveal hidden state in globals.css. Without this, a visitor
 *    with JS disabled would get a page of invisible content instead of
 *    a plain static one.
 *  - applies the visitor's saved (or system) light/dark preference via
 *    a `data-theme` attribute on <html>, so there's no flash of the
 *    wrong theme on load. This attribute lives on the root layout,
 *    which never unmounts between routes, so the choice — made once
 *    from the ThemeToggle button on the home page — applies site-wide.
 */
const JS_FLAG = `
document.documentElement.classList.add('js');
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={forum.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <Nav />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Motion chrome — all pointer-inert, all reduced-motion aware. */}
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
