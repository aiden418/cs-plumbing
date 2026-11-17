/**
 * Cape Coral Utilities Extension Project status, split out of ./constants so
 * that service-city-landings (loaded by next.config.ts) can read it without
 * the page data. No imports; ./constants re-exports UEP_STATUS for existing
 * server code.
 */

// City of Cape Coral Utilities Extension Project status, as the city's own
// UEP pages stated it on `checkedOn`. The 180-day window and the plumber rule
// come from the city's "How to Connect" page. Re-read capecoral.gov/uep before
// changing any of this; every UEP surface (service page, Cape Coral landing,
// llms.txt) reads from here so the story stays identical everywhere.
const UEP_NORTH_1_WEST =
  "North 1 West is substantially complete and the city has mailed its Notice of Availability letters, so the 180-day connection window there is already running.";
const UEP_NORTH_1_EAST =
  "North 1 East is under construction — contractors received Notice to Proceed in December 2025 and the city expects completion by the end of 2027.";
const UEP_NORTH_3 =
  "North 3, about 3 square miles of northwest Cape Coral, is in design; the city expects construction to start by the end of 2026 and run about two years.";
export const UEP_STATUS = {
  checkedOn: "2026-10-20",
  checkedOnLabel: "October 2026",
  sourceUrl: "https://www.capecoral.gov/uep/how_to_connect.php",
  /** Days a homeowner has to connect after the city's Notice of Availability. */
  connectionWindowDays: 180,
  plumberRule:
    "The city directs homeowners to a City of Cape Coral licensed plumber for the final connection, and that plumber is responsible for pulling the permits.",
  north1West: UEP_NORTH_1_WEST,
  north1East: UEP_NORTH_1_EAST,
  north3: UEP_NORTH_3,
  /** One-paragraph version for prose surfaces. */
  summary: `${UEP_NORTH_1_WEST} ${UEP_NORTH_1_EAST} ${UEP_NORTH_3}`,
} as const;
