import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { ExternalLink, PenLine, Phone } from "@/components/ui/icons";
import Stars from "@/components/ui/Stars";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { BUSINESS } from "@/lib/business";
import { TESTIMONIALS } from "@/lib/constants";
import { fetchPlaceData, getWriteReviewUrl } from "@/lib/google-reviews";
import { REVIEWS_PAGE } from "@/content/about";

export const metadata: Metadata = {
  title: "Reviews — 5.0-Star Rated SWFL Plumber",
  description:
    "Real Google reviews from Cape Coral, Fort Myers and Southwest Florida homeowners. C&S Plumbing of Lee: 5.0-star rated, family owned and operated since 1998.",
  keywords: [
    "C&S Plumbing reviews",
    "plumber reviews Cape Coral",
    "best rated plumber Fort Myers",
    "5 star plumber Lee County",
  ],
  openGraph: {
    title: "Reviews | C&S Plumbing of Lee",
    description:
      "Real Google reviews from Southwest Florida homeowners. 5.0-star rated, family owned and operated since 1998.",
    url: "https://www.csplumbinglee.com/reviews",
  },
  alternates: { canonical: "https://www.csplumbinglee.com/reviews" },
};

export default async function ReviewsPage() {
  const live = await fetchPlaceData(5);
  const rating = live?.rating ?? BUSINESS.rating;
  const total = live?.total ?? BUSINESS.reviewCount;
  const profileUrl = live?.url ?? BUSINESS.googleProfileUrl;
  const writeReviewUrl = getWriteReviewUrl();

  // Live Google reviews when configured; the site's curated Google
  // testimonials otherwise, so the page never renders empty.
  const cards =
    live?.reviews && live.reviews.length > 0
      ? live.reviews.map((r) => ({
          name: r.author_name,
          when: r.relative_time_description,
          rating: r.rating,
          text: r.text,
        }))
      : TESTIMONIALS.map((t) => ({
          name: t.name,
          when: t.location,
          rating: t.rating,
          text: t.text,
        }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
      />

      <PageHero
        layout="plain"
        overline={REVIEWS_PAGE.overline}
        title={REVIEWS_PAGE.title}
        accent={REVIEWS_PAGE.accent}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} variant="primary" size="lg" icon={<Phone className="size-5" />}>
              {REVIEWS_PAGE.callLabel} {BUSINESS.phone}
            </Button>
            <Button
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              icon={<PenLine className="size-5" />}
            >
              {REVIEWS_PAGE.writeReviewLabel}
            </Button>
          </>
        }
      >
        <div className="mt-6 flex flex-col gap-x-6 gap-y-1 border-t border-rule pt-5 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-3">
            <span className="font-display text-display-md leading-none font-bold text-fg tabular-nums">{rating.toFixed(1)}</span>
            <Stars rating={rating} className="size-6" />
          </div>
          <p className="text-body">
            {REVIEWS_PAGE.basedOnPrefix} {total}
            {REVIEWS_PAGE.basedOnSuffix}
          </p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {REVIEWS_PAGE.readAllLabel}
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      {/* The quotes as simple rows with a line between them: two columns from 640 px, three on desktop. */}
      <Section tone="white" spacing="sm">
        <Container>
          <ul aria-label={REVIEWS_PAGE.listLabel} className="sm:columns-2 sm:gap-x-10 lg:columns-3">
            {cards.map((r, i) => (
              <li key={i} className="break-inside-avoid border-t border-rule pt-4 pb-5 first:border-t-0 first:pt-0 sm:pb-7 sm:first:border-t sm:first:pt-4">
                <figure>
                  <div className="flex items-center justify-between gap-4">
                    <Stars rating={r.rating} />
                    <span className="text-[0.9375rem] text-body">{r.when}</span>
                  </div>
                  <blockquote className="mt-2 text-fg">
                    <p>&ldquo;{r.text}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-2 font-semibold text-body">— {r.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="border-t border-rule pt-5 text-[0.9375rem] text-body">{REVIEWS_PAGE.sourceNote}</p>
        </Container>
      </Section>

      {/* Why the rating holds up */}
      <Section tone="shell" spacing="sm">
        <Container>
          <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-12 lg:gap-x-8">
            <h2 className="text-display-md text-fg lg:col-span-5">
              {REVIEWS_PAGE.ratingTitle} {REVIEWS_PAGE.ratingAccent}
            </h2>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="max-w-[62ch] text-body">
                We&apos;ve been family-owned since {BUSINESS.founded}, with{" "}
                {BUSINESS.homesCompleted.toLocaleString()}+ homes plumbed across
                Southwest Florida. Every job is done under two active Florida
                Certified Plumbing Contractor licenses ({BUSINESS.license} and{" "}
                {BUSINESS.license2}), and the person answering the phone is a
                dispatcher at our North Fort Myers shop — not a call center.
              </p>
              <p className="mt-4 max-w-[62ch] text-body">{REVIEWS_PAGE.shareBody}</p>
              <Button
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                icon={<PenLine className="size-5" />}
                className="mt-7"
              >
                {REVIEWS_PAGE.shareLabel}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
