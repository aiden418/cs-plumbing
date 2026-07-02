import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Project Gallery — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Our Work",
    title: "8,500+ Homes. See the Craft.",
    subtitle: "Underground to trim-out — real photos from C&S Plumbing job sites across Southwest Florida.",
  });
}
