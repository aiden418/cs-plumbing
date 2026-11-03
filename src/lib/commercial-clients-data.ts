import type { CommercialClient } from "./types";

/**
 * Commercial clients shown in the home-page "Businesses That Trust C&S" strip.
 *
 * How to add one:
 *   1. Drop the logo in /public/images/clients/<slug>.(svg|png|webp). Trim the
 *      whitespace, transparent background, roughly 4:1 landscape reads best
 *      at the 32px pill height. Run `npm run photos:strip` if it's a raster
 *      file so no metadata ships.
 *   2. Add `{ name, logo, logoWidth, logoHeight }` below. Width/height are the
 *      file's intrinsic pixels — next/image needs them to pick a small srcset
 *      entry instead of shipping the full-size source.
 *   3. No logo yet? Add `{ name }` alone and the strip renders a wordmark pill.
 *
 * Only list a client whose name C&S has permission to use. A client logo is
 * their trademark; get written OK (an email is fine) before it goes live.
 *
 * Commercial service accounts, in display order. Logos drop in per the steps
 * above; until then each renders as a wordmark.
 */
export const COMMERCIAL_CLIENTS: CommercialClient[] = [
  { name: "Val Ward Cadillac", website: "https://www.valwardautos.com" },
  { name: "Fuego Pilates", website: "https://fuego-pilates.com" },
  { name: "FINS Seafood & Dive Bar", website: "https://finsdivebar.com" },
  { name: "Hurricane Grill & Wings", website: "https://www.hurricanewings.com" },
  { name: "Scoops on First" },
];
