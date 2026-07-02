import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Book a Service — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Book Online",
    title: "Book Your Plumber in 60 Seconds",
    subtitle: "Pick a time that works, tell us the problem, and a licensed C&S plumber is on the schedule.",
  });
}
