import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "C&S Plumbing of Lee — Southwest Florida's Most Trusted Plumber";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Southwest Florida's Most Trusted",
    title: "Plumbing Built on Trust, Backed by Results",
    subtitle: "New construction for builders · Service for homeowners · 9,500+ homes plumbed across SWFL",
  });
}
