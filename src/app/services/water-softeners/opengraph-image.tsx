import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Water Softeners & Treatment — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Water Treatment",
    title: "Water Softeners & Filtration",
    subtitle: "Engineered for Southwest Florida's hard water — installation, service & maintenance.",
  });
}
