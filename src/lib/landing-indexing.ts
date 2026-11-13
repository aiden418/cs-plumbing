/**
 * Which service-city landings are built, indexed and linked. Every consumer
 * of SERVICE_CITY_LANDINGS that produces a URL (the [slug] route, sitemap,
 * llms.txt, cross-link blocks) reads one of these lists instead, so a
 * landing's `indexing` field is honored everywhere at once.
 *
 * Plain relative imports only: next.config.ts loads this module to declare
 * the redirects for retired slugs.
 */
import { SERVICE_CITY_LANDINGS } from "./service-city-landings";
import type { ServiceCityLanding } from "./types";

/** The landing 301s to another page and is not built. */
export function isRedirected(
  landing: ServiceCityLanding,
): landing is ServiceCityLanding & { indexing: { redirectTo: string } } {
  return typeof landing.indexing === "object";
}

/** The landing is built and search engines may index it (the default). */
export function isIndexed(landing: ServiceCityLanding): boolean {
  return landing.indexing === undefined || landing.indexing === "index";
}

/** Landings that get a page: everything except redirected slugs. */
export const PUBLISHED_LANDINGS: ServiceCityLanding[] = SERVICE_CITY_LANDINGS.filter(
  (l) => !isRedirected(l),
);

/** Landings search engines should see: in the sitemap, llms.txt and cross-link blocks. */
export const INDEXED_LANDINGS: ServiceCityLanding[] = PUBLISHED_LANDINGS.filter(isIndexed);

/** Retired slugs, as Next.js redirect entries for next.config.ts. */
export function landingRedirects(): { source: string; destination: string; permanent: true }[] {
  return SERVICE_CITY_LANDINGS.flatMap((l) =>
    isRedirected(l)
      ? [{ source: `/${l.slug}`, destination: l.indexing.redirectTo, permanent: true as const }]
      : [],
  );
}

// A redirect must not point at another retired landing, and a slug must not
// redirect to itself — either would loop at the edge. Checked at import time
// so a bad entry fails the build, not production.
for (const r of landingRedirects()) {
  const target = r.destination.replace(/^\//, "");
  if (r.source === r.destination || SERVICE_CITY_LANDINGS.some((l) => l.slug === target && isRedirected(l))) {
    throw new Error(`service-city landing "${r.source}" redirects to a retired page "${r.destination}"`);
  }
}
