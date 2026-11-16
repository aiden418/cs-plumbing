import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ExternalLink } from "@/components/ui/icons";
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
    <div className={cn("rounded-frame bg-white p-[8%]", className)}>
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
        layout="split"
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
        media={
          <BadgeFrame
            media={latestBadge}
            alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
            sizes="(min-width: 1024px) 420px, 80vw"
            preload
            className="mx-auto w-full max-w-[26rem] lg:mr-0"
          />
        }
      />

      {/* Awards */}
      <Section tone="white" labelledBy="awards-list-title">
        <Container>
          <SectionHeading
            id="awards-list-title"
            align="left"
            overline={AWARDS_PAGE.list.overline}
            title={AWARDS_PAGE.list.title}
            accent={AWARDS_PAGE.list.accent}
            subtitle={`Two years on the ${LATEST_AWARD.issuer}'s winners list, in two categories.`}
          />
          <ol className="border-b border-rule">
            {AWARDS.map((a, i) => (
              <Reveal
                as="li"
                key={a.slug}
                index={i}
                className="grid grid-cols-1 gap-y-6 border-t border-rule py-10 sm:grid-cols-12 sm:gap-x-8"
              >
                <BadgeFrame
                  media={image(a.badge)}
                  alt={`${a.title} — ${a.category}`}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 60vw"
                  className="w-3/5 max-w-[17.5rem] self-start border border-rule sm:col-span-4 sm:w-full lg:col-span-3"
                />
                <div className="sm:col-span-8 lg:col-span-8 lg:col-start-5">
                  <p className="label-tech text-accent tabular-nums">{a.year}</p>
                  <h3 className="mt-2 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{a.category}</h3>
                  <p className="mt-1 text-muted">{a.title}</p>
                  <p className="mt-5 max-w-[60ch] text-body">{a.summary}</p>
                  <dl className="mt-6 grid max-w-[36rem] grid-cols-2 gap-x-6 border-t border-rule pt-5">
                    <div>
                      <dt className="label-tech text-muted">{AWARDS_PAGE.list.awardedLabel}</dt>
                      <dd className="mt-2 font-medium text-fg">{monthYear(a.awardedOn)}</dd>
                    </div>
                    <div>
                      <dt className="label-tech text-muted">{AWARDS_PAGE.list.votedByLabel}</dt>
                      <dd className="mt-1 font-medium text-fg">
                        <a
                          href={a.citationUrl ?? a.issuerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 text-link underline-offset-4 hover:underline"
                        >
                          {a.issuer} {AWARDS_PAGE.list.readersSuffix}
                          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* How it works — the paragraph an answer engine quotes */}
      <Section tone="shell" labelledBy="awards-how-title">
        <Container>
          <SectionHeading
            id="awards-how-title"
            align="left"
            overline={AWARDS_PAGE.how.overline}
            title={AWARDS_PAGE.how.title}
            accent={AWARDS_PAGE.how.accent}
            subtitle={AWARDS_PAGE.how.subtitle}
          />
          <ol className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal as="li" key={step.title} index={i} className="border-t border-rule pt-5 pb-8 md:pb-0">
                <p className="label-tech text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-lg leading-snug font-semibold text-fg">{step.title}</h3>
                <p className="mt-2 max-w-[44ch] text-body">{step.body}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-12 max-w-[68ch] text-body lg:mt-16">
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
          </Reveal>
        </Container>
      </Section>

      {/* Licenses, insurance, builders — the verifiable half of "trust" */}
      <Credentials tone="white" />

      {/* FAQ */}
      <Section tone="shell" labelledBy="awards-faq-title">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">{AWARDS_PAGE.faq.overline}</Eyebrow>
              <h2 id="awards-faq-title" className="text-display-md text-fg">
                {AWARDS_PAGE.faq.title} {AWARDS_PAGE.faq.accent}
              </h2>
            </div>
            <FaqAccordion faqs={AWARDS_FAQS} className="mt-10 lg:col-span-8 lg:mt-0" />
          </div>
        </Container>
      </Section>
    </>
  );
}
