import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber on Sanibel Island, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Sanibel Island · FL",
    title: "Plumbing on Sanibel Island",
    subtitle: "Hurricane recovery, salt-air corrosion repairs & island-experienced plumbing crews.",
  });
}
