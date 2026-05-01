import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "C&S Plumbing of Lee — Southwest Florida's Most Trusted Plumber";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Southwest Florida's Most Trusted",
    title: "Plumbing Built on Trust, Backed by Results",
    subtitle: "Cape Coral, Fort Myers, Naples & all of SWFL · 8,500+ homes built · 24/7 emergency",
  });
}
