import { Star, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import { BUSINESS } from "@/lib/constants";

interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

interface PlacesResponse {
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: PlaceReview[];
    url?: string;
  };
  status?: string;
}

async function fetchPlaceData(): Promise<{
  rating: number;
  total: number;
  reviews: PlaceReview[];
  url: string;
} | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "rating,user_ratings_total,reviews,url");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", apiKey);
    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data: PlacesResponse = await res.json();
    if (data.status !== "OK" || !data.result) return null;
    return {
      rating: data.result.rating ?? BUSINESS.rating,
      total: data.result.user_ratings_total ?? BUSINESS.reviewCount,
      reviews: (data.result.reviews ?? []).slice(0, 3),
      url: data.result.url ?? BUSINESS.googleProfileUrl,
    };
  } catch {
    return null;
  }
}

function Stars({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${i < filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
}

export default async function GoogleReviews() {
  const live = await fetchPlaceData();
  const rating = live?.rating ?? BUSINESS.rating;
  const total = live?.total ?? BUSINESS.reviewCount;
  const profileUrl = live?.url ?? BUSINESS.googleProfileUrl;

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-100">
      <Container>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-between sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
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
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                Google Reviews
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">{rating.toFixed(1)}</span>
                <Stars rating={rating} className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Based on {total}+ verified reviews
              </p>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Read all reviews on Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {live?.reviews && live.reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {live.reviews.map((r, i) => (
              <article
                key={i}
                className="bg-[#F5F5F7] border border-gray-200 rounded-2xl p-5 card-lift card-lift-hover-subtle"
              >
                <div className="flex items-center justify-between mb-3">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-gray-400">
                    {r.relative_time_description}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-5 mb-3">
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-semibold">
                  — {r.author_name}
                </p>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
