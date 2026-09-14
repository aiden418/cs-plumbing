import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { LATEST_AWARD } from "@/lib/constants";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = `${LATEST_AWARD.title} — ${LATEST_AWARD.category} — C&S Plumbing of Lee`;

export default function OgImage() {
  return createOgImage({
    eyebrow: LATEST_AWARD.title,
    title: `Voted ${LATEST_AWARD.category}`,
    subtitle: `By ${LATEST_AWARD.issuer} readers. Licensed, insured, and family-owned in Lee County since 1998.`,
  });
}
