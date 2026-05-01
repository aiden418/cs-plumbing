import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Lehigh Acres, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Lehigh Acres · FL",
    title: "Plumbing in Lehigh Acres",
    subtitle: "Septic-to-sewer conversion, repipes & whole-home plumbing across Lehigh Acres.",
  });
}
