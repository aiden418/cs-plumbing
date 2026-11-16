import { collection, imageMeta } from "@/lib/media";
import { COMPLETED_PROJECTS, phaseFolder } from "@/lib/projects-data";
import { projectCity } from "@/lib/projects";
import type { MediaRef } from "@/lib/media-types";
import Filmstrip from "./Filmstrip";
import type { FeaturedProject } from "./FeaturedProjects";

/**
 * Server-side data for FeaturedProjects: for each project slug, every phase
 * that has photos, its rail built from the picks. The picks are a phase's
 * photos marked `featured: true` in that folder's images.json (the creative
 * director's choice, carried by the image manifest), or the paths given in
 * `picks` when a caller passes its own list. A phase without picks shows its
 * first photos (up to `fallback`).
 */

export type FeaturedPicks = Record<string, Record<string, string[]>>;

export function featuredProjects(
  slugs: string[],
  { picks, fallback = 6, eager = 0 }: { picks?: FeaturedPicks; fallback?: number; eager?: number } = {},
): FeaturedProject[] {
  const out: FeaturedProject[] = [];
  for (const slug of slugs) {
    const project = COMPLETED_PROJECTS.find((p) => p.slug === slug);
    if (!project) continue;
    const phases: FeaturedProject["phases"] = [];
    const withPhotos = project.phases
      .map((phase) => ({
        phase,
        all: collection(phaseFolder(slug, phase.slug)),
      }))
      .filter(({ all }) => all.length > 0);
    withPhotos.forEach(({ phase, all }, i) => {
      const chosen = pickPhotos(all, picks?.[slug]?.[phase.slug], fallback);
      const collectionId = `featured:${slug}:${phase.slug}`;
      const next = withPhotos[i + 1];
      phases.push({
        slug: phase.slug,
        name: phase.name,
        count: all.length,
        description: phase.description,
        collectionId,
        rail: (
          <Filmstrip
            id={collectionId}
            items={chosen}
            name={phase.name}
            title={`${project.name}: ${phase.name}`}
            showName={false}
            align="column"
            eager={out.length === 0 && i === 0 ? eager : 0}
            next={
              next
                ? {
                    id: `featured:${slug}:${next.phase.slug}`,
                    label: next.phase.name,
                  }
                : undefined
            }
          />
        ),
      });
    });
    if (phases.length === 0) continue;
    out.push({
      slug,
      name: project.name,
      city: projectCity(project),
      category: project.category,
      href: `/projects/${slug}`,
      phases,
    });
  }
  return out;
}

function pickPhotos(all: MediaRef[], paths: string[] | undefined, fallback: number): MediaRef[] {
  if (paths && paths.length > 0) {
    const byPath = new Map(all.map((m) => [m.path, m]));
    const listed = paths.map((p) => byPath.get(p)).filter((m): m is MediaRef => Boolean(m));
    if (listed.length > 0) return listed;
  }
  const flagged = all.filter((m) => imageMeta(m.path)?.featured);
  return flagged.length > 0 ? flagged : all.slice(0, fallback);
}
