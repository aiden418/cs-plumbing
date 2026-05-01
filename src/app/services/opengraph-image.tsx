import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumbing Services — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Our Services",
    title: "Every Plumbing Solution Under One Roof",
    subtitle: "Emergency, drain cleaning, water heaters, repiping, new construction & commercial",
  });
}
