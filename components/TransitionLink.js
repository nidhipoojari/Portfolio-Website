'use client';
// next/link, wrapped so route changes run through the View Transitions
// API instead of the keyed CSS replay in PageTransition.
//
// Why this is not two lines: startViewTransition snapshots the page,
// invokes the callback, and diffs against the DOM once that callback's
// promise settles. router.push is fire-and-forget — it returns long
// before React has rendered the new route — so handing it straight to
// startViewTransition captures the OLD tree as both frames and animates
// nothing. The fix is to hand over a promise we resolve ourselves, from
// the effect that observes the pathname actually changing.
//
// Nothing here is required for navigation to work. No View Transitions
// support, a modified click, or an external href and this falls through
// to an ordinary next/link, with PageTransition's CSS animation still in
// place as the fallback (see PageTransition.module.css).

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function TransitionLink({ href, children, ...rest }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveRef = useRef(null);

  // The new route has painted, so let the transition proceed. Runs on
  // every pathname change, including browser back/forward, which is
  // harmless — there is only ever a pending resolver mid-transition.
  useEffect(() => {
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, [pathname]);

  // A transition left hanging would freeze the page under its own
  // snapshot, so release it if we unmount mid-flight.
  useEffect(() => () => resolveRef.current?.(), []);

  const onClick = useCallback(
    (event) => {
      // Let the browser handle anything that is not a plain left-click:
      // new tab, new window, download, save link as.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (typeof document === 'undefined' || !document.startViewTransition) {
        return; // unsupported: plain next/link navigation
      }

      // Navigating to where we already are would never change the
      // pathname, so the resolver would never fire and the transition
      // would hang on its own snapshot.
      if (href === pathname) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      document.startViewTransition(
        () =>
          new Promise((resolve) => {
            resolveRef.current = resolve;
            router.push(href);
          })
      );
    },
    [href, pathname, router]
  );

  return (
    <Link href={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
