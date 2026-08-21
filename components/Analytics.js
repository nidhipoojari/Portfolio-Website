// Umami's tracker, injected only when it is configured.
//
// No website id in the environment means this renders nothing at all —
// which is what keeps local development and preview builds out of the
// numbers without needing a second dashboard to ignore.
//
// The src is overridable because self-hosting Umami is a real option and
// the cloud host is not part of the contract. Take the exact snippet from
// the dashboard; if the host ever changes, this is one env var, not a
// code edit.

import Script from 'next/script';

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const SRC = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js';
// Restricts collection to the hosts listed here, so a copy of the site
// running anywhere else is ignored by the tracker itself rather than by
// us remembering not to configure it. Belt and braces with the id check
// above: the id keeps the script out of dev, this keeps dev out of the
// numbers even when someone does set the id locally to test.
const DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

// The id is a bare UUID, not the script URL. Pasting the whole snippet
// src in here is an easy mistake and a silent one: the tag still renders,
// the script still loads, and every event is then rejected for naming a
// website that does not exist. Cheaper to catch it here, loudly, in dev.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Analytics() {
  if (!WEBSITE_ID) return null;

  if (process.env.NODE_ENV !== 'production' && !UUID.test(WEBSITE_ID)) {
    console.warn(
      `[analytics] NEXT_PUBLIC_UMAMI_WEBSITE_ID is not a UUID: "${WEBSITE_ID}". ` +
        'Expected just the id from the Umami dashboard, e.g. ' +
        '"b452af2c-fca2-4a4e-84ab-a608bd20c242" — not the script URL. ' +
        'Nothing will be recorded until this is fixed.'
    );
  }

  return (
    <Script
      src={SRC}
      data-website-id={WEBSITE_ID}
      {...(DOMAINS ? { 'data-domains': DOMAINS } : null)}
      strategy="afterInteractive"
    />
  );
}
