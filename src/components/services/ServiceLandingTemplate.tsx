import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Section, { type Tone } from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, Phone } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import JobGallery from "@/components/services/JobGallery";
import { SERVICE_LANDINGS, AREA_LANDINGS } from "@/lib/constants";
import { BUSINESS } from "@/lib/business";
import { INDEXED_LANDINGS } from "@/lib/landing-indexing";
import { picture } from "@/lib/media";
import { SERVICE_PAGE as COPY } from "@/content/services";
import type { ServiceLanding } from "@/lib/types";

/* --------------------------------------------------------------------------
   Shared parts of the service pages (also used by ServiceDetail and the
   hand-built pages: commercial, residential, new construction, UEP).
   -------------------------------------------------------------------------- */

export type Crumb = { name: string; href: string };

/** The two hero actions: the call first (the primary action), then booking or the form. */
export function HeroActions({ second }: { second: { label: string; href: string } }) {
  return (
    <>
      <Button href={BUSINESS.phoneHref} variant="primary" size="lg" icon={<Phone className="size-5" />}>
        {COPY.call} {BUSINESS.phone}
      </Button>
      <Button href={second.href} variant="secondary" size="lg">
        {second.label}
      </Button>
    </>
  );
}

/** The hero's price line: label, the range from the pricing data, and a link. */
export function PriceLine({
  label,
  range,
  link,
}: {
  label: string;
  range: ReactNode;
  link?: { label: string; href: string };
}) {
  return (
    <p className="mt-8 flex max-w-[34rem] flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-rule pt-5">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-lg font-semibold text-fg tabular-nums sm:text-xl">{range}</span>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-link underline-offset-4 hover:underline"
        >
          {link.label}
          <ArrowRight className="size-4 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </Link>
      )}
    </p>
  );
}

/**
 * A chapter's header and body. "wide": the header in the left third of the
 * 12-column grid and the body beside it (≥ 1024); otherwise stacked (inside
 * the column next to the request form, and on phones).
 */
export function Chapter({
  id,
  overline,
  title,
  description,
  wide: wideProp = true,
  stacked = false,
  children,
}: {
  id: string;
  overline?: string;
  title: string;
  description?: ReactNode;
  wide?: boolean;
  /** Header above a full-width body even when wide (varies the rhythm of a long page). */
  stacked?: boolean;
  children: ReactNode;
}) {
  const wide = wideProp && !stacked;
  return (
    <div className={cn("grid grid-cols-1 gap-y-8", wide && "lg:grid-cols-12 lg:gap-x-8", stacked && "gap-y-10")}>
      <Reveal className={cn(wide && "lg:col-span-4", stacked && "max-w-3xl")}>
        {overline && <Eyebrow className="mb-4">{overline}</Eyebrow>}
        <h2 id={id} className="text-display-md text-fg">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-[48ch] text-body">{description}</p>}
      </Reveal>
      <div className={cn("min-w-0", wide && "lg:col-span-7 lg:col-start-6")}>{children}</div>
    </div>
  );
}

