import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { from, spanInline } from "@/lib/pricing";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Water Heater Repair & Installation — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Water Heaters",
    title: "Water Heater Repair & Installation",
    subtitle: `Repairs ${from("waterHeater.repair")} · Tank replacements ${spanInline("waterHeater.tank40", "waterHeater.tank50")} · Tankless & hybrid options · Same-day in most cases`,
  });
}
