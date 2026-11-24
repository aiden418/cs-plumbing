import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceCityLandingTemplate from "@/components/service-city/ServiceCityLandingTemplate";
import CityServiceLinks from "@/components/service-city/CityServiceLinks";
import ServiceCityJsonLd from "@/components/seo/ServiceCityJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import GoogleReviews from "@/components/home/GoogleReviews";
import RelatedProjects from "@/components/projects/RelatedProjects";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { PUBLISHED_LANDINGS, isIndexed } from "@/lib/landing-indexing";
import { getServiceHub } from "@/lib/service-hubs";
import { areaForCity, postsForLanding } from "@/lib/internal-links";
import { projectsForCity, projectsForHub } from "@/lib/projects";
import { UepNoticeAndEstimate, UepPhaseStatus } from "@/components/services/UepSections";
import { UEP_PAGE } from "@/content/services";

// Only published landings get a page; a retired slug is a redirect in
// next.config.ts, and anything else is a 404 rather than a runtime render.
export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED_LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = PUBLISHED_LANDINGS.find((l) => l.slug === slug);
  if (!landing) return {};

  return {
    // Absolute: these titles already carry service + city + a hook; the
    // brand template made them 70–85 characters and truncated in results.
    title: { absolute: landing.metaTitle },
    description: landing.metaDescription,
    keywords: landing.keywords,
    alternates: { canonical: `/${landing.slug}` },
    ...(isIndexed(landing) ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      siteName: "C&S Plumbing of Lee",
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
  const landing = PUBLISHED_LANDINGS.find((l) => l.slug === slug);
  if (!landing) notFound();

  const hub = getServiceHub(landing.serviceSlug);
  const area = areaForCity(landing.city);
  // The Cape Coral connection page carries the dated UEP status, the
  // notice-date steps and the estimate request that asks for both facts.
  const isUepConnection = `/${landing.slug}` === UEP_PAGE.cityPageHref;
  // Local proof first. A city with no documented job yet shows the same
  // service documented elsewhere, under a heading that says so.
  const cityProjects = projectsForCity(landing.city, { hub: landing.serviceSlug, limit: 3 });
  const serviceProjects =
    cityProjects.length === 0 && landing.serviceSlug ? projectsForHub(landing.serviceSlug, 3) : [];
  const hasProjects = cityProjects.length > 0 || serviceProjects.length > 0;

  return (
    <>
      <ServiceCityJsonLd landing={landing} />
      <FaqJsonLd faqs={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          ...(hub ? [{ name: hub.title, href: hub.href }] : []),
          { name: landing.h1, href: `/${landing.slug}` },
        ]}
      />
      <ServiceCityLandingTemplate
        landing={landing}
        areaHubHref={area ? `/areas/${area.slug}` : undefined}
        {...(isUepConnection
          ? {
              secondAction: { label: UEP_PAGE.estimateLabel, href: "#estimate" },
              afterTrust: (
                <>
                  <UepPhaseStatus tone="white" />
                  <UepNoticeAndEstimate tone="shell" />
                </>
              ),
            }
          : {})}
      />
      {/* Siblings in this city, this service elsewhere, and both parent hubs —
          server-rendered so the links are in the HTML. */}
      <CityServiceLinks landing={landing} />
      {/* Local proof: documented jobs in this city, service-matched first.
          Renders nothing for cities with no project page yet. */}
      <RelatedProjects
        projects={cityProjects}
        tone="shell"
        heading={`Recent projects in ${landing.city}`}
        description={`Real jobs we've documented in ${landing.city}, photographed phase by phase with the builder or GC named.`}
      />
      <RelatedProjects
        projects={serviceProjects}
        tone="shell"
        overline="Documented work"
        heading="The same work on jobs we've documented"
        description="Photographed on site, elsewhere in Southwest Florida."
      />
      {/* The guides that send readers to this page, linked back. Renders
          nothing for a landing no post refers to. */}
      <RelatedPosts
        posts={postsForLanding(landing.slug)}
        tone={hasProjects ? "white" : "shell"}
        heading="Related plumbing guides"
      />
      <GoogleReviews />
      <CTASection />
    </>
  );
}
