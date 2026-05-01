import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumbing Remodels — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Remodels",
    title: "Kitchen & Bath Plumbing Remodels",
    subtitle: "Fixture upgrades, pipe rerouting, full fixture-package installation across SWFL.",
  });
}
