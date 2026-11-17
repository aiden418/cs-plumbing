import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import Stars from "@/components/ui/Stars";
import { ExternalLink } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { fetchPlaceData } from "@/lib/google-reviews";

/** Google's "G", so the source of the rating is recognisable at a glance. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/**
 * The Google rating and, when the Places API answers, its latest reviews,
 * quoted word for word under hairlines. Without an answer it shows the
 * rating and count kept in BUSINESS, and no quotes: nothing is invented.
 */
export default async function GoogleReviews({ tone = "white" }: { tone?: Tone } = {}) {
  const live = await fetchPlaceData();
  const rating = live?.rating ?? BUSINESS.rating;
  const total = live?.total ?? BUSINESS.reviewCount;
  const profileUrl = live?.url ?? BUSINESS.googleProfileUrl;

  return (
    <Section tone={tone} spacing="sm" divider={tone === "white"} className={tone === "white" ? "border-b border-rule" : undefined}>
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-accent">
              <GoogleMark className="size-5 shrink-0" />
              <span>Google Reviews</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-display text-display-md leading-none font-bold text-fg tabular-nums [font-stretch:108%]">
                {rating.toFixed(1)}
              </span>
              <Stars rating={rating} className="size-6" />
            </div>
            <p className="mt-3 text-body">Based on {total}+ verified reviews</p>
          </div>

          <div className="flex flex-col items-start gap-x-6 gap-y-2 sm:flex-row sm:items-center">
            <Button
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              iconRight={<ExternalLink className="size-5" />}
            >
              Read all reviews on Google
            </Button>
            <Button href="/reviews" variant="ghost">
              See what neighbors say
            </Button>
          </div>
        </div>

        {live?.reviews && live.reviews.length > 0 && (
          <ul className="mt-12 grid grid-cols-1 gap-x-8 md:grid-cols-3">
            {live.reviews.map((r, i) => (
              <li key={i} className="border-t border-rule py-6 md:pb-0">
                <figure>
                  <div className="flex items-center justify-between gap-4">
                    <Stars rating={r.rating} />
                    <span className="text-sm text-muted">{r.relative_time_description}</span>
                  </div>
                  <blockquote className="mt-4 line-clamp-5 max-w-[60ch] text-body">&ldquo;{r.text}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-fg">— {r.author_name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
