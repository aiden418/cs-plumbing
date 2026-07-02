import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Reviews — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "5.0 Stars on Google",
    title: "What Your Neighbors Say",
    subtitle: "Verified Google reviews from Cape Coral, Fort Myers, and across Southwest Florida.",
  });
}
