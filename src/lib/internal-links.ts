/**
 * Internal-link selectors shared by the server-rendered cross-link blocks
 * (CityServiceLinks, AreaServiceLinks, RelatedPosts, BlogRelatedLandings,
 * HubCityLinks). Everything here is derived from the existing data in
 * constants.ts / service-city-landings.ts so a new landing, area or post
 * is linked automatically wherever it belongs.
 *
 * Import this only from server components: it pulls in the full landing
 * and blog data sets, which must not end up in a client bundle.
 */
import { AREA_LANDINGS, BLOG_POSTS } from "./constants";
import { SERVICE_CITY_LANDINGS } from "./service-city-landings";
import { getServiceHub, type ServiceHub } from "./service-hubs";
import {
  NEW_CONSTRUCTION_CITIES,
  type NewConstructionCity,
} from "./builder-program";
import type { AreaLanding, BlogPost, ServiceCityLanding } from "./types";

/** Area hub for a city name as written on landings ("Sanibel Island" → /areas/sanibel). */
export function areaForCity(city: string): AreaLanding | undefined {
  return AREA_LANDINGS.find((a) => a.city === city);
}

/** Every service-city landing for a city, optionally excluding the current page. */
export function landingsForCity(
  city: string,
  exceptSlug?: string,
): ServiceCityLanding[] {
  return SERVICE_CITY_LANDINGS.filter(
    (l) => l.city === city && l.slug !== exceptSlug,
  );
}

/** Every service-city landing under a service hub, optionally excluding the current page. */
export function landingsForHub(
  hubSlug: string | undefined,
  exceptSlug?: string,
): ServiceCityLanding[] {
  if (!hubSlug) return [];
  return SERVICE_CITY_LANDINGS.filter(
    (l) => l.serviceSlug === hubSlug && l.slug !== exceptSlug,
  );
}

export function hubForLanding(
  landing: ServiceCityLanding,
): ServiceHub | undefined {
  return getServiceHub(landing.serviceSlug);
}

/** Builder-door city page for a city, if one exists. */
export function newConstructionCityFor(
  city: string,
): NewConstructionCity | undefined {
  return NEW_CONSTRUCTION_CITIES.find((c) => c.city === city);
}

/**
 * Blog category → service hub. Posts in "Tips" and "News" have no single
 * hub and surface through /blog and the homepage instead.
 */
const POST_CATEGORY_HUB: Record<string, string> = {
  Repiping: "repiping",
  "Water Heaters": "water-heaters",
  "Leak Repair": "leak-repair",
  "Drain Cleaning": "drain-cleaning",
  "Water Quality": "water-softeners",
  "UEP & Utilities": "uep-utilities",
  Emergency: "emergency",
};

function newestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) =>
    (b.updatedDate ?? b.publishDate).localeCompare(a.updatedDate ?? a.publishDate),
  );
}

export function latestPosts(limit = 3): BlogPost[] {
  return newestFirst(BLOG_POSTS).slice(0, limit);
}

/** Posts filed under a service hub's category, newest first. */
export function postsForHub(hubSlug: string, limit = 4): BlogPost[] {
  return newestFirst(
    BLOG_POSTS.filter((p) => POST_CATEGORY_HUB[p.category] === hubSlug),
  ).slice(0, limit);
}

/**
 * Service-city landings a post points readers to. Slugs are curated per
 * post (BlogPost.relatedLandings); an unknown slug throws so a typo fails
 * the static build instead of silently dropping the link.
 */
export function landingsForPost(post: BlogPost): ServiceCityLanding[] {
  return (post.relatedLandings ?? []).map((slug) => {
    const landing = SERVICE_CITY_LANDINGS.find((l) => l.slug === slug);
    if (!landing) {
      throw new Error(
        `BLOG_POSTS["${post.slug}"].relatedLandings: no service-city landing with slug "${slug}"`,
      );
    }
    return landing;
  });
}

/** Posts whose related landings include this city, newest first. */
export function postsForCity(city: string, limit = 4): BlogPost[] {
  const citySlugs = new Set(landingsForCity(city).map((l) => l.slug));
  return newestFirst(
    BLOG_POSTS.filter((p) =>
      (p.relatedLandings ?? []).some((slug) => citySlugs.has(slug)),
    ),
  ).slice(0, limit);
}
