import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Contact C&S Plumbing of Lee";

export default function OgImage() {
  return createOgImage({
    eyebrow: "Talk to a Real Person",
    title: "Call, Text, or Message Us",
    subtitle: "833-PLUMB-IT · office@csplumbinglee.com · 951 Pondella Rd, North Fort Myers. Mon–Sat + 24/7 emergency.",
  });
}
