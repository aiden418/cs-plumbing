import { collection } from "@/lib/media";
import { phaseFolder } from "@/lib/projects-data";
import type { CompletedProject } from "@/lib/types";
import type { MediaRef } from "@/lib/media-types";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import Filmstrip from "./Filmstrip";
import PhaseNav from "./PhaseNav";
import { phaseAnchor } from "./explorer-utils";

/**
 * A project's photographs, phase by phase (explorer.md "Project page").
 *
 * Every phase is in the server HTML as <section id="phase-<slug>"> (today's
 * anchors), stacked in order: heading, description, the phase's filmstrip
 * with every photo. With more than one phase, PhaseNav (the connection line)
 * sits above them, sticky under the header. A single phase shows its
 * filmstrip under a plain label and no phase navigation. A phase whose
 * folder is missing or empty renders nothing; with no photos at all the
 * explorer renders nothing (the page still renders its text).
 *
 * Server component: the photos are resolved here with collection() and
 * handed to the client rails as plain MediaRef[] props.
 */

interface ProjectExplorerProps {
  project: Pick<CompletedProject, "slug" | "name" | "phases">;
  /** Heading level of the phase names (h2 on a project page). */
  as?: "h2" | "h3";
  /** Photos loaded eagerly in the first rail (0 when the explorer starts below the fold). */
  eager?: number;
  className?: string;
}

export type ResolvedPhase = {
  slug: string;
  name: string;
  description?: string;
  items: MediaRef[];
};

/** The phases that have photos, with their pictures resolved. */
export function resolvePhases(project: Pick<CompletedProject, "slug" | "phases">): ResolvedPhase[] {
  return project.phases
    .map((phase) => ({
      slug: phase.slug,
      name: phase.name,
      description: phase.description,
      items: collection(phaseFolder(project.slug, phase.slug)),
    }))
    .filter((phase) => phase.items.length > 0);
}

export default function ProjectExplorer({ project, as = "h2", eager = 2, className }: ProjectExplorerProps) {
  const phases = resolvePhases(project);
  if (phases.length === 0) return null;

  if (phases.length === 1) {
    const [phase] = phases;
    return (
      <LightboxProvider>
        <section id={phaseAnchor(phase.slug)} aria-label={`${project.name}: ${phase.name}`} className={className}>
          <Filmstrip
            id={`${project.slug}:${phase.slug}`}
            items={phase.items}
            name={phase.name}
            title={`${project.name}: ${phase.name}`}
            description={phase.description}
            plain
            eager={eager}
          />
        </section>
      </LightboxProvider>
    );
  }

  return (
    <LightboxProvider>
      <div className={className} data-explorer={project.slug}>
        <PhaseNav
          phases={phases.map((p) => ({
            slug: p.slug,
            name: p.name,
            count: p.items.length,
          }))}
        />
        <div className="explorer-phases">
          {phases.map((phase, i) => {
            const next = phases[i + 1];
            const headingId = `${phaseAnchor(phase.slug)}-title`;
            return (
              <section
                key={phase.slug}
                id={phaseAnchor(phase.slug)}
                aria-labelledby={headingId}
                className="explorer-phase"
              >
                <Filmstrip
                  id={`${project.slug}:${phase.slug}`}
                  items={phase.items}
                  name={phase.name}
                  title={`${project.name}: ${phase.name}`}
                  description={phase.description}
                  as={as}
                  headingId={headingId}
                  eager={i === 0 ? eager : 0}
                  next={next ? { id: `${project.slug}:${next.slug}`, label: next.name } : undefined}
                />
              </section>
            );
          })}
        </div>
      </div>
    </LightboxProvider>
  );
}
