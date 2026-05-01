import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "UEP Utilities & Underground Hookup — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "UEP Utilities",
    title: "Underground Utility & UEP Hookup",
    subtitle: "Cape Coral UEP transitions, sewer hookups & new construction underground utilities.",
  });
}
