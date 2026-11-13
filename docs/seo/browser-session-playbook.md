# Browser-session playbook (2026-11-12)

Internal. Everything on this page needs a signed-in browser on Aiden's own
computer (GoDaddy, Google Search Console, Gmail, Google Business Profile,
directory logins). A cloud Claude session cannot reach those; a session in
the Claude desktop app (built-in browser or Claude in Chrome) can, with this
file as the brief. Do the sections in order; each one is short.

Reference docs: `docs/seo/backlink-and-citation-plan.md` (NAP standard, tiers,
templates), `docs/seo/citation-tracker.csv` (every listing, status, owner,
due), `docs/builder-door-checklist.md` (Vercel/DNS notes),
`docs/terms-on-documents.md` §3 (publishing a Terms revision).

## 0. Review the preview, then merge

Vercel built the branch `claude/compassionate-sagan-l4l1sh` at commit
848e653 (state READY):

- Preview: https://cs-plumbing-j4pyrjcbr-aiden418s-projects.vercel.app
  (preview deployments may ask for a Vercel login; use the aiden418 account)
- Inspector: https://vercel.com/aiden418s-projects/cs-plumbing/3WziMy9mft5mE2qoc4Qv8qZLWuvK

Click through on a phone: `/contact` (attach a photo, submit; the office and
the customer address both get an email), `/booking` → Details step (photos),
`/services/repiping` (one 3/2 price, warranty and patch-and-texture wording),
`/services/tankless-water-heaters`, `/services/water-heaters`,
`/coastal-comeback-plan` (arrival-season copy), `/terms` (rev. 2026-11-12),
`/` (no per-city minute badges, 13 sections).

Merge: open a pull request from the branch into `main` (or ask Claude to open
it) and merge. **The Terms effective date is 2026-11-12**; if the merge
happens on a later day, change `TERMS_EFFECTIVE_DATE` in
`src/lib/terms-meta.ts` and the matching `TERMS_REVISIONS` entry in
`src/lib/terms.ts` to the merge date first, then follow
`docs/terms-on-documents.md` §3 (PDF archive, invoicing template string).

## 1. Search Console: get the TXT record before touching GoDaddy

1. https://search.google.com/search-console → Add property → **Domain** →
   `candsplumbingfl.com`. Copy the TXT verification value it shows. Leave
   the dialog open (or come back to it after step 2).
2. Do section 2 (GoDaddy), then click Verify.

## 2. GoDaddy DNS for candsplumbingfl.com (one visit)

Current state (checked 2026-11-12 through the Vercel API):

| Host | Status | Why |
|---|---|---|
| `www.candsplumbingfl.com` | correct | CNAME to Vercel; already 308-redirects to www.csplumbinglee.com |
| `candsplumbingfl.com` (apex) | **misconfigured** | still carries GoDaddy *forwarding* A records 15.197.225.128 and 3.33.251.168 |

At https://dcc.godaddy.com/control/portfolio → candsplumbingfl.com → DNS:

1. **Forwarding** section: delete the domain forward (this removes the two
   forwarding A records).
2. **Records** → Add: `A` · name `@` · value `216.150.1.1` · TTL 600, and a
   second `A` · `@` · `216.150.16.1`. (Vercel's current rank-1 pair; the
   older single `76.76.21.21` still works if the two-record form is awkward.)
3. Add the Search Console record: `TXT` · `@` · the value from section 1.
4. Leave the `www` CNAME alone.

Verify 10–30 minutes later: Vercel → cs-plumbing → Settings → Domains shows
`candsplumbingfl.com` as "Valid Configuration", and
`curl -I https://candsplumbingfl.com` returns 308 → www.csplumbinglee.com.

Fallback if DNS cannot be changed: keep GoDaddy forwarding but set it to
**Permanent (301)**, **Forward only** (not masked), destination
`https://www.csplumbinglee.com`. Never let either host serve a copy of the
site again.

## 3. Search Console: indexing and the domain move

With the branch merged and live:

1. Sitemaps → resubmit `https://www.csplumbinglee.com/sitemap.xml`.
2. URL Inspection → **Request indexing**, one at a time (quota ≈ 10/day; do
   the first block today, the rest tomorrow):

