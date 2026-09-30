import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Builder & GC Plumbing Partner — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "For Builders & GCs",
    title: "9,500+ New Construction Homes Since 1998",
    subtitle: "Family owned and operated. Two Florida plumbing contractor licenses. Slab layout to final across Lee & Charlotte counties.",
  });
}
