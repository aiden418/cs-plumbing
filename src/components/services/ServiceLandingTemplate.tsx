import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Section, { type Tone } from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { ArrowRight, Check, Phone } from "@/components/ui/icons";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import JobGallery from "@/components/services/JobGallery";
import { SERVICE_LANDINGS, AREA_LANDINGS } from "@/lib/constants";
import { BUSINESS } from "@/lib/business";
import { INDEXED_LANDINGS } from "@/lib/landing-indexing";
import { image, picture } from "@/lib/media";
import type { MediaRef } from "@/lib/media-types";
import { SERVICE_PAGE as COPY, SERVICE_PHOTO_FALLBACK } from "@/content/services";
import type { CostRow, PriceSummary as PriceSummaryData, ServiceLanding } from "@/lib/types";

/* --------------------------------------------------------------------------
   Shared parts of the service pages (also used by ServiceDetail and the
   hand-built pages: commercial, residential, new construction, UEP).
   Version 2 ("Bright and clear"): white and shell sections, plain rows with
   a 1 px line between them, body-size text, no numbering or joints.
   -------------------------------------------------------------------------- */

export type Crumb = { name: string; href: string };

/**
 * The header photograph of a service page: its named position
 * (service.header.<slug>), else a real job photo from its own gallery
 * (SERVICE_PHOTO_FALLBACK). Null: the plain white hero.
 */
export function servicePhoto(slug: string, position: "service.header" | "home.service" = "service.header"): MediaRef | null {
  const named = picture(`${position}.${slug}`);
  if (named) return named;
  const fallback = SERVICE_PHOTO_FALLBACK[slug];
  return fallback ? image(fallback.src, fallback.position ? { position: fallback.position } : {}) : null;
}

/**
 * A long hero lead is cut after its first sentence or two (about three lines
 * on desktop); the rest, word for word, opens the first section below.
 */
export function splitLead(text: string, max = 180): { lead: string; rest: string } {
  if (text.length <= max) return { lead: text, rest: "" };
  const sentences = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?(?:\s+|$)|[^.!?]+$/g) ?? [text];
  let lead = sentences[0];
  let i = 1;
  while (i < sentences.length && (lead + sentences[i]).trim().length <= max) {
    lead += sentences[i];
    i += 1;
  }
  return { lead: lead.trim(), rest: sentences.slice(i).join("").trim() };
}

/**
 * The two hero actions: the call first (the primary action), then booking or
 * the form. `lead="second"` swaps them for a page whose main ask is the
 * request form: that button is the blue one, with the call right beside it.
 */
export function HeroActions({
  second,
  lead = "call",
}: {
  second: { label: string; href: string };
  lead?: "call" | "second";
}) {
  const callFirst = lead === "call";
  const call = (
    <Button
      href={BUSINESS.phoneHref}
      variant={callFirst ? "primary" : "secondary"}
      size="lg"
      icon={<Phone className="size-5" />}
    >
      {COPY.call} {BUSINESS.phone}
    </Button>
  );
  const other = (
    <Button href={second.href} variant={callFirst ? "secondary" : "primary"} size="lg">
      {second.label}
    </Button>
  );
  return callFirst ? (
    <>
      {call}
      {other}
    </>
  ) : (
    <>
      {other}
      {call}
    </>
  );
}

/**
 * The inline request form in its panel: where a page's "#request-service"
 * button lands. From lg it stays in view beside the reading column
 * (services.css); `className` places it in the caller's grid.
 */
