// Wraps every page: the font, the nav, the grain and vignette layers,
// and the route-change transition.

import { Forum } from 'next/font/google';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import PageTransition from '@/components/PageTransition';
import { site } from '@/lib/data';
import './globals.css';

// next/font downloads Forum at build time and serves it from our own
// origin — no request to Google on page load, and no layout shift
// waiting for it.
const forum = Forum({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-forum',
});

// Derived from lib/data.js rather than restated. The title used to
// hardcode the role, which meant changing it in one place left the tab
// and the search result showing the old one.
export const metadata = {
  metadataBase: new URL('https://nidhipoojari.vercel.app'),
  title: `${site.name} — ${site.role}`,
  description: `${site.role}. Production web apps with an AI layer — React, Next.js, Node, FastAPI, LLM agents and RAG.`,
};

/**
 * Two things that have to happen before the first paint, which is why
 * this is a blocking inline script and not an effect.
 *
 * First, it marks the document as JavaScript-capable. Everything the
 * scroll reveals hide is hidden behind `html.js` in globals.css, so
 * without this flag a visitor with JS turned off would be staring at a
 * page of invisible text.
 *
 * Second, it reads the saved (or system) colour preference and sets
 * data-theme immediately. Do this in React instead and dark-mode
 * visitors get a white flash on every cold load.
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
