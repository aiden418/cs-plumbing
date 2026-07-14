import type { Metadata } from "next";
import Link from "next/link";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import NavySection from "@/components/ui/NavySection";
import FaqAccordion from "@/components/ui/FaqAccordion";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { BUSINESS } from "@/lib/constants";
import { FAQ_CATEGORIES } from "@/lib/faq-data";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Frequently Asked Questions",
  description:
    "Get answers to the most common plumbing questions from C&S Plumbing of Lee. Repiping, water heaters, drain cleaning, leak repair, costs, and more. Serving Cape Coral, Fort Myers & SWFL.",
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

export default function FAQPage() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <FaqJsonLd faqs={allFaqs} />

      {/* Hero */}
      <PageHero
        align="center"
        overline="FAQ"
        title="Frequently Asked"
        accent="Questions"
        description={
          <>
            Answers to the most common plumbing questions from homeowners across
            Cape Coral, Fort Myers, and Southwest Florida. Can&apos;t find what
            you&apos;re looking for?{" "}
            <Link href="/contact" className="text-gold font-semibold hover:underline">
              Contact us
            </Link>{" "}
            or call{" "}
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="text-gold font-semibold hover:underline"
            >
              833-PLUMB-IT
            </a>
            .
          </>
        }
      />

      {/* Quick Nav */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <nav className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {FAQ_CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="shrink-0 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
              >
                {cat.category}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 sm:py-16 lg:py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12 sm:space-y-16">
          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-32">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {cat.category}
                </h2>
                {cat.link && (
                  <Link
                    href={cat.link}
                    className="text-sm font-medium text-primary hover:underline hidden sm:block"
                  >
                    Learn more &rarr;
                  </Link>
                )}
              </div>
              <FaqAccordion faqs={cat.faqs} />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <NavySection>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Still Have <span className="text-gold-gradient">Questions?</span>
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Our team is happy to answer any plumbing question. Get a free
            estimate or schedule a service call — we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold-dark transition-colors active:scale-[0.98]"
            >
              Book a Service
            </Link>
            <Link
              href="/quote-builder"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors active:scale-[0.98]"
            >
              Get an Instant Quote
            </Link>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center px-6 py-3 text-white/80 font-semibold hover:text-white transition-colors"
            >
              Call 833-PLUMB-IT
            </a>
          </div>
        </div>
      </NavySection>
    </PageTransition>
  );
}
