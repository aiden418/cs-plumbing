import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import Container from "@/components/ui/Container";
import CtaBand from "@/components/ui/CtaBand";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { FAQ_PAGE } from "@/content/reading";
import { BUSINESS } from "@/lib/business";
import { FAQ_CATEGORIES } from "@/lib/faq-data";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Frequently Asked Questions",
  description:
    "Answers to the most common plumbing questions — repiping, water heaters, drain cleaning, leak repair and costs. Serving Cape Coral, Fort Myers & SWFL.",
  keywords: [
    "plumbing FAQ",
    "plumbing questions Cape Coral",
    "repiping FAQ",
    "water heater FAQ",
    "drain cleaning questions",
    "plumber FAQ Fort Myers",
    "plumbing costs Southwest Florida",
    "emergency plumber questions",
  ],
  openGraph: {
    title: "Plumbing FAQ — C&S Plumbing of Lee",
    description:
      "Answers to common plumbing questions about costs, timelines, services, and more from a licensed Florida contractor.",
    url: "https://www.csplumbinglee.com/faq",
  },
};

// Flatten all FAQs for the schema
const allFaqs = FAQ_CATEGORIES.flatMap((cat) => cat.faqs);

const inlineLink =
  "font-semibold text-link underline decoration-1 underline-offset-[0.18em] hover:decoration-2";

export default function FAQPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <FaqJsonLd faqs={allFaqs} />

      <PageHero
        layout="compact"
        overline={FAQ_PAGE.overline}
        title={FAQ_PAGE.title}
        accent={FAQ_PAGE.accent}
        description={
          <>
            {FAQ_PAGE.intro}{" "}
            <Link href={FAQ_PAGE.contactHref} className={inlineLink}>
              {FAQ_PAGE.contactLabel}
            </Link>{" "}
            {FAQ_PAGE.orCall}{" "}
            <a href={BUSINESS.phoneHref} className={inlineLink}>
              {BUSINESS.phone}
            </a>
            .
          </>
        }
      />

      <Section tone="white" spacing="sm">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
            {/* Categories: a list at the top on phones, a sticky side list from lg. */}
            <nav aria-labelledby="faq-categories-heading" className="lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                <p id="faq-categories-heading" className="label-tech mb-3 flex items-center gap-2.5 text-accent">
                  <span className="joint" aria-hidden="true" />
                  {FAQ_PAGE.categoriesLabel}
                </p>
                <ul className="grid grid-cols-1 gap-x-6 border-b border-rule sm:grid-cols-2 lg:grid-cols-1">
                  {FAQ_CATEGORIES.map((cat) => (
                    <li key={cat.slug} className="-mb-px border-b border-rule">
                      <a
                        href={`#${cat.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 py-2 font-medium text-fg underline-offset-4 transition-colors duration-150 hover:text-link hover:underline"
                      >
                        <span>{cat.category}</span>
                        <span className="text-sm text-muted tabular-nums">{cat.faqs.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="space-y-16 sm:space-y-20 lg:col-span-8 lg:col-start-5">
              {FAQ_CATEGORIES.map((cat) => (
                <section key={cat.slug} id={cat.slug} aria-labelledby={`${cat.slug}-heading`}>
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                    <h2 id={`${cat.slug}-heading`} className="text-display-sm text-fg">
                      {cat.category}
                    </h2>
                    {cat.link && (
                      <Link
                        href={cat.link}
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-link underline-offset-4 hover:underline"
                      >
                        {FAQ_PAGE.learnMore}
                      </Link>
                    )}
                  </div>
                  <FaqAccordion faqs={cat.faqs} name={`faq-${cat.slug}`} />
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={FAQ_PAGE.closing.title}
        accent={FAQ_PAGE.closing.accent}
        body={FAQ_PAGE.closing.body}
        secondary={FAQ_PAGE.closing.book}
        showHours={false}
        note={
          <Link
            href={FAQ_PAGE.closing.quote.href}
            className="inline-flex min-h-11 items-center text-base font-semibold text-link underline-offset-4 hover:underline"
          >
            {FAQ_PAGE.closing.quote.label}
          </Link>
        }
      />
    </>
  );
}
