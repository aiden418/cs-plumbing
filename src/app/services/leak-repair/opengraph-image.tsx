import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Leak Detection & Repair — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Leak Detection",
    title: "Find Hidden Leaks Without Demolition",
    subtitle: "Electronic detection for slab, wall & underground leaks. From $150 simple, $800+ slab.",
  });
}
