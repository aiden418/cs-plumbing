import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "About C&S Plumbing of Lee — Three Generations of Plumbers";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Family-Owned Since 1997",
    title: "Three Generations. One Name on Every Job.",
    subtitle: "The Pellechio family has plumbed 8,500+ Southwest Florida homes. Meet the team behind C&S.",
  });
}
