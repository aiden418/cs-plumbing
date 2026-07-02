import { BUSINESS } from "@/lib/constants";

export interface PlaceReview {
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

export interface PlaceData {
  rating: number;
  total: number;
  reviews: PlaceReview[];
  url: string;
}

/**
 * Live Google rating/reviews via the Places API. Cached for 24h; the same
 * request is deduped by Next's fetch cache wherever it's awaited (layout
 * JsonLd, homepage strip, /reviews page). Returns null when env keys are
 * missing or the API fails — callers fall back to BUSINESS constants.
 */
export async function fetchPlaceData(
  maxReviews = 3
): Promise<PlaceData | null> {
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
      reviews: (data.result.reviews ?? []).slice(0, maxReviews),
      url: data.result.url ?? BUSINESS.googleProfileUrl,
    };
  } catch {
    return null;
  }
}

/** Direct "leave us a review" deep link when the place id is configured. */
export function getWriteReviewUrl(): string {
  const placeId = process.env.GOOGLE_PLACE_ID;
  return placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : BUSINESS.googleProfileUrl;
}
