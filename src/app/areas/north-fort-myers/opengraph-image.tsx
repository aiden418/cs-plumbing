import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in North Fort Myers, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "North Fort Myers · FL",
    title: "Plumbing in North Fort Myers",
    subtitle: "Headquartered on Pondella Rd. Fastest local response times in the area.",
  });
}
