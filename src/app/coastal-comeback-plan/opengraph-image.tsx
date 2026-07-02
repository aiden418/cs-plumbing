import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Coastal Comeback Plan — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Seasonal & Snowbird Homes",
    title: "The Coastal Comeback Plan",
    subtitle: "Shutdown, monitoring, and spring start-up for vacant SWFL homes — plans from $349/yr.",
  });
}
