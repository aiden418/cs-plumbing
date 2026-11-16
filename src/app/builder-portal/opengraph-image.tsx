import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Builder Portal — Submit Plans for a Plumbing Quote";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Builder Portal",
    title: "Submit Plans for a Plumbing Quote",
    subtitle: "New construction, commercial and remodel projects across Southwest Florida.",
  });
}
