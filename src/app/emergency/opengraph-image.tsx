import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "24/7 Emergency Plumber — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "emergency",
    eyebrow: "24/7 Emergency Service",
    title: "Plumbing Emergency? We're On Our Way.",
    subtitle: "Real dispatchers, average response under 60 minutes across Lee, Collier & Charlotte counties. 833-PLUMB-IT.",
  });
}
