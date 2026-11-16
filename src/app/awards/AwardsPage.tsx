import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { ExternalLink, Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import Credentials from "@/components/about/Credentials";
import { AWARDS, LATEST_AWARD } from "@/lib/awards";
import { image } from "@/lib/media";
import type { MediaRef } from "@/lib/media-types";
import { cn } from "@/lib/utils";
import { AWARDS_PAGE } from "@/content/about";
import { AWARDS_FAQS } from "./awards-faqs";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-09-09" or "2025-09" → "September 2026". Read off the string so a
 *  UTC parse can't shift a first-of-month date into the previous month. */
function monthYear(iso: string) {
  const [y, m] = iso.split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${y}` : y;
}

const HOW_IT_WORKS = AWARDS_PAGE.how.steps;

/**
 * A badge in a frame: the badge artwork is a transparent PNG, so it sits on a
 * white panel (its own colours, never cropped) instead of filling the box.
 */
function BadgeFrame({
  media,
  alt,
  sizes,
  preload = false,
  className,
}: {
  media: MediaRef | null;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (!media) return null;
  return (
    <div className={cn("rounded-2xl bg-white p-[8%]", className)}>
      <Image
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        preload={preload || undefined}
        className="h-auto w-full"
      />
    </div>
  );
}

const textLink = "font-semibold text-link underline underline-offset-4 decoration-1 hover:decoration-2";

export default function AwardsPage() {
  const latestBadge = image(LATEST_AWARD.badge);

  return (
    <>
      <PageHero
        layout="plain"
        overline={AWARDS_PAGE.overline}
        title={AWARDS_PAGE.title}
        accent={AWARDS_PAGE.accent}
        description={
          <p>
            {LATEST_AWARD.issuer} readers voted C&amp;S Plumbing of Lee{" "}
            <strong className="font-semibold text-fg">{LATEST_AWARD.category}</strong> in the{" "}
            {LATEST_AWARD.year} Best of Cape Coral awards — our second year on the
            winners list. Here&rsquo;s every award, and how each one is decided.
          </p>
        }
        actions={
          <Button href={BUSINESS.phoneHref} variant="primary" size="lg" icon={<Phone className="size-5" />}>
            {AWARDS_PAGE.callLabel} {BUSINESS.phone}
          </Button>
        }
        media={
          <BadgeFrame
            media={latestBadge}
            alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
            sizes="(min-width: 1024px) 352px, 176px"
            preload
            className="w-44 lg:mr-0 lg:ml-auto lg:w-full lg:max-w-[22rem]"
          />
        }
      />

      {/* Awards: a card each (badge beside the words), side by side on desktop */}
      <Section tone="shell" spacing="sm" labelledBy="awards-list-title">
        <Container>
          <SectionHeading
            id="awards-list-title"
            align="left"
            overline={AWARDS_PAGE.list.overline}
            title={AWARDS_PAGE.list.title}
            accent={AWARDS_PAGE.list.accent}
            subtitle={`Two years on the ${LATEST_AWARD.issuer}'s winners list, in two categories.`}
            className="mb-8 sm:mb-10"
          />
          <ol className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            {AWARDS.map((a) => (
              <li
                key={a.slug}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-5 gap-y-4 rounded-2xl border border-steel-200 bg-white p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 sm:p-6"
              >
                <BadgeFrame
                  media={image(a.badge)}
                  alt={`${a.title} — ${a.category}`}
                  sizes="(min-width: 640px) 144px, 104px"
                  className="self-start p-0"
                />
                <div className="self-center">
                  <p className="meta text-accent tabular-nums">{a.year}</p>
                  <h3 className="mt-1 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{a.category}</h3>
                  <p className="mt-1 text-body">{a.title}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:col-start-2">
                  <p className="text-body">{a.summary}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-1 border-t border-rule pt-4">
                    <div>
                      <dt className="text-[0.9375rem] font-medium text-body">{AWARDS_PAGE.list.awardedLabel}</dt>
                      <dd className="mt-1 font-semibold text-fg">{monthYear(a.awardedOn)}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.9375rem] font-medium text-body">{AWARDS_PAGE.list.votedByLabel}</dt>
                      <dd className="font-semibold text-fg">
                        <a
                          href={a.citationUrl ?? a.issuerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 text-link underline decoration-1 underline-offset-4 hover:decoration-2"
                        >
                          {a.issuer} {AWARDS_PAGE.list.readersSuffix}
                          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* How it works: the three real steps of the vote, and the paragraph an answer engine quotes */}
      <Section tone="white" spacing="sm" labelledBy="awards-how-title">
        <Container>
          <SectionHeading
            id="awards-how-title"
            align="left"
            overline={AWARDS_PAGE.how.overline}
            title={AWARDS_PAGE.how.title}
            accent={AWARDS_PAGE.how.accent}
            subtitle={AWARDS_PAGE.how.subtitle}
            className="mb-8 sm:mb-10"
          />
          <ol className="grid grid-cols-1 gap-x-8 border-b border-rule md:grid-cols-3 md:border-b-0">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="border-t border-rule py-5 md:pb-0">
                <h3 className="text-lg leading-snug font-semibold text-fg">
                  <span className="text-primary-dark tabular-nums">{i + 1}.</span> {step.title}
                </h3>
                <p className="mt-1.5 max-w-[44ch] text-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[68ch] text-body lg:mt-10">
            A vote is a lagging indicator — it reflects work that was already done. Read it
            alongside the things you can check yourself: our{" "}
            <Link href="/reviews" className={textLink}>
              Google reviews
            </Link>
            , our{" "}
            <Link href="/projects" className={textLink}>
              completed projects
            </Link>
            , and both licenses on the DBPR.
          </p>
        </Container>
      </Section>

      {/* Licenses, insurance, builders — the verifiable half of "trust" */}
      <Credentials tone="shell" />

      {/* FAQ: closed accordion; every answer stays in the HTML */}
      <Section tone="white" spacing="sm" labelledBy="awards-faq-title">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-3">{AWARDS_PAGE.faq.overline}</Eyebrow>
              <h2 id="awards-faq-title" className="text-display-md text-fg">
                {AWARDS_PAGE.faq.title} {AWARDS_PAGE.faq.accent}
              </h2>
            </div>
            <FaqAccordion faqs={AWARDS_FAQS} className="mt-6 lg:col-span-8 lg:mt-0" />
          </div>
        </Container>
      </Section>
    </>
  );
}
