/**
 * Business facts, written once: name, phone, address, email, hours, license
 * numbers and public profile links. Pages, form emails, JSON-LD, llms.txt and
 * the print documents all read them from here, and tests/typed-facts.test.ts
 * fails when the phone, license, street address or office email is typed
 * anywhere else in src.
 *
 * Kept small on purpose. next.config.ts loads this module (through
 * landing-indexing → service-city-landings) and client components bundle it,
 * so it imports only ./claims (for the license numbers), by plain relative
 * path: no page data, no .tsx, no Node APIs. src/lib/constants.ts re-exports
 * BUSINESS so existing server code keeps importing it from there.
 */
import { LICENSE } from "./claims";

// The company has one phone line (Aiden, 2026-11-14). It is typed here twice,
// as digits and as the vanity spelling; every other form is derived from
// these two.
const PHONE_DIGITS = "8337586248";
const PHONE_VANITY = "833-PLUMB-IT";

const STREET = "951 Pondella Rd";
const CITY = "North Fort Myers";
const STATE = "FL";
const ZIP = "33903";

export const BUSINESS = {
  name: "C&S Plumbing",
  fullName: "C&S Plumbing of Lee",
  /** Contracting entity as stated by the owner (Aiden, 2026-11-03): Draft
   *  Plumbing Corp, d/b/a C&S Plumbing of Lee, under license CFC1432485.
   *  The public brand stays "C&S Plumbing of Lee"; the legal name goes on
   *  the Terms, vendor paperwork and schema. An older Sunbiz record reads
   *  "C & S PLUMBING OF LEE, INC."; confirm the W-9 matches this value. */
  legalName: "Draft Plumbing Corp",
  /** The number as customers read it. */
  phone: PHONE_VANITY,
  /** Ten digits, no country code. The JSON-LD telephone fields build
   *  "+1" + phoneRaw; links use phoneHref instead. */
  phoneRaw: PHONE_DIGITS,
  /** E.164 form of the same number. */
  phoneE164: `+1${PHONE_DIGITS}`,
  /** The href of every link that dials the company line. Never build a tel:
   *  link from phoneRaw (tests/phone-href.test.ts). */
  phoneHref: `tel:+1${PHONE_DIGITS}`,
  /** The digits as printed beside the vanity number, "833-PLUMB-IT
   *  (833-758-6248)". A plain literal: tests/phone-href.test.ts checks it
   *  against phoneRaw. */
  phoneDigits: "833-758-6248",
  // "?&body=" works on both iOS and Android
  smsHref: `sms:+1${PHONE_DIGITS}?&body=Hi%20C%26S%20Plumbing%2C%20I%20need%20help%20with%20`,
  email: "office@csplumbinglee.com",
  /** Builder inquiries and prequal document requests. */
  builderPhone: `${PHONE_VANITY} ext. 0`,
  /** Owner line on the builder documents. 833-758-6248 is the company's only
   *  line (Aiden, 2026-11-14): no direct cell numbers on any page or PDF. */
  ownerPhone: `${PHONE_VANITY} ext. 1`,
  address: STREET,
  city: CITY,
  state: STATE,
  zip: ZIP,
  founded: 1998,
  // Owner-supplied counts (Sep 2026). New construction homes completed, and
  // residential whole-home repipes completed — keep them separate: a repipe
  // claim must never borrow the new-construction number.
  homesCompleted: 9500,
  repipesCompleted: 3500,
  // Public hours. The business runs 24/7 (Aiden, 2026-11-13), so every hours
  // field on the site and on listings says so. `officeHours` is the staffed
  // office schedule: the Terms "Office." clause prints it verbatim, so changing
  // it is a Terms revision (docs/terms-on-documents.md §3).
  hours: {
    open: "Open 24 hours, 7 days a week",
    emergency: "24/7 Emergency Service",
  },
  officeHours: {
    weekday: "Mon–Fri: 7:30 AM – 4:30 PM",
    saturday: "Sat: 9:00 AM – 3:00 PM",
    emergency: "24/7 Emergency Service",
  },
  tagline: "Southwest Florida's Most Trusted Plumbing Team",
  description:
    "Family owned and operated since 1998. From emergency repairs to new construction, C&S Plumbing delivers excellence across Southwest Florida.",
  /** The company's current Florida Certified Plumbing Contractor license,
   *  in place since the 2023 reorganization as part of Draft Construction
   *  (owner-stated 2026-11-03). Goes on every contract, proposal and invoice. */
  license: LICENSE.company,
  /** Samuel Pellechio's original license, still active; listed alongside the
   *  company license on formal documents. */
  license2: LICENSE.founder,
  // DBPR "Search by License Number" form (search=LicNbr). Direct per-license
  // detail links aren't possible — the DBPR site is session-coupled.
  licenseLookupUrl:
    "https://www.myfloridalicense.com/wl11.asp?mode=2&search=LicNbr&SID=&brd=&typ=",
  rating: 5.0,
  // Static fallback only. Google Maps showed 5.0 across 60 reviews on
  // 2026-10-20 while the site was still telling crawlers 46. The live number
  // comes from the Places API when GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID
  // are set in Vercel — set those so this stops drifting.
  reviewCount: 60,
  /** Permanent link to the Google Business Profile listing (by CID), not a
   *  Maps search. Resolves to the 951 Pondella Rd listing. */
  googleProfileUrl: "https://maps.google.com/?cid=5498090134012520413",
  /** Google Place ID for the same listing (public identifier, found with
   *  Google's Place ID Finder on 2026-10-20). Drives the write-a-review deep
   *  link and the Places API lookup; only GOOGLE_PLACES_API_KEY is secret. */
  googlePlaceId: "ChIJjeFQMQ9D24gR3WflxNgjTUw",
  /**
   * Where Google Maps pins 951 Pondella Rd (checked 2026-10-20; the Census
   * geocoder agrees to within 150 ft). The previous value, 26.6695 /
   * -81.8726, sat 2.8 miles east in a mobile home park off E North Shore Dr.
   */
  geo: { latitude: 26.6663678, longitude: -81.9171809 },
  facebookUrl: "https://www.facebook.com/csplumbingoflc",
  instagramUrl: "https://www.instagram.com/cs_plumbing_of_lee/",
  // Current review profile (North Fort Myers office). An older Birdeye
  // profile for the former Cape Coral office still exists; never link it.
  birdeyeUrl: "https://reviews.birdeye.com/cs-plumbing-of-lee-172502710968475",
  /**
   * One-sentence identity statement for crawlers and AI engines. Directories
   * still carry the former Cape Coral address (one marks it "permanently
   * closed"), so every machine-readable surface states where the business
   * actually is and that it is open.
   */
  locationNote: `C&S Plumbing of Lee has one office, open and operating, at ${STREET}, ${CITY}, ${STATE} ${ZIP}. Directory listings that show an older Cape Coral street address refer to the company's former office.`,
} as const;
