import type { PageHeroImage } from "@/components/ui/PageHero";

/**
 * Photos behind the shared PageHero. Area pages get their city shot, service
 * and service-city pages get the service photo, everything else falls back to
 * the drone jobsite image inside PageHero. Keep faces and skylines in frame
 * with `position`; the navy scrim covers the left 60% on desktop.
 */

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

export function areaHeroImage(slug: string): PageHeroImage | undefined {
  return AREA_PHOTOS.has(slug)
    ? { src: `/images/areas/${slug}.jpg`, position: "center 55%" }
    : undefined;
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

export function serviceHeroImage(
  serviceSlug?: string,
  explicit?: string
): PageHeroImage | undefined {
  const src = explicit ?? (serviceSlug ? SERVICE_PHOTOS[serviceSlug] : undefined);
  return src ? { src, position: "center" } : undefined;
}
