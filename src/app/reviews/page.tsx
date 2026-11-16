import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ExternalLink, PenLine } from "@/components/ui/icons";
import Stars from "@/components/about/Stars";
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
        layout="editorial"
        align="center"
        overline={REVIEWS_PAGE.overline}
        title={REVIEWS_PAGE.title}
        accent={REVIEWS_PAGE.accent}
        actions={
          <>
            <Button
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="brass"
              icon={<PenLine className="size-5" />}
            >
              {REVIEWS_PAGE.writeReviewLabel}
            </Button>
            <Button
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              iconRight={<ExternalLink className="size-5" />}
            >
              {REVIEWS_PAGE.readAllLabel}
            </Button>
          </>
        }
      >
        <div className="mx-auto mt-10 max-w-md border-t border-rule pt-8">
          <div className="flex items-center justify-center gap-4">
            <span className="text-display-lg leading-none text-fg tabular-nums">{rating.toFixed(1)}</span>
            <Stars rating={rating} className="size-6 sm:size-7" />
          </div>
          <p className="mt-3 text-muted">
            {REVIEWS_PAGE.basedOnPrefix} {total}
            {REVIEWS_PAGE.basedOnSuffix}
          </p>
        </div>
      </PageHero>

      {/* The quotes as an editorial list: hairline rows, two newspaper columns on desktop. */}
      <Section tone="white">
        <Container>
          <ul aria-label={REVIEWS_PAGE.listLabel} className="lg:columns-2 lg:gap-x-16">
            {cards.map((r, i) => (
              <li key={i} className="break-inside-avoid border-t border-rule pt-6 pb-10">
                <figure>
                  <div className="flex items-center justify-between gap-4">
                    <Stars rating={r.rating} />
                    <span className="text-sm text-muted">{r.when}</span>
                  </div>
                  <blockquote className="mt-4 max-w-[60ch] text-lg leading-relaxed text-fg">
                    <p>&ldquo;{r.text}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-body">— {r.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="border-t border-rule pt-6 text-sm text-muted">{REVIEWS_PAGE.sourceNote}</p>
        </Container>
      </Section>

      {/* Why the rating holds up */}
      <Section tone="navy">
        <Container>
          <Reveal className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
            <h2 className="text-display-md text-fg lg:col-span-5">
              {REVIEWS_PAGE.ratingTitle} <span className="text-accent">{REVIEWS_PAGE.ratingAccent}</span>
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
              variant="brass"
              size="lg"
              icon={<PenLine className="size-5" />}
              className="mt-9"
            >
              {REVIEWS_PAGE.shareLabel}
            </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
