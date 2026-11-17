import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Recommended Companies — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Recommended Companies",
    title: "Local Companies We Trust and Recommend",
    subtitle: "HVAC, roofing, general contractors, screen enclosures and concrete across Cape Coral & SWFL.",
  });
}
