'use client';
// A page as a split view (the Projects page uses it): a mind map of
// every entry on the left, always fully open and pinned in place, and
// the entry picked from it on the right. Picking another node swaps the right side where
// it stands, so there is never a scroll back up to choose again.
//
// The first version hid the nodes until a branch was hovered and put
// the details underneath the map. Nobody could tell there was anything
// to click, and every switch meant scrolling back to the top. Both
// problems were layout, so this keeps the idea and changes the layout.
//
// Every entry is rendered server-side and handed in as `details`; only
// the picked one is unhidden. They are all in the HTML regardless, for
// search engines and the ask box, and /projects#id opens to one.
//
// Below 1040px the map folds into a sticky strip of chips above the
// details: same nodes, same behaviour, laid out for a thumb.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './MindMap.module.css';

const pad = (n) => String(n).padStart(2, '0');

// `name` labels the map for screen readers and prefixes its analytics
// events (`${name}-map`, `${name}-step`).
export default function MindMap({ groups, items, details = {}, hubLabel, name }) {
  // Nodes per branch, in order. One entry can own more than one node
  // (one project shown under two names, say), so a node knows its entry
  // (`target`).
  const nodesByGroup = useMemo(() => {
    const out = {};
    for (const it of items) {
      if (!it.group || !it.mapNodes) continue;
      it.mapNodes.forEach((n, i) => {
        (out[it.group] ||= []).push({ ...n, key: `${it.id}:${i}`, target: it.id, group: it.group });
      });
    }
    return out;
  }, [items]);

  const allNodes = useMemo(
    () => groups.flatMap((g) => nodesByGroup[g.id] || []),
    [groups, nodesByGroup]
  );

  // Prev / next step through entries, not nodes; stepping through nodes
  // would show HireWire twice in a row.
  const entries = useMemo(() => {
    const seen = new Set();
    return allNodes.filter((n) => !seen.has(n.target) && seen.add(n.target)).map((n) => n.target);
  }, [allNodes]);

  // The first node is open from the start, server render included, so
  // the page is never an empty map waiting for a click.
  const [selectedKey, setSelectedKey] = useState(allNodes[0]?.key ?? null);
  const [dir, setDir] = useState(1);

  const selectedNode = allNodes.find((n) => n.key === selectedKey) ?? allNodes[0];
  const selectedId = selectedNode?.target;
  const entryIndex = entries.indexOf(selectedId);
  const groupIndex = groups.findIndex((g) => g.id === selectedNode?.group);

  const paneRef = useRef(null);
  const stripRef = useRef(null);
  const nodeRefs = useRef({});

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const select = useCallback(
    (key, { fromHash = false } = {}) => {
      const node = allNodes.find((n) => n.key === key);
      if (!node) return;

      setDir(entries.indexOf(node.target) >= entries.indexOf(selectedId) ? 1 : -1);
      setSelectedKey(key);
      if (!fromHash) history.replaceState(null, '', `#${node.target}`);

      requestAnimationFrame(() => {
        // Reading halfway down a long entry and picking another: go to
        // the top of the new one. Already at the top: stay put, nothing
        // should move but the content.
        // Arriving from a link, bring the pane up to the details.
        //
        // "At the top" means the pane's top edge is where scroll-margin
        // parks it, just under the fixed nav; anything above that is
        // hidden behind the nav and counts as scrolled.
        const pane = paneRef.current;
        if (pane) {
          const margin = parseFloat(getComputedStyle(pane).scrollMarginTop) || 0;
          if (fromHash || pane.getBoundingClientRect().top < margin - 1) {
            // Through Lenis when it's running: a native smooth
            // scrollIntoView gets overridden by Lenis's own scroll loop
            // and stops dead. Lenis reads scroll-margin-top itself, so
            // no offset here.
            const lenis = window.__lenis;
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(pane);
            } else {
              pane.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
            }
          }
        }
        // On the phone strip, bring the picked chip into view.
        const strip = stripRef.current;
        const chip = nodeRefs.current[key];
        if (strip && chip && strip.scrollWidth > strip.clientWidth) {
          // Measured against the strip itself: offsetLeft would be
          // relative to the chip's own list item, which is always ~0.
          const offset = chip.getBoundingClientRect().left - strip.getBoundingClientRect().left;
          const left = strip.scrollLeft + offset - (strip.clientWidth - chip.offsetWidth) / 2;
          strip.scrollTo({ left, behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
      });
    },
    [allNodes, entries, selectedId]
  );

  const step = useCallback(
    (delta) => {
      const next = entries[(entryIndex + delta + entries.length) % entries.length];
      const node = allNodes.find((n) => n.target === next);
      if (node) select(node.key);
    },
    [entries, entryIndex, allNodes, select]
  );

  // /projects#nestiq opens that entry, on arrival or on a hash change.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const node = allNodes.find((n) => n.target === id);
      if (node) select(node.key, { fromHash: true });
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
    // select changes on every pick; this only needs to bind once.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Arrow keys step through entries. A carousel under the pointer claims
  // the arrows first (it calls preventDefault), and so does any field.
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const prevId = entries[(entryIndex - 1 + entries.length) % entries.length];
  const nextId = entries[(entryIndex + 1) % entries.length];
  const titleOf = (id) => allNodes.find((n) => n.target === id)?.label;
  const group = groups[groupIndex];

  return (
    <div className={styles.split}>
      <aside className={styles.aside}>
        <nav aria-label={`${hubLabel} map`} className={styles.map}>
          <p className={styles.hub}>
            <span className={styles.hubDot} aria-hidden="true" />
            {hubLabel}
          </p>

          <ol ref={stripRef} className={styles.groups}>
            {groups.map((g, gi) => {
              const nodes = nodesByGroup[g.id] || [];
              const nodeIndex = gi === groupIndex ? nodes.findIndex((n) => n.key === selectedKey) : -1;
              return (
                <li
                  key={g.id}
                  className={`${styles.group} ${gi < groupIndex ? styles.passed : ''} ${gi === groupIndex ? styles.onPath : ''}`}
                  // The map stretches to the screen's height and shares
                  // the spare room out evenly per node. A branch takes a
                  // share for each node it holds, except the very last
                  // node on the map, which has nothing below it to reach.
                  style={{
                    '--i': gi,
                    '--grow': gi === groups.length - 1 ? nodes.length - 1 : nodes.length,
                  }}
                >
                  <p className={styles.groupLabel}>
                    {g.label}
                    <sup className={styles.count}>{pad(nodes.length)}</sup>
                  </p>

                  <ol className={styles.nodes}>
                    {nodes.map((n, ni) => {
                      const isSelected = n.key === selectedKey;
                      return (
                        <li
                          key={n.key}
                          className={`${styles.nodeItem} ${nodeIndex > ni ? styles.passed : ''} ${isSelected ? styles.onPath : ''}`}
                          style={{ '--i': gi * 3 + ni + 1, '--n': ni }}
                        >
                          <a
                            ref={(el) => (nodeRefs.current[n.key] = el)}
                            href={`#${n.target}`}
                            className={`${styles.node} ${isSelected ? styles.selected : ''}`}
                            aria-current={isSelected ? 'true' : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              select(n.key);
                            }}
                            data-umami-event={`${name}-map`}
                            data-umami-event-item={n.target}
                            data-umami-event-node={n.label}
                          >
                            <span className={styles.dot} aria-hidden="true" />
                            <span className={styles.nodeText}>
                              <span className={styles.label}>{n.label}</span>
                              <span className={styles.meta}>{n.meta}</span>
                            </span>
                            <span className={styles.wire} aria-hidden="true" />
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      <section ref={paneRef} className={styles.pane} aria-label="Entry details">
        <div className={styles.paneBar}>
          <p className={styles.crumb}>
            {group?.label}
            <span aria-hidden="true"> / </span>
            {selectedNode?.label}
          </p>
          <p className={styles.counter}>
            {pad(entryIndex + 1)} <span aria-hidden="true">/</span> {pad(entries.length)}
          </p>
        </div>

        {items.map((it) => (
          <div
            key={it.id}
            className={styles.detail}
            data-entry={it.id}
            data-dir={dir > 0 ? 'next' : 'prev'}
            hidden={it.id !== selectedId}
          >
            {details[it.id]}
          </div>
        ))}

        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => step(-1)}
            data-umami-event={`${name}-step`}
            data-umami-event-dir="prev"
          >
            <span className={styles.stepHint}>Previous</span>
            <span className={styles.stepTitle}>
              <span aria-hidden="true">← </span>
              {titleOf(prevId)}
            </span>
          </button>
          <button
            type="button"
            className={`${styles.stepBtn} ${styles.stepNext}`}
            onClick={() => step(1)}
            data-umami-event={`${name}-step`}
            data-umami-event-dir="next"
          >
            <span className={styles.stepHint}>Next</span>
            <span className={styles.stepTitle}>
              {titleOf(nextId)}
              <span aria-hidden="true"> →</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
