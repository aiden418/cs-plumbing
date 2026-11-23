import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Request Service — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Request Service",
    title: "Request a Plumber Online",
    subtitle: "Tell us the problem and the time you prefer. Our office calls to confirm your appointment.",
  });
}
