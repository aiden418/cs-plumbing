import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Port Charlotte, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Port Charlotte · FL",
    title: "Plumbing in Port Charlotte",
    subtitle: "Drain cleaning, water treatment & 24/7 emergency plumbing — family-owned since 1998.",
  });
}
