import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Plumbing Tips & Guides — C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    variant: "blog",
    eyebrow: "Plumbing Tips & Guides",
    title: "Plumbing Tips for Southwest Florida Homes",
    subtitle: "Repiping, water heaters, emergency plumbing and more from C&S Plumbing of Lee.",
  });
}
