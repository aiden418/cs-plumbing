/**
 * Cape Coral Utilities Extension Project status, split out of ./constants so
 * that service-city-landings (loaded by next.config.ts) can read it without
 * the page data. No imports; ./constants re-exports UEP_STATUS for existing
 * server code.
 */

// City of Cape Coral Utilities Extension Project status, as the city's own
// pages and council summaries stated it on `checkedOn`. Every UEP surface
// (service page, Cape Coral connection page, llms.txt) reads from here so the
// story stays identical everywhere.
//
// To re-check, read these four and update `checkedOn`:
//   1. the newest "Cape Clips" council highlights (councilHighlightsListUrl)
//      for any UEP item;
//   2. the North 3 page (north3Url) and its notices page;
//   3. the North 1 page (north1Url) for North 1 West and North 1 East;
//   4. the UEP FAQ (faqUrl) for the connection rule.
//
// Read 2026-11-22:
//   - Council highlights, November 2, 2026: "Council directed staff to remove
//     Alternative 5 from the North 3 project scope, revise the design, and
//     solicit new construction bids. These changes are expected to delay the
//     project by approximately 12 months". The November 18 highlights carry no
//     UEP item.
//   - The city's North 3 page had not been updated that day: it still read
//     "Construction to begin by the end of 2026". That forecast predates the
//     council decision, so it is NOT repeated on this site. The city has
//     published no new start date; do not write one here until it does.
//   - North 1 page: "All contractors have been issued substantial completion
//     in North 1 West, and all "Notice of Availability" letters have been sent
//     to residents for connection." and "The City began issuing "Notice to
//     Proceed" to contractors in December 2025, with an approximate 2-year
//     construction duration and anticipated completion by the end of 2027."
//   - FAQ: "Developed properties adjacent to water and sewer utilities must
//     connect within 180 days of the date on the Notice of Availability
//     Letter. Connection to the irrigation system may be optional based on
//     the UEP Project you are located in."
const CITY = "https://www.capecoral.gov";
const UEP_PAGES = `${CITY}/departments/public_works/capital_improvements/utilities_extension_project_uep`;

const UEP_NORTH_1_WEST =
  "North 1 West is substantially complete, and the city says every Notice of Availability letter for the area has been sent.";
const UEP_NORTH_1_WEST_DEADLINE =
  "Each property's 180 days run from the date printed on its own letter, so your deadline can differ from your neighbor's.";
const UEP_NORTH_1_EAST =
  "North 1 East is under construction: the city began issuing Notices to Proceed to contractors in December 2025 and anticipates completion by the end of 2027.";
const UEP_NORTH_3 =
  "North 3 has no construction start date. On November 2, 2026, City Council directed staff to revise the North 3 design and solicit new construction bids, which the city expects to delay the project by approximately 12 months.";

export const UEP_STATUS = {
  /** The day the city's pages below were last read. */
  checkedOn: "2026-11-22",
  /** The same day as customers read it. Shown wherever the status is shown. */
  checkedOnLabel: "November 22, 2026",
  sourceUrl: `${CITY}/uep/how_to_connect.php`,
  faqUrl: `${UEP_PAGES}/frequently_asked_questions.php`,
  north1Url: `${UEP_PAGES}/north_1_uep.php`,
  north3Url: `${UEP_PAGES}/north_3_uep.php`,
  councilHighlightsListUrl: `${CITY}/departments/office_of_communications/cape_clips.php`,
  /** Days a homeowner has to connect, counted from the date on the Notice of Availability. */
  connectionWindowDays: 180,
  plumberRule:
    "The city directs homeowners to a City of Cape Coral licensed plumber for the final connection, and that plumber is responsible for pulling the permits.",
  north1West: UEP_NORTH_1_WEST,
  north1WestDeadline: UEP_NORTH_1_WEST_DEADLINE,
  north1East: UEP_NORTH_1_EAST,
  north3: UEP_NORTH_3,
  /** The council decision that replaced the old North 3 forecast. */
  north3Decision: {
    date: "2026-11-02",
    dateLabel: "November 2, 2026",
    /** What the council's own meeting summary says, in our words. */
    summary:
      "City Council repealed the North 3 potable water assessment resolutions it had adopted on September 28, 2026, and directed staff to remove Alternative 5 from the project scope, revise the design and solicit new construction bids. The city expects those changes to delay North 3 by approximately 12 months and has not published a new construction start date.",
    sourceLabel: "City Council meeting highlights, November 2, 2026 (PDF)",
    sourceUrl: `${CITY}/Documents/Document%20Hub/City%20Council%20Mtg%20Highlights/2026/Cape%20Clips%2011.2.26.pdf`,
  },
  /**
   * How a North 1 West homeowner uses the date on their own letter. The
   * city's Customer Billing number is the one its North 1 page gives for
   * connection questions.
   */
  noticeDate: {
    heading: "Your deadline starts on the date printed on your letter",
    intro:
      "The city mailed a Notice of Availability to each North 1 West property, and it says all of them have been sent. There is no single deadline for the neighborhood: each property's 180 days start on the date printed on its own letter.",
    steps: [
      {
        title: "Find the date on your Notice of Availability",
        body: "It is the date printed on the letter the City of Cape Coral mailed to the property, not the day it arrived and not the date on a neighbor's letter.",
      },
      {
        title: "Count 180 days from that date",
        body: "The city's rule for developed properties next to the new water and sewer lines is to connect within 180 days of the date on the letter. Ask the city to confirm your exact deadline if you are close to it.",
      },
      {
        title: "Check which utilities your letter covers",
        body: "Water and sewer connections are required. The city says irrigation may be optional depending on the project area, so read what your letter lists.",
      },
      {
        title: "Send us the address and the notice date",
        body: "With those two facts we can plan the permits and the work inside your window and tell you what an on-site estimate needs to cover.",
      },
    ],
    lostLetter:
      "No letter, or not sure of the date? The city's Customer Billing Services answers connection questions at (239) 242-3853.",
    cityRule:
      "Developed properties adjacent to water and sewer utilities must connect within 180 days of the date on the Notice of Availability Letter.",
  },
  /** One-paragraph version for prose surfaces. */
  summary: `${UEP_NORTH_1_WEST} ${UEP_NORTH_1_WEST_DEADLINE} ${UEP_NORTH_1_EAST} ${UEP_NORTH_3}`,
} as const;
