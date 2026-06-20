import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Punta Gorda, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Punta Gorda · FL",
    title: "Plumbing in Punta Gorda",
    subtitle: "Water heaters, emergency repairs & repiping across Charlotte County — family-owned since 1997.",
  });
}
