import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Fort Myers, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Fort Myers · FL",
    title: "Plumbing in Fort Myers",
    subtitle: "Residential, commercial & emergency plumbing across Fort Myers and Lee County.",
  });
}
