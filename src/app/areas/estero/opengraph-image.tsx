import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Estero, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Estero · FL",
    title: "Plumbing in Estero",
    subtitle: "Family-owned plumbing service across Estero, Coconut Point & The Brooks.",
  });
}
