import type { Metadata } from "next";
import { Star, ExternalLink, PenLine } from "lucide-react";
import Container from "@/components/ui/Container";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import NavySection from "@/components/ui/NavySection";
import ScrollReveal from "@/components/animations/ScrollReveal";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { BUSINESS, TESTIMONIALS } from "@/lib/constants";
import { fetchPlaceData, getWriteReviewUrl } from "@/lib/google-reviews";

export const metadata: Metadata = {
  title: "Reviews | C&S Plumbing of Lee — 5.0-Star Rated SWFL Plumber",
  description:
    "Read real Google reviews from Cape Coral, Fort Myers, and Southwest Florida homeowners. C&S Plumbing of Lee is 5.0-star rated — family-owned since 1998.",
  keywords: [
    "C&S Plumbing reviews",
    "plumber reviews Cape Coral",
    "best rated plumber Fort Myers",
    "5 star plumber Lee County",
  ],
  openGraph: {
    title: "Reviews | C&S Plumbing of Lee",
    description:
      "Real Google reviews from Southwest Florida homeowners. 5.0-star rated, family-owned since 1998.",
    url: "https://www.csplumbinglee.com/reviews",
  },
  alternates: { canonical: "https://www.csplumbinglee.com/reviews" },
};

function Stars({
  rating,
  className = "w-4 h-4",
  onNavy = false,
}: {
  rating: number;
  className?: string;
  onNavy?: boolean;
}) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${
            i < filled
              ? onNavy
                ? "fill-gold text-gold"
                : "fill-amber-400 text-amber-400"
              : onNavy
                ? "text-white/25"
                : "text-gray-300"
          }`}
        />
      ))}
    </span>
  );
}

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
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
      />

      <PageHero
        align="center"
        size="lg"
        overline="Reviews"
        title="What Your Neighbors"
        accent="Say"
        actions={
          <>
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy text-sm sm:text-base font-bold hover:bg-gold-dark transition-colors active:scale-[0.98]"
            >
              <PenLine className="w-4 h-4" />
              Leave Us a Review
            </a>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/30 text-white text-sm sm:text-base font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Read All on Google
              <ExternalLink className="w-4 h-4" />
            </a>
          </>
        }
      >
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-4xl sm:text-5xl font-black text-white">
            {rating.toFixed(1)}
          </span>
          <Stars rating={rating} className="w-6 h-6 sm:w-7 sm:h-7" onNavy />
        </div>
        <p className="mt-2 text-white/60">
          Based on {total}+ verified Google reviews across Southwest Florida
        </p>
      </PageHero>

      {/* Review cards */}
      <section className="py-12 sm:py-16">
        <Container>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {cards.map((r, i) => (
                <article
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm card-lift card-lift-hover hover:border-gold/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-gray-400">{r.when}</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                    — {r.name}
                  </p>
                </article>
              ))}
            </div>
          </ScrollReveal>
          <p className="text-center text-xs text-gray-400 mt-8">
            Reviews shown are from our public Google Business Profile.
          </p>
        </Container>
      </section>

      {/* Why the rating holds up */}
      <NavySection>
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                A 5.0 Rating{" "}
                <span className="text-gold-gradient">Isn&apos;t Luck</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                We&apos;ve been family-owned since {BUSINESS.founded}, with{" "}
                {BUSINESS.homesCompleted.toLocaleString()}+ homes plumbed across
                Southwest Florida. Every job is done under two active Florida
                Certified Plumbing Contractor licenses ({BUSINESS.license} and{" "}
                {BUSINESS.license2}), and the person answering the phone is a
                dispatcher at our North Fort Myers shop — not a call center.
              </p>
              <p className="text-white/70 leading-relaxed">
                Had us out recently? A quick Google review helps your neighbors
                find a plumber they can trust — and it means a lot to our family.
              </p>
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-navy text-sm sm:text-base font-bold hover:bg-gold-dark transition-colors active:scale-[0.98]"
              >
                <PenLine className="w-4 h-4" />
                Share Your Experience
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </NavySection>

      <CTASection />
    </PageTransition>
  );
}
