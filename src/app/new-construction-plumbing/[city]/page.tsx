import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Landmark, MapPin } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import FaqAccordionList from "@/components/builders/FaqList";
import BuilderBidForm from "@/components/builders/BuilderBidForm";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import { ConstructionPhases, SchedulingPanel } from "@/components/builders/BuilderSections";
import RelatedProjects from "@/components/projects/RelatedProjects";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import {
  BUILDER_PROOF,
  CAPABILITY_STATEMENT_PDF,
  CONSTRUCTION_PHASES,
  NEW_CONSTRUCTION_CITIES,
  getNewConstructionCity,
} from "@/lib/builder-program";
import { projectsForCity } from "@/lib/projects";

const BASE = "https://www.csplumbinglee.com";

export function generateStaticParams() {
  return NEW_CONSTRUCTION_CITIES.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const page = getNewConstructionCity(city);
  if (!page) return {};
  const path = `/new-construction-plumbing/${page.slug}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: `${BASE}${path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const page = getNewConstructionCity(city);
  if (!page) notFound();

  const path = `/new-construction-plumbing/${page.slug}`;
  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Builders", href: "/builders" },
    { name: `New Construction Plumbing — ${page.city}`, href: path },
  ];
  const projects = projectsForCity(page.city, { hub: "new-construction", limit: 3 });

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}${path}#service`,
    name: `New Construction Plumbing in ${page.city}, FL`,
    serviceType: "New Construction Plumbing",
    description: page.metaDescription,
    audience: { "@type": "BusinessAudience", audienceType: "Home builders and general contractors" },
    provider: { "@id": `${BASE}/#organization` },
    isRelatedTo: { "@id": `${BASE}/builders#service` },
    areaServed: {
      "@type": "City",
      name: `${page.city}, FL`,
      containedInPlace: { "@type": "AdministrativeArea", name: `${page.county} County, Florida` },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `New construction plumbing phases — ${page.city}`,
      itemListElement: CONSTRUCTION_PHASES.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: p.name, description: p.summary },
      })),
    },
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FaqJsonLd faqs={page.faqs} />
      <BreadcrumbJsonLd items={breadcrumb} />

      <PageHero
        overline={`For builders & GCs · ${page.city}, FL`}
        title="New Construction Plumbing in"
        accent={`${page.city}, FL`}
        breadcrumb={breadcrumb}
        description={`${BUILDER_PROOF.headline}. ${page.intro}`}
        actions={
          <>
            <Button href="#bid" variant="gold" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Submit Plans for a Bid
            </Button>
            <a
              href={CAPABILITY_STATEMENT_PDF}
              download
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
            >
              <Download className="w-5 h-5" />
              Capability Statement
            </a>
          </>
        }
      />

      {/* Local conditions */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            overline={`${page.city} site conditions`}
            title={`What changes the plumbing in ${page.city}`}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.localConditions.map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
                <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-gray-500">
            <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Permits and inspections in {page.city}: {page.permitAuthority}.
          </p>
        </Container>
      </section>

      <ConstructionPhases />

      <RelatedProjects
        projects={projects}
        overline="Documented builds"
        heading={`Our work in ${page.city}`}
        description={`Jobs we've photographed phase by phase in ${page.city}.`}
      />

      <SchedulingPanel />
      <NewConstructionBenefits overline="What your buyers get" />

      {/* Bid form */}
      <section id="bid" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <BuilderBidForm
              source={`nc-city:${page.slug}`}
              heading={`Submit ${page.city} plans for a bid`}
            />
            <p className="mt-6 text-center text-sm text-gray-500">
              Need our license, COI or W-9 first?{" "}
              <Link href="/builders#prequal" className="font-medium text-primary hover:underline">
                See the prequal packet
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-[#F5F5F7] py-16 sm:py-24">
        <Container>
          <SectionHeading overline="FAQ" title={`${page.city} new construction questions`} />
          <FaqAccordionList faqs={page.faqs} />
        </Container>
      </section>

      {/* Cross-links */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/builders" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary">
              All builder services
            </Link>
            {page.areaHref && (
              <Link href={page.areaHref} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary">
                {page.city} service area
              </Link>
            )}
            {page.related.map((r) => (
              <Link key={r.href} href={r.href} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary">
                {r.label}
              </Link>
            ))}
            {NEW_CONSTRUCTION_CITIES.filter((c) => c.slug !== page.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/new-construction-plumbing/${c.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary"
              >
                <MapPin className="h-3.5 w-3.5" /> {c.city}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
