import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import ServiceCityLandingTemplate from "@/components/service-city/ServiceCityLandingTemplate";
import ServiceCityJsonLd from "@/components/seo/ServiceCityJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";

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

  return (
    <PageTransition>
      <ServiceCityJsonLd landing={landing} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: landing.h1, href: `/${landing.slug}` },
        ]}
      />
      <ServiceCityLandingTemplate landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
