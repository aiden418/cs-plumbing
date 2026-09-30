import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { BUILDER_PROOF, getNewConstructionCity } from "@/lib/builder-program";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "New construction plumbing for builders — C&S Plumbing of Lee";

export default async function OgImage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const page = getNewConstructionCity(city);
  return createOgImage({
    variant: "service",
    eyebrow: "For Builders & GCs",
    title: `New Construction Plumbing — ${page?.city ?? "Southwest Florida"}`,
    subtitle: `${BUILDER_PROOF.headline} · Slab layout to final · Three generations`,
  });
}
