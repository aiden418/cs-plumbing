import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { TERMS_VERSION } from "@/lib/terms-meta";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Terms & Conditions — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Legal",
    title: "Terms & Conditions",
    subtitle: `Rev. ${TERMS_VERSION}. Governs every estimate, proposal and invoice from C&S Plumbing of Lee.`,
  });
}
