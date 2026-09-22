import { AREA_LANDINGS, COMPLETED_PROJECTS } from "./constants";
import { SERVICE_CITY_LANDINGS } from "./service-city-landings";
import { SERVICE_HUBS, type ServiceHub } from "./service-hubs";
import type { AreaLanding, CompletedProject, ServiceCityLanding } from "./types";

/**
 * Project selectors shared by the project pages, the service and city landing
 * pages, the sitemap, JSON-LD and llms.txt. Everything that decides "which
 * projects prove this page" lives here so the same job shows up as proof on
 * the service hub, the city page and the service+city page that rank for it.
 */

/** Which service hubs a project category is proof for. First entry is primary. */
const CATEGORY_HUBS: Record<string, string[]> = {
  "New Construction": ["new-construction"],
  "Commercial New Construction": ["commercial", "new-construction"],
  "Commercial Remodel": ["commercial", "plumbing-remodel"],
  Remodel: ["plumbing-remodel"],
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function projectHubSlugs(project: CompletedProject): string[] {
  return CATEGORY_HUBS[project.category] ?? [];
}

export function projectPrimaryHub(project: CompletedProject): ServiceHub | undefined {
  const slug = projectHubSlugs(project)[0];
  return SERVICE_HUBS.find((h) => h.slug === slug);
}

export function isProjectComplete(project: CompletedProject): boolean {
  if (project.completedOn) return true;
  return !/progress/i.test(project.timeline);
}

/** "Cape Coral, FL" -> "Cape Coral". */
export function projectCity(project: CompletedProject): string | undefined {
  const city = project.location?.replace(/,?\s*FL$/i, "").trim();
  return city || undefined;
}

export function projectArea(project: CompletedProject): AreaLanding | undefined {
  const city = projectCity(project)?.toLowerCase();
  if (!city) return undefined;
  // Exact match only: "North Fort Myers" must not resolve to Fort Myers.
  return AREA_LANDINGS.find((a) => a.city.toLowerCase() === city);
}

/**
 * The service+city landing page this project is the best proof for: the
 * primary hub in the project's city, else the city's generic plumber page.
 */
export function projectCityPage(project: CompletedProject): ServiceCityLanding | undefined {
  const city = projectCity(project)?.toLowerCase();
  if (!city) return undefined;
  const inCity = SERVICE_CITY_LANDINGS.filter((p) => p.city.toLowerCase() === city);
  const hubs = projectHubSlugs(project);
  for (const hub of hubs) {
    const match = inCity.find((p) => p.serviceSlug === hub);
    if (match) return match;
  }
  return inCity.find((p) => !p.serviceSlug);
}

/** Finished jobs first, then the ones with the most to look at. */
function byProofValue(a: CompletedProject, b: CompletedProject): number {
  const doneA = isProjectComplete(a) ? 1 : 0;
  const doneB = isProjectComplete(b) ? 1 : 0;
  if (doneA !== doneB) return doneB - doneA;
  return projectPhotoCount(b) - projectPhotoCount(a);
}

export function projectPhotoCount(project: CompletedProject): number {
  return project.phases.reduce((n, p) => n + p.images.length, 0);
}

/** Every image on the project page, cover first, no duplicates. */
export function projectImages(project: CompletedProject): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of [project.coverImage, ...project.phases.flatMap((p) => p.images.map((i) => i.src))]) {
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out;
}

/** Projects that are proof for a service hub, best first. */
export function projectsForHub(hubSlug: string, limit = 3): CompletedProject[] {
  return COMPLETED_PROJECTS.filter((p) => projectHubSlugs(p).includes(hubSlug))
    .sort(byProofValue)
    .slice(0, limit);
}

/**
 * Projects in a city, best first. When a hub is given, jobs matching that
 * service come first and the rest of the city's work fills in behind them —
 * a water-heater page in Lehigh Acres still gets to show we build there.
 */
export function projectsForCity(
  city: string,
  opts: { hub?: string; limit?: number } = {},
): CompletedProject[] {
  const { hub, limit = 3 } = opts;
  const wanted = city.toLowerCase();
  const inCity = COMPLETED_PROJECTS.filter((p) => projectCity(p)?.toLowerCase() === wanted).sort(byProofValue);
  if (!hub) return inCity.slice(0, limit);
  const matching = inCity.filter((p) => projectHubSlugs(p).includes(hub));
  const rest = inCity.filter((p) => !matching.includes(p));
  return [...matching, ...rest].slice(0, limit);
}

/** Other projects worth linking from a project page: same city, then same service. */
export function relatedProjects(project: CompletedProject, limit = 3): CompletedProject[] {
  const city = projectCity(project);
  const hubs = projectHubSlugs(project);
  const sameCity = city ? projectsForCity(city, { hub: hubs[0], limit: 12 }) : [];
  const sameService = hubs.length ? projectsForHub(hubs[0], 12) : [];
  const out: CompletedProject[] = [];
  for (const p of [...sameCity, ...sameService]) {
    if (p.slug === project.slug || out.includes(p)) continue;
    out.push(p);
    if (out.length === limit) break;
  }
  return out;
}

/** Sitemap lastmod: the latest of the dates we actually know about. */
export function projectLastModified(project: CompletedProject, fallback: Date): Date {
  const dates = [project.updatedOn, project.completedOn]
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(`${d}T00:00:00Z`));
  if (dates.length === 0) return fallback;
  return dates.reduce((a, b) => (b > a ? b : a), fallback);
}

/** "2025-05-02" -> "May 2025". Deterministic on server and client. */
export function formatCompletedOn(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const month = MONTHS[(m ?? 1) - 1] ?? "";
  return month ? `${month} ${y}` : String(y);
}

export function projectStatusLabel(project: CompletedProject): string {
  if (project.completedOn) return `Completed ${formatCompletedOn(project.completedOn)}`;
  return isProjectComplete(project) ? "Completed" : "In progress";
}
