import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Builder Portal — Send Plans for a Plumbing Bid";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Builder Portal",
    title: "Send Plans for a Plumbing Bid",
    subtitle: "New construction, commercial and remodel projects across Southwest Florida.",
  });
}
