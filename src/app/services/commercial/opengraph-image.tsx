import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Commercial Plumbing Services — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Commercial",
    title: "Commercial Plumbing & Tenant Buildouts",
    subtitle: "Restaurants, retail, medical, multi-family. Full permitting through Lee County.",
  });
}