export function RequestPanel({
  title,
  intro,
  service,
  className,
}: {
  title: string;
  intro: string;
  /** The form's preselected "Service needed" option (SERVICE_REQUEST_OPTIONS). */
  service: string;
  className?: string;
}) {
  return (
    <aside id="request-service" aria-labelledby="request-service-title" className={cn("scroll-mt-28", className)}>
      <div className="service-request-panel rounded-2xl border border-steel-200 bg-white p-5 shadow-[0_8px_30px_-12px_rgb(10_23_48/0.18)] sm:p-7">
        <h2 id="request-service-title" className="text-display-sm text-fg">
          {title}
        </h2>
        <p className="mt-2 mb-5 text-[0.9375rem] text-body">{intro}</p>
        <ServiceRequestForm defaultService={service} source="service-page" compact />
      </div>
    </aside>
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
    <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-base text-body">{label}</span>
      <span className="text-xl font-semibold text-fg tabular-nums">{range}</span>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-link underline underline-offset-4 hover:decoration-2"
        >
          {link.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </p>
  );
}

/**
 * The header's price summary: one labelled range per kind of job, so a repair
 * is never read against a replacement. A job with no published price gets a
 * link to the request form instead of a figure. The last line jumps to the
 * pricing section, where each range is shown with what it includes.
 */
export function PriceSummary({
  summary,
  requestHref,
  detailsHref,
}: {
  summary: PriceSummaryData;
  /** Where "request pricing" goes: the page's request form. */
  requestHref: string;
  /** The pricing section further down the page. */
  detailsHref?: string;
}) {
  const row = "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-t border-rule py-2.5";
  const link = "font-semibold text-link underline underline-offset-4 hover:decoration-2";
  return (
    <div className="mt-6 max-w-[30rem]">
      <h2 id="price-summary-heading" className="text-base font-semibold text-fg">
        {COPY.priceSummary.title}
      </h2>
      <dl aria-labelledby="price-summary-heading" className="mt-2 border-b border-rule">
        {summary.rows.map((item) => (
          <div key={item.label} className={row}>
            <dt className="text-base text-body">{item.label}</dt>
            <dd className="text-right text-lg font-semibold whitespace-nowrap text-fg tabular-nums">{item.range}</dd>
          </div>
        ))}
        {summary.request && (
          <div className={row}>
            <dt className="text-base text-body">{summary.request.label}</dt>
            <dd className="text-right text-base">
              <Link href={requestHref} className={link}>
                {summary.request.action}
              </Link>
            </dd>
          </div>
        )}
      </dl>
      {detailsHref && (
        <Link href={detailsHref} className={cn("mt-1 inline-flex min-h-11 items-center gap-1.5 text-base", link)}>
          {COPY.priceSummary.details}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/** The pricing section's rows. Grouped rows ("Repairs", "Replacements") get a sub-heading per group. */
function CostRows({ rows, requestHref }: { rows: CostRow[]; requestHref: string }) {
  const groups: { title?: string; rows: CostRow[] }[] = [];
  for (const item of rows) {
    const last = groups[groups.length - 1];
    if (last && last.title === item.group) last.rows.push(item);
    else groups.push({ title: item.group, rows: [item] });
  }
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title ?? "all"}>
          {group.title && <h3 className="mb-3 text-lg leading-snug font-semibold text-fg sm:text-xl">{group.title}</h3>}
          <dl className="border-b border-rule">
            {group.rows.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 border-t border-rule py-4"
              >
                {item.request ? (
                  // No figure to line up on the right: the label keeps the full width, the link sits under it.
                  <>
                    <dt className="col-span-2 font-semibold text-fg">{item.label}</dt>
                    <dd className="col-span-2">
                      <Link
                        href={requestHref}
                        className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline underline-offset-4 hover:decoration-2"
                      >
                        {item.request}
                        <ArrowRight className="size-4" />
                      </Link>
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className="font-semibold text-fg">{item.label}</dt>
                    <dd className="text-right font-semibold whitespace-nowrap text-fg tabular-nums sm:text-lg">{item.range}</dd>
                  </>
                )}
                {item.note && <dd className="col-span-2 text-[0.9375rem] text-body">{item.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/**
 * A chapter's header and body. "wide": the header in the left third from lg
 * and the body beside it; otherwise (stacked, or inside the column next to
 * the request form, and on phones) the header sits above the body.
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
  /** Header above a full-width body even when wide. */
  stacked?: boolean;
  children: ReactNode;
}) {
  const wide = wideProp && !stacked;
  return (
    <div className={cn("grid grid-cols-1 gap-y-6 sm:gap-y-8", wide && "lg:grid-cols-12 lg:gap-x-10")}>
      <div className={cn(wide ? "lg:col-span-4" : "max-w-3xl")}>
        {overline && <Eyebrow className="mb-3">{overline}</Eyebrow>}
        <h2 id={id} className="text-display-md text-fg">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-[48ch] text-body">{description}</p>}
      </div>
      <div className={cn("min-w-0", wide && "lg:col-span-8")}>{children}</div>
    </div>
  );
}

/** What we offer: plain rows (title and a line or two), two columns from md where there is room. */
export function OfferList({
  items,
  columns = 1,
}: {
  items: { title: string; description: string; features?: readonly string[] }[];
  /** 2: two columns of rows from md (full-width chapters). */
  columns?: 1 | 2;
}) {
  return (
    <ul className={cn("grid grid-cols-1 border-b border-rule", columns === 2 && "md:grid-cols-2 md:gap-x-10")}>
      {items.map((item) => (
        <li key={item.title} className={cn("border-t border-rule py-5 sm:py-6", columns === 2 && "md:-mb-px md:border-b")}>
          <h3 className="text-lg leading-snug font-semibold text-fg sm:text-xl">{item.title}</h3>
          <p className="mt-1.5 max-w-[62ch] text-body">{item.description}</p>
          {item.features && item.features.length > 0 && (
            <ul className="service-checks mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              {item.features.map((feature) => (
                <li key={feature}>
                  <Check className="size-4 text-accent" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** "Why choose": one short line each with a check, in two columns from sm (three from lg when wide). */
export function PointList({ items, columns = 2 }: { items: readonly string[]; columns?: 2 | 3 }) {
  return (
    <ul className={cn("service-points grid grid-cols-1 gap-x-8 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
      {items.map((item) => (
        <li key={item}>
          <Check className="size-5 text-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Adjacent sections alternate white and shell; a forced tone equal to its neighbour gets a hairline. */
export function toneSequence(
  wants: readonly (Tone | "auto")[],
  previous: Tone = "shell",
): { tone: Tone; divider: boolean }[] {
  let last = previous;
  return wants.map((want) => {
    const tone: Tone = want === "auto" ? (last === "white" ? "shell" : "white") : want;
    const divider = tone === last && (tone === "white" || tone === "shell");
    last = tone;
    return { tone, divider };
  });
}

/** Related links as compact pills that wrap (no tall rows). */
function LinkPills({ title, links }: { title: ReactNode; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-lg leading-snug font-semibold text-fg">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full border border-steel-300 bg-white px-4 py-2 text-[0.9375rem] leading-snug font-medium text-navy transition-colors duration-150 hover:border-primary hover:text-primary-dark"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
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
  const frame = servicePhoto(landing.slug);
  const { lead, rest } = splitLead(landing.description);
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

  /** The rest of the hero's lead, word for word, at the top of the first section. */
  const restOfLead = rest ? <p className="mb-10 max-w-[60ch] text-lead text-body sm:mb-12">{rest}</p> : null;

  const answers = hasAnswers && (
    <FaqAccordion
      name="quick-answers"
      faqs={landing.answerBlocks!.map((block) => ({
        question: block.question,
        answer: block.detail ? `${block.answer} ${block.detail}` : block.answer,
      }))}
    />
  );

  const costRows = hasCost && (
    <>
      <CostRows rows={landing.costBreakdown!} requestHref={bookHref} />
      <div className="mt-7">
        <Button href={bookHref} variant="primary" size="lg">
          {COPY.cost.cta}
        </Button>
      </div>
    </>
  );

  const offer = (wide: boolean) => (
    <Chapter id="offer-heading" title={COPY.offer} wide={wide} stacked={wide}>
      <OfferList items={landing.features} columns={wide ? 2 : 1} />
    </Chapter>
  );

  const why = (wide: boolean) =>
    landing.highlights.length > 0 && (
      <Chapter id="why-heading" title={`${COPY.whyBefore}${landing.title}`} wide={wide} stacked={wide}>
        <PointList items={landing.highlights} columns={wide ? 3 : 2} />
      </Chapter>
    );

  const cost = (wide: boolean) =>
    hasCost && (
      <Chapter id="cost-heading" title={COPY.cost.title} description={COPY.cost.description} wide={wide}>
        {costRows}
      </Chapter>
    );

  const cases = hasCases && (
    <div>
      <h2 id="cases-heading" className="text-display-sm text-fg">
        {COPY.casesBefore}
        {landing.title}
        {COPY.casesAfter}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {landing.caseStudies!.map((cs) => (
          <li key={cs.title}>
            <article className="h-full rounded-2xl border border-steel-200 bg-white p-5 sm:p-6">
              <p className="text-xl font-semibold text-fg tabular-nums">{cs.cost}</p>
              <h3 className="mt-2 text-lg leading-snug font-semibold text-fg">{cs.title}</h3>
              <p className="mt-1 text-[0.9375rem] font-semibold text-accent">{cs.location}</p>
              <p className="mt-3 text-body">{cs.summary}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );

  const links = hasLinks && (
    <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
      {relatedServices.length > 0 && (
        <LinkPills
          title={COPY.related.services}
          links={relatedServices.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))}
        />
      )}
      {relatedAreas.length > 0 && (
        <LinkPills
          title={
            <>
              {landing.title}
              {COPY.related.areasAfter}
            </>
          }
          links={relatedAreas.map((a) => ({ href: `/areas/${a.slug}`, label: `${a.city}, ${a.state}` }))}
        />
      )}
      {cityPages.length > 0 && (
        <LinkPills title={COPY.related.cityPages} links={cityPages.map((p) => ({ href: `/${p.slug}`, label: p.h1 }))} />
      )}
    </div>
  );

  const formTitle = `${COPY.requestForm.titleBefore}${
    landing.slug === "repiping" ? COPY.requestForm.titleRepipe : COPY.requestForm.titleWaterHeater
  }`;

  /* Sections after the hero, each white or shell, alternating. */
  type Block = { key: string; labelledBy?: string; node: ReactNode };
  const blocks: Block[] = [];

  if (requestService) {
    // One white section: the form beside the reading column (sticky from lg),
    // right under the intro on phones.
    blocks.push({
      key: "opening",
      node: (
        <>
          {restOfLead}
          <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-10">
            <RequestPanel
              title={formTitle}
              intro={COPY.requestForm.intro}
              service={requestService}
              className="lg:col-span-5 lg:col-start-8 lg:row-start-1 xl:col-span-4 xl:col-start-9"
            />
            <div className="min-w-0 space-y-14 sm:space-y-16 lg:col-span-7 lg:row-start-1 xl:col-span-8 xl:pr-6">
              {hasAnswers && (
                <Chapter id="quick-answers-heading" overline={COPY.answers.overline} title={COPY.answers.title} wide={false}>
                  {answers}
                </Chapter>
              )}
              {offer(false)}
              {why(false)}
              {cost(false)}
            </div>
          </div>
        </>
      ),
    });
  } else {
    blocks.push({
      key: "answers",
      labelledBy: hasAnswers ? "quick-answers-heading" : "offer-heading",
      node: (
        <>
          {restOfLead}
          {hasAnswers ? (
            <Chapter id="quick-answers-heading" overline={COPY.answers.overline} title={COPY.answers.title}>
              {answers}
            </Chapter>
          ) : (
            offer(true)
          )}
        </>
      ),
    });
    if (hasAnswers) blocks.push({ key: "offer", labelledBy: "offer-heading", node: offer(true) });
    if (landing.highlights.length > 0) blocks.push({ key: "why", labelledBy: "why-heading", node: why(true) });
    if (hasCost) blocks.push({ key: "cost", labelledBy: "cost-heading", node: cost(true) });
  }
  if (hasCases) blocks.push({ key: "cases", labelledBy: "cases-heading", node: cases });

  const tones = toneSequence([...blocks.map(() => "auto" as const), "auto", "auto", ...(hasLinks ? ["auto" as const] : [])]);
  const galleryTone = tones[blocks.length].tone;
  const faqTone = tones[blocks.length + 1].tone;
  const linksTone = hasLinks ? tones[blocks.length + 2].tone : "white";

  return (
    <>
      <PageHero
        layout="photo"
        frame={frame}
        breadcrumb={trail}
        overline={landing.title}
        title={landing.heroText}
        description={lead}
        actions={<HeroActions second={{ label: requestService ? COPY.request : COPY.book, href: bookHref }} />}
      >
        {landing.priceSummary ? (
          <PriceSummary
            summary={landing.priceSummary}
            requestHref={bookHref}
            detailsHref={hasCost ? "#cost-heading" : undefined}
          />
        ) : (
          landing.priceRange && (
            <PriceLine label={COPY.typicalRange} range={landing.priceRange} link={{ label: COPY.getQuote, href: bookHref }} />
          )
        )}
      </PageHero>

      {blocks.map((block, i) => (
        <Section key={block.key} tone={tones[i].tone} spacing="sm" labelledBy={block.labelledBy}>
          <Container>{block.node}</Container>
        </Section>
      ))}

      <JobGallery id={`jobs-${landing.slug}`} photos={landing.gallery} serviceTitle={landing.title} tone={galleryTone} />

      <Section tone={faqTone} spacing="sm" labelledBy="faq-heading">
        <Container>
          <Chapter id="faq-heading" title={COPY.faq}>
            <FaqAccordion faqs={landing.faqs} />
          </Chapter>
        </Container>
      </Section>

      {hasLinks && (
        <Section tone={linksTone} spacing="sm">
          <Container>{links}</Container>
        </Section>
      )}
    </>
  );
}
