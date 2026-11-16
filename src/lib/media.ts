/**
 * The site's pictures, resolved on the server.
 *
 * Everything here reads src/generated/, which scripts/build-image-manifest.mjs
 * rebuilds from public/images and src/content/media.json (after install,
 * before dev, tests and builds, and whenever a file changes during `npm run
 * dev`). Nothing touches the file system at render time.
 *
 *   image(path)          one picture by its public path (/images/<folder>/<file>), or null
 *   collection(folder)   the visible photos of a folder ("gallery"), in order
 *   slot(id)             a fixed picture from media.json ("home.hero"), with its phone version
 *   imageMeta(path)      the raw data of one file, hidden photos included
 *   folders(parent?)     the folders that can hold photos
 *
 * A picture that is missing or marked `hidden` resolves to null (or drops out
 * of a collection), so a component renders nothing instead of a broken image.
 *
 * Server only. A client component must never import this file or
 * src/generated/*: that would ship the whole picture registry to the browser.
 * Resolve the picture in a server component and pass the MediaRef down as a
 * prop (the types live in ./media-types, which is safe to import anywhere).
 */
import "server-only";
import { IMAGES } from "../generated/images";
import manifest from "../generated/images-meta.json";
import type { ImageManifest, ImageMeta, MediaOptions, MediaOverrides, MediaRef, MediaSlot } from "./media-types";

const META = manifest as unknown as ImageManifest;

const has = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

/** A path may be written with or without its leading slash; "derived:<id>" names a generated crop. */
function pathKey(path: string): string {
  return path.startsWith("images/") ? `/${path}` : path;
}

/** "gallery", "gallery/", "/images/gallery" and "images/gallery" are the same folder. */
function folderKey(folder: string): string {
  return folder
    .replace(/^\/+/, "")
    .replace(/^images\//, "")
    .replace(/\/+$/, "");
}

/**
 * Stand-in alt text for a photo nobody has described yet: the file name
 * without a leading number, dashes and underscores as spaces. A fallback,
 * not a description; `npm run photos:check` lists the photos that need one.
 * (Mirrors deriveAlt() in scripts/build-image-manifest.mjs.)
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

/** The manifest's data for one file, hidden or not. Null when there is no such file. */
export function imageMeta(path: string): ImageMeta | null {
  const key = pathKey(path);
  return has(META.images, key) ? META.images[key] : null;
}

/**
 * One picture by its public path ("/images/...") or crop name
 * ("derived:<id>"). Null when the file is absent or hidden.
 *
 * The blur-up placeholder is left out unless `blur: true` is passed: whatever
 * is handed to next/image travels to the browser inside the page, and the
 * placeholders alone were 22% of the HTML of a 68-photo test page.
 */
export function image(path: string, overrides: MediaOverrides = {}): MediaRef | null {
  const meta = imageMeta(path);
  if (!meta || meta.hidden) return null;

  const imported = has(IMAGES, meta.path) ? IMAGES[meta.path] : undefined;
  if (!imported && !meta.vector) return null;

  // A crop inherits the description of the picture it was cut from.
  const described = meta.derived && meta.source ? (imageMeta(meta.source) ?? meta) : meta;
  const ref: MediaRef = {
    // Displayed size, so the frame is right even for a photo with a rotation flag.
    src: imported
      ? overrides.blur
        ? { ...imported, width: meta.width, height: meta.height }
        : { src: imported.src, width: meta.width, height: meta.height }
      : meta.path,
    width: meta.width,
    height: meta.height,
    alt: overrides.alt ?? described.alt ?? altFromFileName(described.file),
    path: meta.path,
  };
  const color = overrides.color ?? (meta.alpha ? undefined : meta.color);
  if (color) ref.color = color;
  if (overrides.blur && imported?.blurDataURL) ref.blurDataURL = imported.blurDataURL;
  const position = overrides.position ?? meta.position;
  if (position) ref.position = position;
  const caption = overrides.caption ?? meta.caption;
  if (caption) ref.caption = caption;
  return ref;
}

/**
 * The visible photos of a folder under public/images, in display order: an
 * explicit `order` from images.json first, then natural file-name order
 * (photo-2 before photo-10). An unknown or empty folder is an empty list.
 * With `deep`, photos in sub-folders are included (same ordering rule,
 * folder by folder).
 */
export function collection(folder: string, options: { deep?: boolean } & MediaOptions = {}): MediaRef[] {
  const key = folderKey(folder);
  const direct = has(META.collections, key) ? META.collections[key] : [];
  const paths = options.deep && has(META.trees, key) ? META.trees[key] : direct;
  const out: MediaRef[] = [];
  for (const path of paths) {
    const ref = image(path, { blur: options.blur });
    if (ref) out.push(ref);
  }
  return out;
}

/**
 * Folders that can hold photos, in natural order: all of them, or those
 * inside `parent` (for example the phase folders of one project).
 */
export function folders(parent?: string): string[] {
  if (parent === undefined) return [...META.folders];
  const key = folderKey(parent);
  return META.folders.filter((folder) => key === "" || folder.startsWith(`${key}/`));
}

/**
 * A fixed picture set in src/content/media.json, with its phone version: the
 * owner's own "<name>-mobile.<ext>" beside the picture when there is one,
 * otherwise the crop the manifest made. Null when the slot is not set or its
 * picture is missing or hidden.
 */
export function slot(id: string, options: MediaOptions = {}): MediaSlot | null {
  const def = has(META.slots, id) ? META.slots[id] : undefined;
  if (!def) return null;
  const desktop = image(def.image, { alt: def.alt, position: def.position, blur: options.blur });
  if (!desktop) return null;
  const out: MediaSlot = { desktop, alt: desktop.alt };
  if (def.mobile) {
    const mobile = image(def.mobile, { alt: desktop.alt, position: def.mobilePosition, blur: options.blur });
    if (mobile) out.mobile = mobile;
  }
  return out;
}
