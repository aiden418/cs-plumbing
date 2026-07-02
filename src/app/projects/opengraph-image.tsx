import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Completed Projects — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "service",
    eyebrow: "Case Studies",
    title: "Real Jobs. Real Photos. Real Timelines.",
    subtitle: "From production homes to airport hangars — how C&S delivers plumbing across Southwest Florida.",
  });
}
