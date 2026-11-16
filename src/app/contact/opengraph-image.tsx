import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { BUSINESS } from "@/lib/business";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Contact C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Talk to a Real Person",
    title: "Call, Text, or Message Us",
    subtitle: `${BUSINESS.phone} · ${BUSINESS.email} · ${BUSINESS.address}, ${BUSINESS.city}. Open 24 hours, 7 days a week.`,
  });
}
