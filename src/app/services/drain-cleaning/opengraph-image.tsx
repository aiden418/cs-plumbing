import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Drain Cleaning & Hydro-Jetting — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Drain Cleaning",
    title: "Hydro-Jetting & Sewer Camera Inspection",
    subtitle: "Cable, hydro-jetting up to 4,000 PSI, root removal. $150–$500 typical residential.",
  });
}
