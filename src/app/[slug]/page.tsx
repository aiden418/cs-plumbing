import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import ServiceCityLandingTemplate from "@/components/service-city/ServiceCityLandingTemplate";
import ServiceCityJsonLd from "@/components/seo/ServiceCityJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import GoogleReviews from "@/components/home/GoogleReviews";
import RelatedProjects from "@/components/projects/RelatedProjects";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";
import { getServiceHub } from "@/lib/service-hubs";
import { projectsForCity } from "@/lib/projects";

export function generateStaticParams() {
  return SERVICE_CITY_LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = SERVICE_CITY_LANDINGS.find((l) => l.slug === slug);
  if (!landing) return {};

  return {
    title: landing.metaTitle,
    description: landing.metaDescription,
    keywords: landing.keywords,
    alternates: { canonical: `/${landing.slug}` },
    openGraph: {
      title: landing.metaTitle,
      description: landing.metaDescription,
      url: `https://www.csplumbinglee.com/${landing.slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = SERVICE_CITY_LANDINGS.find((l) => l.slug === slug);
  if (!landing) notFound();

  const hub = getServiceHub(landing.serviceSlug);

  return (
    <PageTransition>
      <ServiceCityJsonLd landing={landing} />
      <FaqJsonLd faqs={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          ...(hub ? [{ name: hub.title, href: hub.href }] : []),
          { name: landing.h1, href: `/${landing.slug}` },
        ]}
      />
      <ServiceCityLandingTemplate landing={landing} />
      {/* Local proof: documented jobs in this city, service-matched first.
          Renders nothing for cities with no project page yet. */}
      <RelatedProjects
        projects={projectsForCity(landing.city, { hub: landing.serviceSlug, limit: 3 })}
        heading={`Recent projects in ${landing.city}`}
        description={`Real jobs we've documented in ${landing.city}, photographed phase by phase with the builder or GC named.`}
      />
      <GoogleReviews />
      <CTASection />
    </PageTransition>
  );
}
