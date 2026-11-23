import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { BUSINESS } from "@/lib/business";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "24/7 Emergency Plumber — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "emergency",
    eyebrow: "24/7 Emergency Service",
    title: "Plumbing Emergency? We're On Our Way.",
    subtitle: `Open 24/7. Call for current availability. ${BUSINESS.phone}.`,
  });
}
