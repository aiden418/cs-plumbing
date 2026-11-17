import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Fort Myers Beach, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Fort Myers Beach · FL",
    title: "Plumbing in Fort Myers Beach",
    subtitle: "New construction, repipes and service plumbing for Fort Myers Beach and Estero Island.",
  });
}
