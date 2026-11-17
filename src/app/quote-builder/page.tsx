import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { QUOTE } from "@/content/conversion";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import QuoteBuilderPage from "./QuoteBuilderPage";

export const metadata: Metadata = {
  title: "Instant Water Heater & Repipe Quote",
  description:
    "Instant price estimate for water heater installation or whole-home repiping in Lee County. Answer a few questions, see your quote — no obligation.",
  alternates: { canonical: "/quote-builder" },
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "Instant Quote Builder — Water Heater & Repipe Estimates",
    description:
      "Get an instant price estimate for water heater installation or whole-home repiping in Lee County.",
    url: "https://www.csplumbinglee.com/quote-builder",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Instant Quote", href: "/quote-builder" },
        ]}
      />
      {/* The hero lives here, outside the Suspense boundary, so the H1 and
          page copy are in the prerendered HTML. The quiz below reads
          ?service= and is client-only by design. */}
      <PageHero
        layout="plain"
        size="sm"
        overline={QUOTE.hero.overline}
        title={QUOTE.hero.title}
        accent={QUOTE.hero.accent}
        description={QUOTE.hero.description}
        media={
          /* What happens next: beside the headline on desktop, under it on phones. */
          <div className="lg:mt-6">
            <ol aria-label={QUOTE.hero.stepsLabel} className="border-b border-rule">
              {QUOTE.hero.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-4 border-t border-rule py-3.5 font-medium text-fg">
                  <span aria-hidden="true" className="cv-num-disc">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Button
              href={BUSINESS.phoneHref}
              variant="secondary"
              size="lg"
              icon={<Phone aria-hidden="true" className="size-5" />}
              className="mt-6 w-full sm:w-auto"
            >
              {`Call ${BUSINESS.phone}`}
            </Button>
          </div>
        }
      />
      <Section tone="shell" spacing="none" className="py-8 sm:py-10 lg:py-12">
        <Container className="min-h-[20rem]">
          <p className="mb-5 max-w-[60ch] text-lg text-body">{QUOTE.hero.descriptionMore}</p>
          <Suspense>
            <QuoteBuilderPage />
          </Suspense>
        </Container>
      </Section>
      <CTASection />
    </>
  );
}
