import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Bonita Springs, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Bonita Springs · FL",
    title: "Plumbing in Bonita Springs",
    subtitle: "Repipes, water heaters & emergency service for Bonita Springs homeowners.",
  });
}
