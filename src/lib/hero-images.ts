import type { MediaRef } from "@/lib/media-types";

/**
 * Which photograph a page header may show, and how PageHero lays itself out.
 *
 * Safe for client components: no picture data lives here, only paths and
 * rules. A path becomes a framed photograph only after a server component
 * resolves it with heroFrame() from "@/lib/hero-frame" (which reads the image
 * manifest) and passes the result to PageHero as `frame`.
 */

/** The old `image` prop: a public path, or a path with alt and object-position. */
export interface PageHeroImage {
  src: string;
  /** Decorative by default: the H1 carries the meaning. */
  alt?: string;
  /** CSS object-position, e.g. "center 30%". */
  position?: string;
}

export type PageHeroLayout = "cinema" | "split" | "type-led" | "editorial" | "compact" | "urgent";

/**
 * Pictures that never fill a page header: stock city scenery is not C&S work,
 * and these two service cards are too dark or too generic for a hero slot
 * (plan, Appendix D deny-list).
 */
const HERO_DENY_LIST = new Set(["/images/services/cards/drain-cleaning.jpg", "/images/services/cards/emergency.jpg"]);

function normalisePath(path: string): string {
  return path.startsWith("images/") ? `/${path}` : path;
}

/** True when a header photo path must give way to the type-led layout. */
export function isTypeLedHeroPath(path: string): boolean {
  const key = normalisePath(path);
  return key.startsWith("/images/areas/") || HERO_DENY_LIST.has(key);
}

const AREA_PHOTOS = new Set([
  "bonita-springs",
  "cape-coral",
  "estero",
  "fort-myers",
  "lehigh-acres",
  "naples",
  "north-fort-myers",
  "port-charlotte",
  "punta-gorda",
  "sanibel",
]);

/**
 * The city photo an area page used to put behind its header. These are stock
 * scenery, so PageHero shows the type-led layout for them; the path is kept
 * so the rule stays visible in one place.
 */
export function areaHeroImage(slug: string): PageHeroImage | undefined {
  return AREA_PHOTOS.has(slug) ? { src: `/images/areas/${slug}.jpg`, position: "center 55%" } : undefined;
}

const SERVICE_PHOTOS: Record<string, string> = {
  repiping: "/images/services/cards/repiping.jpg",
  "water-heaters": "/images/services/cards/water-heaters.jpg",
  "drain-cleaning": "/images/services/cards/drain-cleaning.jpg",
  "leak-repair": "/images/services/cards/emergency.jpg",
  emergency: "/images/services/cards/emergency.jpg",
  "water-softeners": "/images/services/cards/water-softeners.jpg",
  "plumbing-remodel": "/images/services/cards/plumbing-remodel.jpg",
  "new-construction": "/images/services/cards/new-construction.jpg",
  commercial: "/images/services/cards/commercial.jpg",
  "uep-utilities": "/images/services/uep-utilities/photo-1.jpg",
};

/** The service photo for a service or service-city page header (a path; resolve it with heroFrame()). */
export function serviceHeroImage(serviceSlug?: string, explicit?: string): PageHeroImage | undefined {
  const src = explicit ?? (serviceSlug ? SERVICE_PHOTOS[serviceSlug] : undefined);
  return src ? { src, position: "center" } : undefined;
}

/** A picture already resolved by the server (it has its measured size). */
export function isMediaRef(value: unknown): value is MediaRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "width" in value &&
    "height" in value &&
    typeof (value as MediaRef).width === "number" &&
    typeof (value as MediaRef).height === "number"
  );
}

export interface HeroLayoutInput {
  layout?: PageHeroLayout;
  hasFrame: boolean;
  hasMedia: boolean;
  /** The old `image` prop was given (a path that could not be framed here). */
  hasImage: boolean;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  accentTone?: "gold" | "emergency";
}

/**
 * The layout a header gets when the caller does not name one, chosen so the
 * pages written for the old PageHero look right without changes:
 * a `media` node or a framed photo → split; the emergency tone → urgent; an
 * old `image` that cannot be framed → type-led; size "sm" → compact; a
 * centred header → editorial; anything else → type-led.
 */
export function resolveHeroLayout(input: HeroLayoutInput): PageHeroLayout {
  if (input.layout) return input.layout;
  if (input.hasMedia || input.hasFrame) return "split";
  if (input.accentTone === "emergency") return "urgent";
  if (input.hasImage) return "type-led";
  if (input.size === "sm") return "compact";
  if (input.align === "center") return "editorial";
  return "type-led";
}

export type HeadlineWidth = "display-wide" | "default" | "display-normal" | "display-tight";

/** The whole H1 as one string: title, then accent after a space. */
export function headlineText(title: string, accent?: string): string {
  return accent ? `${title} ${accent}` : title;
}

/**
 * Headline width from its length (Archivo's width axis): short lines go wide,
 * long keyword headlines narrow. The longest also step down one size.
 */
export function headlineWidth(text: string): { width: HeadlineWidth; stepDown: boolean } {
  const n = text.trim().length;
  if (n <= 24) return { width: "display-wide", stepDown: false };
  if (n <= 44) return { width: "default", stepDown: false };
  if (n <= 64) return { width: "display-normal", stepDown: false };
  return { width: "display-tight", stepDown: true };
}

/** Portrait photos go in 4:5 frames, landscape ones in 3:2. */
export function frameOrientation(media: Pick<MediaRef, "width" | "height">): "portrait" | "landscape" {
  return media.height > media.width ? "portrait" : "landscape";
}

/** Deterministic pick of one of the three plan-motif drawings. */
export function planVariant(seed: string): "a" | "b" | "c" {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (["a", "b", "c"] as const)[(hash >>> 0) % 3];
}

/** "26.6664° N · 81.9172° W" from a latitude and longitude. */
export function formatCoordinates(geo: { latitude: number; longitude: number }): string {
  const lat = `${Math.abs(geo.latitude).toFixed(4)}° ${geo.latitude >= 0 ? "N" : "S"}`;
  const lon = `${Math.abs(geo.longitude).toFixed(4)}° ${geo.longitude >= 0 ? "E" : "W"}`;
  return `${lat} · ${lon}`;
}
