import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Eyebrow from "@/components/ui/Eyebrow";
import Button, { buttonClasses } from "@/components/ui/Button";
import { ArrowRight, Download, Phone } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import FaqAccordionList from "@/components/builders/FaqList";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import { BidSplit, ConstructionPhases, SchedulingPanel } from "@/components/builders/BuilderSections";
import RelatedProjects from "@/components/projects/RelatedProjects";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { NC_CITY as COPY } from "@/content/builders";
import {
  BUILDER_DESK,
  BUILDER_PROOF,
  CAPABILITY_STATEMENT_PDF,
  CONSTRUCTION_PHASES,
  NEW_CONSTRUCTION_CITIES,
  getNewConstructionCity,
} from "@/lib/builder-program";
import { picture } from "@/lib/media";
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
  // A real C&S photograph from this city when the media map has one; otherwise the builders hub's job-site photo.
  const hero = picture(`area.header.${page.slug}`) ?? picture("builders.hero");
  // The hero keeps the proof line and the intro's first sentence; the rest of
  // the intro opens the first section, word for word.
  const introSplit = page.intro.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  const introFirst = introSplit ? introSplit[1] : page.intro;
  const introRest = introSplit ? introSplit[2] : null;

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FaqJsonLd faqs={page.faqs} />
      <BreadcrumbJsonLd items={breadcrumb} />

      <PageHero
        layout={hero ? "photo" : "plain"}
        frame={hero}
        overline={COPY.overline(page.city)}
        title={COPY.title}
        accent={COPY.accent(page.city)}
        breadcrumb={breadcrumb}
        description={`${BUILDER_PROOF.headline}. ${introFirst}`}
        actions={
          <>
            <Button href="#bid" size="lg" iconRight={<ArrowRight className="size-5" />}>
              {COPY.bidAction}
            </Button>
            <Button href={BUILDER_DESK.phoneHref} variant="onPhoto" size="lg" icon={<Phone className="size-5" />}>
              <span className="max-[359px]:sr-only">{COPY.call} </span>
              <span className="whitespace-nowrap">{BUILDER_DESK.phone}</span>
            </Button>
            {/* Plain <a>: a PDF isn't a route, so next/link would try a client navigation first. */}
            <a href={CAPABILITY_STATEMENT_PDF} download className={buttonClasses({ variant: "ghost", size: "md", className: "self-start sm:self-auto sm:px-2" })}>
              <Download className="size-5" aria-hidden="true" />
              <span>{COPY.capabilityAction}</span>
            </a>
          </>
        }
      />

      {/* Local conditions */}
      <Section tone="white" spacing="sm" labelledBy="nc-conditions-heading">
        <Container>
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="nc-conditions-heading"
                overline={COPY.conditionsOverline(page.city)}
                title={COPY.conditionsTitle(page.city)}
                align="left"
                className="mb-0"
              />
              {introRest && <p className="mt-5 max-w-[48ch] text-body">{introRest}</p>}
              <p className="mt-5 max-w-[44ch] font-medium text-fg">
                {COPY.permitsPrefix(page.city)} {page.permitAuthority}.
              </p>
            </div>
            <ul className="border-b border-rule lg:col-span-7">
              {page.localConditions.map((c) => (
                <li key={c.title} className="border-t border-rule py-6">
                  <h3 className="text-xl leading-snug font-semibold text-fg">{c.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-body">{c.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <ConstructionPhases tone="shell" spacing="sm" />

      <RelatedProjects
        projects={projects}
        overline={COPY.projectsOverline}
        heading={COPY.projectsHeading(page.city)}
        description={COPY.projectsDescription(page.city)}
      />

      <SchedulingPanel tone={projects.length > 0 ? "shell" : "white"} className="lg:py-14" />
      <NewConstructionBenefits tone="white" overline="What your buyers get" />

      <BidSplit
        source={`nc-city:${page.slug}`}
        heading={COPY.bidHeading(page.city)}
        tone="shell"
        spacing="sm"
        note={
          <p className="mt-5 text-body">
            {COPY.prequalQuestion}{" "}
            <Link
              href="/builders#prequal"
              className="inline-flex min-h-11 items-center font-semibold text-link underline-offset-[0.2em] hover:underline"
            >
              {COPY.prequalLink}
            </Link>
            .
          </p>
        }
      />

      {/* FAQ */}
      <Section tone="white" spacing="sm" labelledBy="nc-faq-heading" className="lg:py-14">
        <Container>
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <SectionHeading
              id="nc-faq-heading"
              overline={COPY.faqOverline}
              title={COPY.faqTitle(page.city)}
              align="left"
              className="mb-0 lg:col-span-4"
            />
            <FaqAccordionList faqs={page.faqs} className="lg:col-span-8" />
          </div>
        </Container>
      </Section>

      {/* Cross-links */}
      <Section tone="shell" spacing="sm" labelledBy="nc-links-heading">
        <Container>
          <Eyebrow as="div" className="mb-6" id="nc-links-heading">
            {COPY.linksOverline}
          </Eyebrow>
          <LinkGrid
            columns={3}
            className="grid-cols-2 gap-x-5"
            links={[
              { href: "/builders", label: COPY.allBuilderServices },
              ...(page.areaHref ? [{ href: page.areaHref, label: COPY.serviceArea(page.city) }] : []),
              ...page.related.map((r) => ({ href: r.href, label: r.label })),
              ...NEW_CONSTRUCTION_CITIES.filter((c) => c.slug !== page.slug).map((c) => ({
                href: `/new-construction-plumbing/${c.slug}`,
                label: c.city,
              })),
            ]}
          />
        </Container>
      </Section>
    </>
  );
}
