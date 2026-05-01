import { createOgImage, ogImageContentType, ogImageSize, type OgVariant } from "@/lib/og";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "C&S Plumbing service area";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = SERVICE_CITY_LANDINGS.find((l) => l.slug === slug);
  return [{ id: "default", alt: landing?.metaTitle ?? alt }];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = SERVICE_CITY_LANDINGS.find((l) => l.slug === slug);
  if (!landing) {
    return createOgImage({
      eyebrow: "Southwest Florida",
      title: "C&S Plumbing of Lee",
      subtitle: "Family-owned since 1998. Licensed CFC1432485. 24/7 emergency service.",
    });
  }

  const isEmergency = landing.slug.startsWith("emergency-");
  const variant: OgVariant = isEmergency ? "emergency" : "service-city";

  return createOgImage({
    variant,
    eyebrow: `${landing.city} · FL`,
    title: landing.h1,
    subtitle: landing.priceRange
      ? `${landing.heroSubtext.slice(0, 110)} · ${landing.priceRange}`
      : landing.heroSubtext.slice(0, 140),
  });
}
