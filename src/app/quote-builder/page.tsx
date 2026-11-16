import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
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
        layout="compact"
        overline={QUOTE.hero.overline}
        title={QUOTE.hero.title}
        accent={QUOTE.hero.accent}
        description={QUOTE.hero.description}
      >
        {/* What happens next */}
        <ol
          aria-label={QUOTE.hero.stepsLabel}
          className="mt-8 grid grid-cols-1 gap-y-3 text-sm text-body sm:flex sm:flex-wrap sm:items-center sm:gap-x-3"
        >
          {QUOTE.hero.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="hidden h-px w-6 bg-rule sm:block" />}
              <span className="label-tech text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </PageHero>
      <Section tone="shell" spacing="sm">
        <Container className="min-h-[20rem]">
          <Suspense>
            <QuoteBuilderPage />
          </Suspense>
        </Container>
      </Section>
      <CTASection />
    </>
  );
}
