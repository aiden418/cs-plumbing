#!/usr/bin/env node
// Stops a production deployment that would ship with the ad and analytics
// tags switched off (or on placeholder ids).
//
// NEXT_PUBLIC_ANALYTICS=off is meant for review builds: the local preview and
// Vercel's Preview environment. If it is ever saved for Production by mistake,
// the live site would silently stop reporting calls and form leads. Vercel
// sets VERCEL_ENV=production on production builds, so that is the one case
// this refuses. Everywhere else it prints nothing and exits 0.
const mode = (process.env.NEXT_PUBLIC_ANALYTICS ?? "").trim().toLowerCase();
const isProduction = process.env.VERCEL_ENV === "production";

if (isProduction && (mode === "off" || mode === "placeholder")) {
  console.error(
    `deploy check: NEXT_PUBLIC_ANALYTICS is "${mode}" on a production build. ` +
      "That switch is for review builds only. Remove it from the Production environment " +
      "in the Vercel project settings (keep it on Preview) and deploy again.",
  );
  process.exit(1);
}
