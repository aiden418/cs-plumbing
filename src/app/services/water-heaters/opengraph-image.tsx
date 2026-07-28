import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Water Heater Repair & Installation — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Water Heaters",
    title: "Tank, Tankless & Hybrid Installation",
    subtitle: "Repairs from $195 · Tank replacements $1,650–$2,500 · Same-day install in most cases",
  });
}
