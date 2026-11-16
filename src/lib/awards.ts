/**
 * Awards, split out of ./constants so that modules loaded by next.config.ts
 * (service-city-landings) and client components can read them without the
 * page data. Plain relative imports only; ./constants re-exports everything
 * here for existing server code.
 */
import type { Award } from "./types";

// Single source of truth for awards, newest first. Every surface that names
// an award — hero chips, nav strip, About, Credentials, WhyChooseUs, the
// trust-badge arrays, JsonLd and llms.txt — reads from here for the same
// reason EMERGENCY_CLAIMS exists: one consistent, verifiable story.
export const AWARDS: Award[] = [
  {
    slug: "best-of-cape-coral-2026",
    year: 2026,
    title: "Best of Cape Coral 2026",
    category: "Best Plumbing Contractor",
    program: "Best of Cape Coral Readership Awards",
    issuer: "Cape Coral Breeze",
    issuerUrl: "https://www.capecoralbreeze.com",
    // TODO: swap in the Breeze's 2026 winners listing URL once the Digital
    // Winners Platform entry is live — it becomes the schema citation.
    awardedOn: "2026-09-09",
    badge: "/images/awards/best-of-cape-coral-2026.png",
    badgeWidth: 2215,
    badgeHeight: 1561,
    summary:
      "Voted Best Plumbing Contractor by Cape Coral Breeze readers in the 2026 Best of Cape Coral awards.",
  },
  {
    slug: "best-of-cape-coral-2025",
    year: 2025,
    title: "Best of Cape Coral 2025",
    category: "Plumbing",
    program: "Best of Cape Coral Readership Awards",
    issuer: "Cape Coral Breeze",
    issuerUrl: "https://www.capecoralbreeze.com",
    awardedOn: "2025-09",
    badge: "/images/awards/best-of-cape-coral-2025.png",
    badgeWidth: 793,
    badgeHeight: 593,
    summary:
      "Voted Best of Cape Coral in the Plumbing category by Cape Coral Breeze readers in 2025.",
  },
];

export const LATEST_AWARD = AWARDS[0];

/** Flat line for the trust-badge string arrays on area and service-city pages. */
export const AWARD_TRUST_LINE = `Best of Cape Coral ${[...AWARDS]
  .map((a) => a.year)
  .sort()
  .join(" & ")}`;
