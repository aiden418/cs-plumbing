import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Cape Coral, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Cape Coral · FL",
    title: "Plumbing in Cape Coral",
    subtitle: "Repipes, water heaters, drain cleaning & 24/7 emergency service across all 4 quadrants.",
  });
}