/** Feature rows: number, title, one or two lines; an optional list under each. */
export function OfferList({
  items,
  columns = 1,
}: {
  items: { title: string; description: string; features?: readonly string[] }[];
  /** 2: two columns of rows from md (full-width chapters). */
  columns?: 1 | 2;
}) {
  return (
    <ol className={cn(columns === 2 ? "grid grid-cols-1 gap-x-8 md:grid-cols-2" : "border-b border-rule")}>
      {items.map((item, i) => (
        <Reveal
          as="li"
          key={item.title}
          index={items.length <= 6 ? i : undefined}
          className={cn(
            "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-t border-rule py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:py-7",
            columns === 2 && "-mb-px border-b",
          )}
        >
          <span className="label-tech pt-1.5 text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="text-lg leading-snug font-semibold text-fg sm:text-xl">{item.title}</h3>
            <p className="mt-2 max-w-[62ch] text-body">{item.description}</p>
            {item.features && item.features.length > 0 && (
              <ul className={cn("service-tile-features mt-4 grid max-w-[44rem] gap-x-8 text-sm text-body", columns === 1 && "sm:grid-cols-2")}>
                {item.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/** "Why choose": short lines, each led by a joint, in two columns from sm. */
export function PointList({ items, columns = 2 }: { items: readonly string[]; columns?: 2 | 3 }) {
  return (
    <Reveal
      as="ul"
      className={cn("service-points grid border-b border-rule sm:grid-cols-2 sm:gap-x-8", columns === 3 && "lg:grid-cols-3")}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Reveal>
  );
}

/** Adjacent sections alternate white and shell; a forced tone equal to its neighbour gets a hairline. */
export function toneSequence(
  wants: readonly (Tone | "auto")[],
  previous: Tone = "ink",
): { tone: Tone; divider: boolean }[] {
  let last = previous;
  return wants.map((want) => {
    const tone: Tone = want === "auto" ? (last === "white" ? "shell" : "white") : want;
    const divider = tone === last && (tone === "white" || tone === "shell");
    last = tone;
    return { tone, divider };
  });
}

/* --------------------------------------------------------------------------
   The data-driven service page (SERVICE_LANDINGS)
   -------------------------------------------------------------------------- */

export default function ServiceLandingTemplate({
  landing,
  breadcrumb,
}: {
  landing: ServiceLanding;
  /** The visible trail (the JSON-LD stays in the page). Default: Home / Services / title. */
  breadcrumb?: Crumb[];
}) {
  // Slugs that map to a ServiceRequestForm option get the inline form;
  // anything else falls back to /booking.
  const requestService =
    landing.slug === "water-heaters" || landing.slug === "tankless-water-heaters"
      ? "water-heater"
      : landing.slug === "repiping"
        ? "repipe"
        : "";
  const bookHref = requestService ? "#request-service" : `/booking?service=${encodeURIComponent(landing.slug)}`;
  const frame = picture(`service.header.${landing.slug}`);
  const trail = breadcrumb ?? [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: landing.title, href: `/services/${landing.slug}` },
  ];

  const cityPages = INDEXED_LANDINGS.filter((p) => p.serviceSlug === landing.slug);
  const relatedServices = (landing.relatedServices ?? [])
    .map((slug) => SERVICE_LANDINGS.find((s) => s.slug === slug))
    .filter((s): s is ServiceLanding => Boolean(s));
  const relatedAreas = (landing.relatedAreas ?? [])
    .map((slug) => AREA_LANDINGS.find((a) => a.slug === slug))
    .filter((a): a is (typeof AREA_LANDINGS)[number] => Boolean(a));

  const hasAnswers = Boolean(landing.answerBlocks && landing.answerBlocks.length > 0);
  const hasCost = Boolean(landing.costBreakdown && landing.costBreakdown.length > 0);
  const hasCases = Boolean(landing.caseStudies && landing.caseStudies.length > 0);
  const hasLinks = relatedServices.length > 0 || relatedAreas.length > 0 || cityPages.length > 0;

  /* The opening chapters. On the form pages they share one white section
     with the request form beside them; elsewhere each is its own section. */
  const opening = (wide: boolean) =>
    [
      hasAnswers && {
        key: "answers",
        node: (
          <Chapter id="quick-answers-heading" overline={COPY.answers.overline} title={COPY.answers.title} wide={wide}>
            <div className="border-b border-rule">
              {landing.answerBlocks!.map((block, i) => (
                <Reveal key={block.question} index={i} className="border-t border-rule py-6">
                  <h3 className="text-lg leading-snug font-semibold text-fg sm:text-xl">{block.question}</h3>
                  <p className="mt-2 max-w-[62ch] text-body">
                    <span className="font-semibold text-fg">{block.answer}</span>
                    {block.detail ? <span> {block.detail}</span> : null}
                  </p>
                </Reveal>
              ))}
            </div>
          </Chapter>
        ),
      },
      {
        key: "offer",
        node: (
          <Chapter id="offer-heading" title={COPY.offer} wide={wide} stacked={wide}>
            <OfferList items={landing.features} columns={wide ? 2 : 1} />
          </Chapter>
        ),
      },
      landing.highlights.length > 0 && {
        key: "why",
        node: (
          <Chapter id="why-heading" title={`${COPY.whyBefore}${landing.title}`} wide={wide} stacked={wide}>
            <PointList items={landing.highlights} columns={wide ? 3 : 2} />
          </Chapter>
        ),
      },
      hasCost && {
        key: "cost",
        node: (
          <Chapter id="cost-heading" title={COPY.cost.title} description={COPY.cost.description} wide={wide}>
            <Reveal>
              <dl className="border-b border-rule">
                {landing.costBreakdown!.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-rule py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:py-5"
                  >
                    <dt>
                      <span className="block font-semibold text-fg">{item.label}</span>
                      {item.note && <span className="mt-0.5 block text-sm text-muted">{item.note}</span>}
                    </dt>
                    <dd className="font-semibold whitespace-nowrap text-fg tabular-nums sm:text-right sm:text-lg">
                      {item.range}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <Button href={bookHref} variant="primary" size="lg">
                  {COPY.cost.cta}
                </Button>
              </div>
            </Reveal>
          </Chapter>
        ),
      },
    ].filter((c): c is { key: string; node: React.JSX.Element } => Boolean(c));

  const later: { key: string; want: Tone | "auto"; node: (tone: Tone) => ReactNode }[] = [];
  if (hasCases) {
    later.push({
      key: "cases",
      want: "auto",
      node: () => (
        <Container>
          <Reveal className="mb-10 max-w-3xl sm:mb-12">
            <h2 id="cases-heading" className="text-display-md text-fg">
              {COPY.casesBefore}
              {landing.title}
              {COPY.casesAfter}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {landing.caseStudies!.map((cs, i) => (
              <Reveal as="article" key={cs.title} index={i} className="border-t border-rule pt-6">
                <p className="text-lg font-semibold text-fg tabular-nums">{cs.cost}</p>
                <h3 className="mt-3 text-lg leading-snug font-semibold text-fg">{cs.title}</h3>
                <p className="label-tech mt-2 text-accent">{cs.location}</p>
                <p className="mt-4 text-body">{cs.summary}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      ),
    });
  }
  later.push({
    key: "gallery",
    want: "ink",
    node: () => <JobGallery id={`jobs-${landing.slug}`} photos={landing.gallery} serviceTitle={landing.title} />,
  });
  later.push({
    key: "faq",
    want: "shell",
    node: () => (
      <Container>
        <Chapter id="faq-heading" title={COPY.faq}>
          <FaqAccordion faqs={landing.faqs} />
        </Chapter>
      </Container>
    ),
  });
  if (hasLinks) {
    later.push({
      key: "links",
      want: "white",
      node: () => (
        <Container>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {relatedServices.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg leading-snug font-semibold text-fg">
                  {COPY.related.services}
                </h3>
                <LinkGrid
                  columns={2}
                  className="sm:grid-cols-1"
                  links={relatedServices.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))}
                />
              </div>
            )}
            {relatedAreas.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg leading-snug font-semibold text-fg">
                  {landing.title}
                  {COPY.related.areasAfter}
                </h3>
                <LinkGrid
                  columns={2}
                  className="sm:grid-cols-1"
                  links={relatedAreas.map((a) => ({ href: `/areas/${a.slug}`, label: `${a.city}, ${a.state}` }))}
                />
              </div>
            )}
            {cityPages.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg leading-snug font-semibold text-fg">
                  {COPY.related.cityPages}
                </h3>
                <LinkGrid
                  columns={2}
                  className="sm:grid-cols-1"
                  links={cityPages.map((p) => ({ href: `/${p.slug}`, label: p.h1 }))}
                />
              </div>
            )}
          </div>
        </Container>
      ),
    });
  }

  const formTitle = `${COPY.requestForm.titleBefore}${
    landing.slug === "repiping" ? COPY.requestForm.titleRepipe : COPY.requestForm.titleWaterHeater
  }`;

  const openingChapters = opening(!requestService);
  const openingTones = toneSequence(requestService ? ["white"] : openingChapters.map(() => "auto"));
  const laterTones = toneSequence(
    later.map((s) => s.want),
    openingTones[openingTones.length - 1]?.tone ?? "ink",
  );

  return (
    <>
      <PageHero
        layout={frame ? "split" : "type-led"}
        frame={frame}
        breadcrumb={trail}
        overline={landing.title}
        title={landing.heroText}
        description={landing.description}
        actions={
          <HeroActions second={{ label: requestService ? COPY.request : COPY.book, href: bookHref }} />
        }
      >
        {landing.priceRange && (
          <PriceLine
            label={COPY.typicalRange}
            range={landing.priceRange}
            link={{ label: COPY.getQuote, href: bookHref }}
          />
        )}
      </PageHero>

      {requestService ? (
        <Section tone="white">
          <Container>
            <div className="grid grid-cols-1 gap-y-section-sm lg:grid-cols-12 lg:gap-x-8">
              {/* First in the document: right under the intro on phones, beside the column from lg. */}
              <aside
                id="request-service"
                aria-labelledby="request-service-title"
                className="scroll-mt-28 lg:col-span-5 lg:col-start-8 lg:row-start-1 xl:col-span-4 xl:col-start-9"
              >
                <div
                  data-tone="shell"
                  className="service-request-panel rounded-frame border border-rule bg-canvas p-5 text-body sm:p-8"
                >
                  <h2 id="request-service-title" className="text-display-sm text-fg">
                    {formTitle}
                  </h2>
                  <p className="mt-3 mb-6 text-sm text-muted">{COPY.requestForm.intro}</p>
                  <ServiceRequestForm defaultService={requestService} source="service-page" compact />
                </div>
              </aside>
              <div className="min-w-0 lg:col-span-6 lg:row-start-1 xl:col-span-7">
                {openingChapters.map((chapter, i) => (
                  <div
                    key={chapter.key}
                    className={i > 0 ? "mt-section" : undefined}
                  >
                    {chapter.node}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ) : (
        openingChapters.map((chapter, i) => (
          <Section key={chapter.key} tone={openingTones[i].tone} divider={openingTones[i].divider}>
            <Container>{chapter.node}</Container>
          </Section>
        ))
      )}

      {later.map((section, i) => {
        const { tone, divider } = laterTones[i];
        // The gallery draws its own ink section.
        if (section.key === "gallery") return <Fragment key={section.key}>{section.node(tone)}</Fragment>;
        return (
          <Section key={section.key} tone={tone} divider={divider} spacing={section.key === "links" ? "sm" : "default"}>
            {section.node(tone)}
          </Section>
        );
      })}
    </>
  );
}