| URL | Why |
|---|---|
| https://www.csplumbinglee.com/services/tankless-water-heaters | new page (≈265 impressions/14 days were landing on the hub) |
| https://www.csplumbinglee.com/services/water-heaters | retitled for Fort Myers queries, prices in description |
| https://www.csplumbinglee.com/ | description, trimmed sections |
| https://www.csplumbinglee.com/services/repiping | price and warranty corrections |
| https://www.csplumbinglee.com/services/leak-repair | headline range |
| https://www.csplumbinglee.com/services/drain-cleaning | headline range |
| https://www.csplumbinglee.com/services/emergency | response-time wording |
| https://www.csplumbinglee.com/coastal-comeback-plan | seasonal copy |
| https://www.csplumbinglee.com/terms | new revision |
| https://www.csplumbinglee.com/north-fort-myers-plumber | redirects to `/areas/north-fort-myers`; inspect the old URL once so Google records the 301 |
| https://www.csplumbinglee.com/plumber-lehigh-acres | redirects to `/areas/lehigh-acres`; inspect the old URL once so Google records the 301 |
| https://www.csplumbinglee.com/plumber-estero | redirects to `/areas/estero`; inspect the old URL once so Google records the 301 |
| https://www.csplumbinglee.com/plumber-sanibel | redirects to `/areas/sanibel`; inspect the old URL once so Google records the 301 |

3. Once `candsplumbingfl.com` is verified (section 1) **and** both hosts
   redirect (section 2): open the candsplumbingfl.com property → Settings →
   **Change of Address** → new site `https://www.csplumbinglee.com`. Google
   checks that the old home page 301s to the new one.
4. Export the data: www.csplumbinglee.com property → Performance → Search
   results → date **Last 16 months** → Export → Download CSV. Unzip into
   `docs/seo/gsc/2026-11-12/` (Queries, Pages, Countries, Devices, Dates).
   Repeat for the candsplumbingfl.com property (shows what the duplicate
   captured). Commit the folder; it is the baseline the keyword map asks for.

## 4. Gmail: send the five drafts

Open the Drafts folder of the company Gmail account. Each draft is ready;
set the recipient where it is blank, read once, send:

| Draft (subject) | Recipient | Note |
|---|---|---|
| Member listing update — C&S Plumbing of Lee | CCCIA staff (members portal contact) | address + website fix on the member directory |
| Claim and correct contractor profile — C&S Plumbing of Lee (CFC1432485) | BuildZoom support | after clicking "Claim" on the BuildZoom profile |
| Licensed plumber listing for UEP connections — C&S Plumbing of Lee | the City of Cape Coral UEP new-construction mailbox (address in the tracker's UEP row) | asks how plumbers get on the City's UEP list |
| Best of Cape Coral 2026 — Best Plumbing Contractor listing | Cape Coral Breeze (Best Of desk) | winners-page link + release |
| [Paste into Birdeye "Create a case"] Merge duplicate profile | not an email | paste the body into Birdeye's support case form, signed in to the current Birdeye account |

## 5. Google Business Profile (15 minutes)

https://business.google.com → C&S Plumbing of Lee. Check against the NAP
standard in `backlink-and-citation-plan.md` §1:

- **Primary phone**: decide once. Recommendation: 833-758-6248 (the site's
  tracked line) as primary, the 239 office line as additional. Whatever is
  chosen here becomes the number for every listing below.
- Address 951 Pondella Rd, North Fort Myers, FL 33903; website
  `https://www.csplumbinglee.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- Categories: Plumber (primary); Water heater installation service; Drainage
  service; Contractor. Services list: add Tankless water heater installation,
  Whole-home repipe, UEP water/sewer connection, Septic-to-sewer conversion,
  Slab leak repair.
- Description: the ≤250-character text from the NAP table. Hours Mon–Fri
  7:30–4:30, Sat 9–3, emergency line 24/7 (use "more hours" → emergency).
- Photos: add 6–10 job photos from `public/images/projects/` (already
  metadata-stripped). Q&A: seed three questions (service area, free
  estimates on installs, UEP). Post: one update a week; first one is the
  tankless page.

## 6. Listings, in this order (details and URLs in the tracker)

P0 this week: BuildZoom claim (then the draft above) · Yelp claim ·
HomeAdvisor/Angi claim and remove "does not offer warranties" (the published
warranty is one year labor and materials) · CCCIA (draft) · City of Cape
Coral UEP list (draft) · Breeze (draft) · Birdeye merge (paste).

P1 next week: create Bing Places (import from GBP), Apple Business Connect,
Nextdoor Business, BBB free profile; submit corrections at Data Axle,
Foursquare and Neustar Localeze (they feed MapQuest, Apple and the
aggregators that still show the Cape Coral addresses); Networx and MapQuest
edit requests.

Tier 2 (budget call, ≈ $3k/yr total, fees to confirm): Lee BIA, Cape Coral
Chamber, BBB accreditation, SWFL Inc.; free: Levelset, The Blue Book
ProView, Procore Network, BuildingConnected; manufacturer locators (State /
A.O. Smith first, then Rheem, Navien, Rinnai).

Mark each row in `docs/seo/citation-tracker.csv` as it is done.
