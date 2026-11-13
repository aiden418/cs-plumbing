import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { GIVEAWAY } from "@/lib/giveaway";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "C&S Plumbing of Lee Water Heater Giveaway";

export default function OgImage() {
  return createOgImage({
    eyebrow: `Giveaway · Ends ${GIVEAWAY.endsLabel}`,
    title: "Win a New Water Heater, Installed Free",
    subtitle: "Free to enter for Southwest Florida homeowners. Add a photo of your current water heater and you're in.",
  });
}
