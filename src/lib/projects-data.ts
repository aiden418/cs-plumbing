/**
 * The completed projects with their photos.
 *
 * The words of each project (name, client, phases, case study) are typed in
 * src/lib/constants.ts (COMPLETED_PROJECT_TEXT). The photos are not typed
 * anywhere: they are the files in
 *
 *   public/images/projects/<project slug>/<phase slug>/
 *
 * read through the image manifest (src/generated/images-meta.json, rebuilt
 * from public/images before dev, tests and every build). The images.json in
 * a phase folder carries each photo's alt text, an optional `order`,
 * `hidden`, and `cover: true` on the project's cover photo. So the owner
 * adds a photo by adding a file, and hides or removes one in one place.
 *
 * Rules:
 *   - phase photos: explicit `order` first, then natural file-name order;
 *   - a phase whose folder is missing, empty or all hidden is left off the
 *     pages; the project itself still renders its text;
 *   - a folder that no phase in constants.ts names is not published, and
 *     `npm run photos:check` names it;
 *   - the cover is the visible photo marked `cover` (in a phase folder or in
 *     the project folder itself), else the first photo of the first phase;
 *   - phases are never combined across projects: each reads its own folder.
 *
 * Plain data: no static image imports and no "server-only", so the sitemap
 * and llms.txt can import it. Client components must not import it (it
 * carries the manifest); give them props from a server component.
 */
import manifest from "../generated/images-meta.json";
import { COMPLETED_PROJECT_TEXT } from "./constants";
import type { ImageManifest, ImageMeta } from "./media-types";
import type { CompletedProject, CompletedProjectText, ProjectCardData, ProjectImage, ProjectPhase } from "./types";

const META = manifest as unknown as ImageManifest;

const has = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

/** The folder of one project phase, as the manifest names it. */
export function phaseFolder(projectSlug: string, phaseSlug: string): string {
  return `projects/${projectSlug}/${phaseSlug}`;
}

/**
 * Stand-in alt text for a photo nobody has described yet (the same rule as
 * altFromFileName() in src/lib/media.ts, which this module cannot import
 * because media.ts carries every static picture import).
 */
export function altFromFileName(file: string): string {
  const words = file
    .replace(/\.[^.]*$/, "")
    .replace(/^\d+(?:[-_ .]+|$)/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return words || "Photo";
}

/** A published, visible photo's manifest entry, or null when the file is absent or hidden. */
function visibleMeta(path: string, meta: ImageManifest): ImageMeta | null {
  const entry = has(meta.images, path) ? meta.images[path] : undefined;
  if (!entry || entry.hidden || entry.vector || entry.derived) return null;
  return entry;
}

/**
 * The one check for every secondary use of a gallery or project photo (a
 * service page's job photos, the builders gallery, area cards, home
 * sections): the same "/images/..." path back when the file is in
 * public/images and not marked `hidden`, otherwise null, so the caller
 * shows nothing instead of a broken picture.
 */
export function photoOrNull(path: string, meta: ImageManifest = META): string | null {
  const key = path.startsWith("images/") ? `/${path}` : path;
  return visibleMeta(key, meta) ? key : null;
}

/** The visible photos of one folder, in display order, as { src, alt, width, height }. */
export function folderPhotos(folder: string, meta: ImageManifest = META): ProjectImage[] {
  const paths = has(meta.collections, folder) ? meta.collections[folder] : [];
  const out: ProjectImage[] = [];
  for (const path of paths) {
    const entry = visibleMeta(path, meta);
    if (!entry) continue;
    out.push({ src: entry.path, alt: entry.alt ?? altFromFileName(entry.file), width: entry.width, height: entry.height });
  }
  return out;
}

/** The cover: the visible photo marked `cover` in the project's folders, else the first phase photo. */
function coverOf(project: CompletedProjectText, phases: ProjectPhase[], meta: ImageManifest): string {
  const folders = [`projects/${project.slug}`, ...project.phases.map((p) => phaseFolder(project.slug, p.slug))];
  for (const folder of folders) {
    for (const path of has(meta.collections, folder) ? meta.collections[folder] : []) {
      if (visibleMeta(path, meta)?.cover) return path;
    }
  }
  return phases[0]?.images[0]?.src ?? "";
}

/** One project with its photos. Pure: the manifest is a parameter so tests can pass their own. */
export function assembleProject(project: CompletedProjectText, meta: ImageManifest = META): CompletedProject {
  const { phases: textPhases, ...rest } = project;
  const phases: ProjectPhase[] = [];
  for (const phase of textPhases) {
    const images = folderPhotos(phaseFolder(project.slug, phase.slug), meta);
    if (images.length > 0) phases.push({ ...phase, images });
  }
  const assembled = { ...rest, coverImage: coverOf(project, phases, meta), phases } as CompletedProject;
  // Same key order as the old hand-typed objects (coverImage after location).
  return reorder(project, assembled);
}

function reorder(text: CompletedProjectText, assembled: CompletedProject): CompletedProject {
  const out: Record<string, unknown> = {};
  const source = assembled as unknown as Record<string, unknown>;
  for (const key of Object.keys(text)) {
    if (key === "phases") {
      out.coverImage = source.coverImage;
    }
    out[key] = source[key];
  }
  if (!("coverImage" in out)) out.coverImage = source.coverImage;
  return out as unknown as CompletedProject;
}

export function assembleProjects(text: CompletedProjectText[], meta: ImageManifest = META): CompletedProject[] {
  return text.map((p) => assembleProject(p, meta));
}

/** Every completed project, with the photos found in its folders. */
export const COMPLETED_PROJECTS: CompletedProject[] = assembleProjects(COMPLETED_PROJECT_TEXT);

/** The slim card data a client component needs (no photo lists, only counts). */
export function projectCardData(project: CompletedProject): ProjectCardData {
  return {
    slug: project.slug,
    name: project.name,
    client: project.client,
    category: project.category,
    timeline: project.timeline,
    description: project.description,
    location: project.location,
    coverImage: project.coverImage,
    phases: project.phases.map((p) => ({ name: p.name, slug: p.slug, photoCount: p.images.length })),
  };
}

/**
 * Major-project proof for an area page: projects whose location mentions the
 * city, first three, as card data for the client CityProofBlock.
 */
export function cityProofProjects(cityName: string): ProjectCardData[] {
  return COMPLETED_PROJECTS.filter((p) => p.location?.toLowerCase().includes(cityName.toLowerCase()))
    .slice(0, 3)
    .map(projectCardData);
}
