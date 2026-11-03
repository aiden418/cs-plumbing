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
 * The entries below are the commercial end users already named on the site's
 * /projects pages, so the strip ships with real work behind it. Swap in the
 * service accounts and logos as they're cleared.
 */
export const COMMERCIAL_CLIENTS: CommercialClient[] = [
  { name: "Mangos Restaurant & Bar" },
  { name: "South Florida Christian Academy" },
  { name: "USPS Cape Coral" },
  { name: "Hangar 97 · Punta Gorda Airport" },
  { name: "IFHA Community Center" },
];
