import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Privacy Policy — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Legal",
    title: "Privacy Policy",
    subtitle: "How C&S Plumbing of Lee collects, uses and protects your information.",
  });
}
