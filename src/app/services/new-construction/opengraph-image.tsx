import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "New Construction Plumbing — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "New Construction",
    title: "8,500+ Homes Plumbed Since 1998",
    subtitle: "SWFL's most experienced new-construction plumbing partner for residential & commercial builders.",
  });
}
