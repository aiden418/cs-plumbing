import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumber in Naples, FL — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "area",
    eyebrow: "Naples · FL",
    title: "Plumbing in Naples",
    subtitle: "Luxury home plumbing, repipes & emergency service in Naples and Collier County.",
  });
}
