import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Whole-Home Repiping in Cape Coral & Fort Myers";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Repipe Specialists",
    title: "Whole-Home Repiping",
    subtitle: "Copper or PEX, $4,000–$15,000. Most homes done in 1–2 days. Full Lee County permitting.",
  });
}
