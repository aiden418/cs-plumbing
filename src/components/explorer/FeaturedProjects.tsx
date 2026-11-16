"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/icons";
import { keyToIndex, phaseAnchor, photoCountLabel } from "./explorer-utils";
import { REVEAL_EVENT, type RevealDetail } from "./FilmstripRail";
import { useHydrated } from "./useHydrated";

/**
 * The homepage's two featured jobs (explorer.md "Homepage: FeaturedProjects").
 * A client island fed by server-rendered rails: every rail of every phase is
 * in the server HTML, the inactive ones `hidden`. Choosing a project or a
 * phase only swaps which rail shows (state, never history), with an optional
 * view-transition cross-fade behind a feature test and never under reduced
 * motion.
 *
 * Both switches follow the ARIA tabs pattern (arrow keys, Home/End,
 * aria-selected, aria-controls). Without JavaScript the first project's
 * first phase shows, the project switch links to each project page and
 * every phase step links to the project page's #phase-<slug>.
 *
 * Place it full width (not inside a Container): it aligns itself to the page
 * grid and lets the rail run off the right edge of the screen.
 */

export interface FeaturedPhase {
  slug: string;
  name: string;
  /** Photos in the whole phase (the step's count). */
  count: number;
  description?: string;
  /** The rail for this phase, rendered by the server (a Filmstrip with align="column"). */
  rail: ReactNode;
  /** Collection id of that rail (the lightbox reveals this panel when it closes on it). */
  collectionId: string;
}

export interface FeaturedProject {
  slug: string;
  name: string;
  city?: string;
  category: string;
  href: string;
  phases: FeaturedPhase[];
}

type Selection = { project: number; phase: number };

function startTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof doc.startViewTransition === "function" && !reduce) {
    doc.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

export default function FeaturedProjects({
  projects,
  label = "Featured projects",
}: {
  projects: FeaturedProject[];
  label?: string;
}) {
  const hydrated = useHydrated();
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Selection>({ project: 0, phase: 0 });
  const projectTabs = useRef<(HTMLElement | null)[]>([]);
  const phaseTabs = useRef<(HTMLElement | null)[]>([]);

  const select = (next: Selection) => {
    if (next.project === selected.project && next.phase === selected.phase) return;
    startTransition(() => setSelected(next));
  };

  // The lightbox closing on a hidden rail ("Continue to …" moved it on) asks
  // for that rail's panel to be shown.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onReveal = (event: Event) => {
      const { id } = (event as CustomEvent<RevealDetail>).detail;
      projects.forEach((project, p) =>
        project.phases.forEach((phase, f) => {
          if (phase.collectionId === id) setSelected({ project: p, phase: f });
        }),
      );
    };
    root.addEventListener(REVEAL_EVENT, onReveal);
    return () => root.removeEventListener(REVEAL_EVENT, onReveal);
  }, [projects]);

  const project = projects[selected.project];
  if (!project) return null;

  const tabId = (kind: "project" | "phase", p: number, f = 0) => `${uid}-${kind}-${p}-${f}`;
  const panelId = (p: number, f: number) => `${uid}-panel-${p}-${f}`;

  const onProjectKey = (event: KeyboardEvent) => {
    const target = keyToIndex(event.key, selected.project, projects.length, {
      axis: "both",
      wrap: true,
    });
    if (target === null) return;
    event.preventDefault();
    select({ project: target, phase: 0 });
    projectTabs.current[target]?.focus();
  };

  const onPhaseKey = (event: KeyboardEvent) => {
    const target = keyToIndex(event.key, selected.phase, project.phases.length, { axis: "both", wrap: true });
    if (target === null) return;
    event.preventDefault();
    select({ project: selected.project, phase: target });
    phaseTabs.current[target]?.focus();
  };

  const phase = project.phases[selected.phase] ?? project.phases[0];

  return (
    <div ref={rootRef} className="featured">
      <div className="featured-grid">
        <div className="featured-side">
          {/* Project switch */}
          <div
            role={hydrated ? "tablist" : undefined}
            aria-label={hydrated ? label : undefined}
            aria-orientation={hydrated ? "vertical" : undefined}
            className="featured-projects"
            onKeyDown={hydrated ? onProjectKey : undefined}
          >
            {projects.map((item, p) => {
              const active = p === selected.project;
              const body = (
                <>
                  <span className="label-tech block text-accent">
                    {[item.category, item.city].filter(Boolean).join(" · ")}
                  </span>
                  <span className="featured-project-name">{item.name}</span>
                </>
              );
              return hydrated ? (
                <button
                  key={item.slug}
                  ref={(el) => {
                    projectTabs.current[p] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId("project", p)}
                  aria-selected={active}
                  aria-controls={panelId(p, active ? selected.phase : 0)}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select({ project: p, phase: 0 })}
                  className={cn("featured-project", active && "is-selected")}
                >
                  {body}
                </button>
              ) : (
                <Link key={item.slug} href={item.href} className={cn("featured-project", active && "is-selected")}>
                  {body}
                </Link>
              );
            })}
          </div>

          {/* Phase stepper: the connection line for the selected project */}
          <div
            role={hydrated ? "tablist" : undefined}
            aria-label={hydrated ? `${project.name} phases` : undefined}
            className="featured-steps"
            onKeyDown={hydrated ? onPhaseKey : undefined}
          >
            {project.phases.map((item, f) => {
              const active = f === selected.phase;
              const body = (
                <>
                  <span className="featured-step-joint" aria-hidden="true" />
                  <span className="featured-step-text">
                    <span className="featured-step-name">{item.name}</span>
                    <span className="label-tech tabular-nums text-muted">{photoCountLabel(item.count)}</span>
                  </span>
                </>
              );
              return hydrated ? (
                <button
                  key={item.slug}
                  ref={(el) => {
                    phaseTabs.current[f] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId("phase", selected.project, f)}
                  aria-selected={active}
                  aria-controls={panelId(selected.project, f)}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select({ project: selected.project, phase: f })}
                  className={cn("featured-step", active && "is-selected")}
                >
                  {body}
                </button>
              ) : (
                <Link
                  key={item.slug}
                  href={`${project.href}#${phaseAnchor(item.slug)}`}
                  className={cn("featured-step", active && "is-selected")}
                >
                  {body}
                </Link>
              );
            })}
          </div>

          {phase?.description && <p className="featured-line">{phase.description}</p>}

          <Link href={project.href} className="featured-link group">
            View the project
            <span className="sr-only">: {project.name}</span>
            <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="featured-stage">
          {projects.map((item, p) =>
            item.phases.map((ph, f) => {
              const shown = p === selected.project && f === selected.phase;
              return (
                <div
                  key={`${item.slug}:${ph.slug}`}
                  id={panelId(p, f)}
                  role={hydrated ? "tabpanel" : undefined}
                  aria-labelledby={
                    hydrated ? (p === selected.project ? tabId("phase", p, f) : tabId("project", p)) : undefined
                  }
                  hidden={!shown}
                  className="featured-panel"
                >
                  {ph.rail}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
