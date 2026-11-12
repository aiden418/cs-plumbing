import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Tankless Water Heater Installation & Repair — Fort Myers & Cape Coral";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Tankless Water Heaters",
    title: "Tankless Installation & Repair",
    subtitle: "Rinnai · Navien · Noritz · $3,500–$5,200 installed with gas line & venting · Same-day repair",
  });
}
