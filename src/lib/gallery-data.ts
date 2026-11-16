import manifest from "../generated/images-meta.json";
import type { ImageManifest } from "./media-types";
import { altFromFileName } from "./projects-data";
import type { GalleryItem } from "./types";

/**
 * The /gallery grid. Lives outside the client component so the sitemap can
 * list every photo (image sitemap) without pulling a "use client" module
 * into server code — client-module exports arrive there as references, not
 * values.
 *
 * The photos are discovered from public/images/gallery/ through the image
 * manifest; nothing is typed here. Each photo's id, alt text, title,
 * category and order live in the images.json beside it:
 *
 *   public/images/gallery/images.json             the photos directly in gallery/
 *                                                 (category comes from images.json)
 *   public/images/gallery/<category>/images.json  photos added by `npm run gallery:ingest`
 *                                                 (category is the folder name)
 *
 * Order: explicit `order` first, then natural file-name order, so a new file
 * without settings appears last. `hidden: true` takes a photo off the page.
 * A photo without an id gets a stable one from its file name.
 *
 * Plain data (no static image imports), safe for the sitemap. Client
 * components receive GALLERY_ITEMS as a prop from a server page.
 */

const META = manifest as unknown as ImageManifest;

const has = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

/** Build the gallery list from a manifest. Pure, so tests can pass their own. */
export function buildGalleryItems(meta: ImageManifest = META): GalleryItem[] {
  const paths = has(meta.trees, "gallery") ? meta.trees.gallery : has(meta.collections, "gallery") ? meta.collections.gallery : [];
  const items: GalleryItem[] = [];
  for (const path of paths) {
    const entry = has(meta.images, path) ? meta.images[path] : undefined;
    if (!entry || entry.hidden || entry.vector || entry.derived) continue;
    const sub = entry.folder.split("/").slice(1).join("/");
    const category = (sub ? sub.split("/")[0] : entry.category) as GalleryItem["category"] | undefined;
    const alt = entry.alt ?? altFromFileName(entry.file);
    const rel = path.replace(/^\/images\/gallery\//, "");
    items.push({
      id: entry.id ?? `file:${rel.replace(/\.[^.]*$/, "")}`,
      src: entry.path,
      alt,
      category: (category ?? "residential") as GalleryItem["category"],
      title: entry.title ?? alt,
      width: entry.width,
      height: entry.height,
    });
  }
  return items;
}

export const GALLERY_ITEMS: GalleryItem[] = buildGalleryItems();
