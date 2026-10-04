// The card LinkedIn, Slack, iMessage and X show when the site is shared.
//
// Rendered once at build time by next/og and served as a static PNG —
// no runtime cost. Same monochrome palette and Forum display face as the
// site, so the preview reads as the same object as the page it opens.
//
// The portrait is a pre-shrunk grayscale copy (public/images/home/
// og-portrait.jpg) because the original is 2.6k pixels and over a
// megabyte, and the card only ever shows it at 400.

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { site } from '@/lib/data';

export const alt = `${site.name} - ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Google serves a TTF (which satori needs) instead of woff2 when the
// request carries no modern user agent. If the fetch fails the card
// still renders, just in the fallback serif.
async function loadForum() {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Forum'
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [forum, portrait] = await Promise.all([
    loadForum(),
    readFile(path.join(process.cwd(), 'public/images/home/og-portrait.jpg')),
  ]);
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 90px',
          background: '#0a0a0a',
          color: '#f4f1ec',
          fontFamily: 'Forum, serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 620 }}>
          <div style={{ fontSize: 112, lineHeight: 0.95, color: '#ffffff' }}>
            Nidhi
          </div>
          <div style={{ fontSize: 112, lineHeight: 0.95, color: '#ffffff' }}>
            Poojari
          </div>
          <div style={{ fontSize: 38, fontStyle: 'italic', marginTop: 34 }}>
            {site.role}
          </div>
          <div style={{ fontSize: 26, color: '#9a958d', marginTop: 18, lineHeight: 1.4 }}>
            {site.fusion}
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              color: '#9a958d',
              marginTop: 48,
              paddingTop: 20,
              borderTop: '1px solid #2a2826',
            }}
          >
            NIDHIPOOJARI.COM
          </div>
        </div>

        <img
          src={portraitSrc}
          width={400}
          height={400}
          style={{ borderRadius: 400, objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
      fonts: forum ? [{ name: 'Forum', data: forum, style: 'normal', weight: 400 }] : [],
    }
  );
}
