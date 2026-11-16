"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { phaseAnchor, photoCountLabel } from "./explorer-utils";

/**
 * The connection line of a project page (explorer.md "PhaseNav"): native
 * fragment links to each phase section (#phase-<slug>, today's anchors),
 * each a joint, the phase name and its photo count. Sticky under the header
 * on ink; scrolls sideways on phones.
 *
 * With JavaScript the phase in view is marked aria-current="true", from an
 * IntersectionObserver and from the hash (on load and on hashchange). It
 * never hides a panel and never writes history.
 */

export interface PhaseNavItem {
  slug: string;
  name: string;
  count: number;
}

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

function slugFromHash(hash: string, slugs: string[]): string | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  return slugs.find((slug) => phaseAnchor(slug) === id) ?? null;
}

export default function PhaseNav({ phases, label = "Project phases" }: { phases: PhaseNavItem[]; label?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const slugs = phases.map((p) => p.slug);
  const slugKey = slugs.join("|");
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );
  // The phase the observer last reported, or null before it has.
  const [observed, setObserved] = useState<string | null>(null);
  const current = observed ?? slugFromHash(hash, slugs);

  useEffect(() => {
    const list = slugKey.split("|");
    const sections = list
      .map((slug) => document.getElementById(phaseAnchor(slug)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const inBand = new Set<string>();
    // A band across the upper part of the screen, below the header and this bar.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = list.find((s) => phaseAnchor(s) === entry.target.id);
          if (!slug) continue;
          if (entry.isIntersecting) inBand.add(slug);
          else inBand.delete(slug);
        }
        const first = list.find((slug) => inBand.has(slug));
        if (first) setObserved(first);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const section of sections) observer.observe(section);
    const onHash = () => {
      const slug = slugFromHash(window.location.hash, list);
      if (slug) setObserved(slug);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, [slugKey]);

  // Keep the current phase in view in the sideways-scrolling bar (phones),
  // without moving the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !current) return;
    const link = list.querySelector<HTMLElement>(`[data-phase="${CSS.escape(current)}"]`);
    if (!link || list.scrollWidth <= list.clientWidth) return;
    const item = link.closest("li") ?? link;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: "instant" });
  }, [current]);

  return (
    <nav aria-label={label} className="phase-nav" data-tone="ink">
      <ol ref={listRef} className="phase-nav-list">
        {phases.map((phase, i) => {
          const active = phase.slug === current;
          return (
            <li key={phase.slug} className="phase-nav-item">
              {i > 0 && <span className="phase-nav-pipe" aria-hidden="true" />}
              <a
                href={`#${phaseAnchor(phase.slug)}`}
                data-phase={phase.slug}
                aria-current={active ? "true" : undefined}
                className={cn("phase-nav-link", active && "is-current")}
              >
                <span className="phase-nav-joint" aria-hidden="true" />
                <span className="phase-nav-name">{phase.name}</span>
                <span className="label-tech tabular-nums text-muted">{photoCountLabel(phase.count)}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
