/**
 * Server-only: turns the old PageHero `image` (a public path, or a path with
 * alt and object-position) into the framed photograph PageHero shows as
 * `frame`. Stock city scenery and the deny-listed cards resolve to null, so
 * the header falls back to the type-led layout; so does a picture that is
 * missing or hidden in images.json.
 *
 * PageHero itself stays free of "@/lib/media" because client components
 * render it. A server page resolves the picture here and passes it down:
 *
 *   <ServiceCityLandingTemplate heroFrame={heroFrame(serviceHeroImage(slug))} />
 */
import "server-only";
import { image, imageMeta } from "@/lib/media";
import type { MediaRef } from "@/lib/media-types";
import { isTypeLedHeroPath, type PageHeroImage } from "@/lib/hero-images";

export function heroFrame(input: string | PageHeroImage | null | undefined): MediaRef | null {
  if (!input) return null;
  const { src, alt, position } = typeof input === "string" ? { src: input, alt: undefined, position: undefined } : input;
  if (isTypeLedHeroPath(src)) return null;
  // Header photos were decorative (the H1 carries the meaning); keep a real
  // description when the owner wrote one in images.json.
  const described = alt ?? imageMeta(src)?.alt ?? "";
  return image(src, { alt: described, ...(position ? { position } : {}) });
}
