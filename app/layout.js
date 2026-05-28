/**
 * app/layout.js
 * ------------------------------------------------------------------
 * Root layout — wraps every page.
 * Loads the Forum font from Google Fonts and renders the shared Nav.
 * ------------------------------------------------------------------
 */
import { Forum } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';

// next/font auto-self-hosts the font for performance + privacy.
const forum = Forum({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-forum',
});

export const metadata = {
  title: 'Nidhi Poojari — Portfolio',
  description: 'Full-stack developer · React / Next.js / Node / PHP / MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={forum.variable}>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
