import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Residential Plumbing Services — C&S Plumbing";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Residential",
    title: "Plumbing for Every Room of Your Home",
    subtitle: "Repairs, repipes, fixture installs, and water treatment for SWFL homeowners.",
  });
}
