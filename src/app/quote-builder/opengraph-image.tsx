import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Instant Quote Builder — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Instant Quote",
    title: "Price Your Project in 2 Minutes",
    subtitle: "Repipes, water heaters, and more — honest ballpark pricing before anyone steps in your door.",
  });
}
