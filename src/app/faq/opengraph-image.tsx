import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumbing FAQs — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Straight Answers",
    title: "Plumbing Questions, Answered",
    subtitle: "Pricing, permits, timelines, and emergencies — answered by Southwest Florida's most trusted plumbing team.",
  });
}
