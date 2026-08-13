/**
 * components/PageTitle.js
 * ------------------------------------------------------------------
 * The large editorial heading at the top of each list page, with the
 * trailing accent period. Words mask-reveal on load.
 *
 * The period is decorative — it's hidden from assistive tech so the
 * heading reads as "Experience", not "Experience.".
 * ------------------------------------------------------------------
 */
import SplitReveal from './SplitReveal';

export default function PageTitle({ text }) {
  return (
    <h1 className="page-title">
      <SplitReveal as="span" inline text={text} stagger={70} />
      <span className="accent" aria-hidden="true">.</span>
    </h1>
  );
}
