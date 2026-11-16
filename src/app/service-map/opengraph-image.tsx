import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Service Map — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Service Map",
    title: "Where C&S Plumbing Works",
    subtitle: "Job locations across Cape Coral, Fort Myers, Naples and Southwest Florida.",
  });
}
