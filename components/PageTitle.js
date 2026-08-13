// The big heading at the top of each list page. Words mask-reveal on
// load; the trailing period is purely decorative, which is why it is
// hidden from screen readers — the heading should read "Experience",
// not "Experience dot".

import SplitReveal from './SplitReveal';

export default function PageTitle({ text }) {
  return (
    <h1 className="page-title">
      <SplitReveal as="span" inline text={text} stagger={70} />
      <span className="accent" aria-hidden="true">.</span>
    </h1>
  );
}
