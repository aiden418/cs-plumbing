import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Builder & GC Plumbing Partner — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "For Builders & GCs",
    title: "Your Plumbing Sub for the Next 8,500",
    subtitle: "Dual CFC licenses, prequal package in 24 hours, AIA pay apps, crews across Lee, Collier & Charlotte.",
  });
}
