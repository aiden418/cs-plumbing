/**
 * Types for the picture system (src/lib/media.ts). Types only, so client
 * components can import this file without pulling any picture data into the
 * browser bundle.
 */
import type { StaticImageData } from "next/image";

export type { StaticImageData };

/**
 * One picture, ready for next/image (or the Frame component). Plain data: a
 * server component resolves it and may pass it to a client component as a prop.
 */
export type MediaRef = {
  /**
   * A statically imported picture, whose URL contains a hash of the file's
   * contents, or, for an SVG file, its public path.
   */
  src: StaticImageData | string;
  /** Pixel size as displayed (the rotation flag of a phone photo already applied). */
  width: number;
  height: number;
  alt: string;
  /** Dominant colour (#rrggbb) for a placeholder box. Absent for see-through and vector pictures. */
  color?: string;
  /**
   * Blur-up placeholder. Only present when asked for (`{ blur: true }`): it is
   * close to 1 KB per picture and is sent to the browser inside the page.
   */
  blurDataURL?: string;
  /** CSS object-position for cropped frames, e.g. "50% 30%". */
  position?: string;
  caption?: string;
  /**
   * Where the file lives under public/ ("/images/..."), or "derived:<id>" for a
   * crop made by the manifest. It does not change when the file is replaced,
   * so use it for sitemaps, JSON-LD, Open Graph tags and React keys.
   */
  path: string;
};

/** What a caller may override on a resolved picture. */
export type MediaOverrides = Partial<Pick<MediaRef, "alt" | "position" | "caption" | "color">> & MediaOptions;

/** How a picture is resolved. */
export type MediaOptions = {
  /**
   * Include the blur-up placeholder (`blurDataURL`, and inside `src`). Off by
   * default: the design shows the dominant colour while a photo loads, and
   * every blur placeholder adds about 1 KB to the HTML of the page.
   */
  blur?: boolean;
};

/** A fixed picture from src/content/media.json, with its phone version when there is one. */
export type MediaSlot = {
  desktop: MediaRef;
  mobile?: MediaRef;
  alt: string;
};

/** One entry of src/generated/images-meta.json. */
export type ImageMeta = {
  path: string;
  /** Folder under public/images, e.g. "gallery" or "projects/<slug>/<phase>". */
  folder: string;
  file: string;
  width: number;
  height: number;
  bytes: number;
  /** First 16 hex characters of the file's SHA-256. */
  sha256: string;
  color?: string;
  /** The picture has see-through areas. */
  alpha?: boolean;
  /** An SVG file: listed, served from its public path, not imported. */
  vector?: boolean;
  // The owner's settings from the folder's images.json.
  alt?: string;
  caption?: string;
  title?: string;
  category?: string;
  id?: string;
  order?: number;
  position?: string;
  hidden?: boolean;
  cover?: boolean;
  featured?: boolean;
  /** This file is the owner's phone version ("<name>-mobile.<ext>") of that slot picture. */
  mobileOf?: string;
  /** A crop made by the manifest: where it was cut from, and the box in source pixels. */
  derived?: boolean;
  source?: string;
  box?: { left: number; top: number; width: number; height: number };
};

/** A slot as the manifest resolved it. */
export type ResolvedSlot = {
  image: string;
  alt?: string;
  position?: string;
  /** Public path of the owner's phone version, or "derived:<id>" for a generated crop. */
  mobile?: string;
  mobilePosition?: string;
};

/** The shape of src/generated/images-meta.json. */
export type ImageManifest = {
  version: number;
  images: Record<string, ImageMeta>;
  /** Every folder that can hold photos, in natural order. */
  folders: string[];
  /** Folder -> visible photos directly inside it, in display order. */
  collections: Record<string, string[]>;
  /** Folder that has sub-folders -> visible photos in it and below, in display order. */
  trees: Record<string, string[]>;
  slots: Record<string, ResolvedSlot>;
};
