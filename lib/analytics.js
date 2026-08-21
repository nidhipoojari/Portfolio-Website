// Thin wrapper around the Umami tracker.
//
// Everything here is best-effort on purpose. The script is only injected
// when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, and any visitor running an
// ad blocker will not have it either — so a missing window.umami is the
// normal case, not an error worth handling loudly. Analytics must never
// be the reason something on the page stops working.
//
// Anchors are instrumented declaratively instead, with data-umami-event
// attributes straight in the markup. Those work in server components and
// need nothing from here. This function is for the handful of places that
// already own an onClick — where hanging a data attribute off the same
// element would sit in front of the handler that makes the thing work.

export function track(event, data) {
  if (typeof window === 'undefined') return;

  const umami = window.umami;
  if (!umami || typeof umami.track !== 'function') return;

  try {
    if (data) umami.track(event, data);
    else umami.track(event);
  } catch {
    // Swallowed deliberately. Nothing downstream depends on this.
  }
}
