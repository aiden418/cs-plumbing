# Backlink & citation plan — 90 days

Internal working doc (not published). Written 2026-11-12. Companion files:
`keyword-map.md` (what each page should rank for) and `citation-tracker.csv`
(every listing, its status and owner).

## 0. Why this matters more than more pages

- Search Console showed **85 of 135 pages "discovered – currently not indexed"** (Oct 2026). The pages are not thin (900–1,480 words each); Google is rationing crawl on a domain with almost no authority.
- The link profile today is directories only. **No editorial link was found** from a newspaper, association, builder, supplier or manufacturer.
- Directory listings carry **three different office addresses** (951 Pondella Rd NFM; 1007/1011 SE 12th Ct Cape Coral; 2311 SE 10th Ave Unit J Cape Coral). Inconsistent NAP (name, address, phone) suppresses map-pack rank directly.
- Competitors already hold the local links: Cape Coral Plumbing (Lee BIA member, State/A.O. Smith contractor locator, Levelset, 10-year Builders Care sponsor), Coastal Plumbing Service of SWFL (Greater Fort Myers Chamber), Aztec / Premier / Edison Fort (SWFL Inc.), GOAT + Superior (Cape Coral Chamber), Franzese Plumbing (Build My Future sponsor).

**90-day targets:** every listing NAP-consistent; 15–25 new referring domains, at least 5 of them editorial or association; indexed pages from ~50 to 120+; top-3 map pack for the six head terms in `keyword-map.md` §7.

## 1. NAP standard (copy exactly, everywhere)

| Field | Value |
|---|---|
| Business name | **C&S Plumbing of Lee** (never "C & S Plumbing of Lee, Inc." on new listings; legal name Draft Plumbing Corp goes only where a legal name is asked for) |
| Address | **951 Pondella Rd, North Fort Myers, FL 33903** |
| Phone | **One primary number on every listing — the number shown on the Google Business Profile.** The site uses 833-PLUMB-IT (833-758-6248); older listings show 239 numbers. Decide once (recommendation: keep 833-758-6248 as the tracked line on the site *and* GBP, and list the 239 office line as "additional phone" where a directory allows two). |
| Website | https://www.csplumbinglee.com (with `https://www.`, no trailing slash) |
| Categories | Plumber (primary); Water heater installation service; Drainage service; Contractor (new construction) |
| Description (≤ 250 chars) | Family-owned plumber in North Fort Myers since 1998. New-construction plumbing for builders, plus repipes, water heaters, drains, UEP hookups and 24/7 emergency service across Cape Coral, Fort Myers and Southwest Florida. Lic. CFC1432485. |
| Hours | Mon–Fri 7:30–4:30, Sat 9–3, Sun closed (emergency line 24/7) |
| Founded | 1998 |
| License | CFC1432485 (and CFC057076 where a second license field exists) |

Every new entry in `PROFILES` (src/lib/constants.ts) must show this NAP before it is added to the schema `sameAs`.

## 2. Tier 1 — fix and claim what already exists (weeks 1–2, $0)

Do these before building anything new; a new link to a business with three addresses buys little.

| Listing | Found at | Problem | Action |
|---|---|---|---|
| Google Business Profile | maps.google.com/?cid=5498090134012520413 | Unknown state of categories/services/UTM | Audit against §1 and `keyword-map.md` §6; add services, photos, weekly posts, Q&A; confirm the primary phone |
| BuildZoom | buildzoom.com/contractor/c-s-plumbing-of-lee-inc | Old Cape Coral address; only CFC057076; "Draft plumbing Corp" appears as a second BuildZoom entity | Claim; set 951 Pondella; add CFC1432485; ask BuildZoom to merge the Draft Plumbing Corp entity into the C&S profile (same license) |
| CCCIA member listing | members.cccia.org/list/member/c-s-plumbing-of-lee-3110 | Address 2311 SE 10th Ave Unit J | Log in to the member portal (or email CCCIA staff) and update address + website; confirm the website field is a live link |
| Yelp | yelp.com/biz/c-and-s-plumbing-of-lee-north-fort-myers | Address correct; claim status unknown | Claim; add website, hours, services, photos |
| HomeAdvisor / Angi | homeadvisor.com/rated.CSPlumbingofLee.50304107.html | 4.7★ / 51 reviews (an asset) but profile says "does not offer warranties"; address unverified; a second HA profile `rated.CandSPlumbing.24575129` may be a duplicate | Claim both; fix the warranty flag (site states a 1-year materials warranty); set NAP; request merge of the duplicate |
| Birdeye | reviews.birdeye.com/cs-plumbing-of-lee-172502710968475 (current) and `cs-plumbing-of-lee-inc-565033664` (old, unclaimed) | Two profiles split 28+ reviews | Claim the old one and ask Birdeye support to merge into the current profile |
| Networx | networx.com/c.c-s-plumbing-of-lee-inc | "C & S Plumbing of Lee, Inc", Cape Coral 33990 | Claim/correct or request removal |
| MapQuest | mapquest.com/us/florida/c-s-plumbing-of-lee-442398673 | 1007 SE 12th Ct and a different website | Correct via MapQuest "suggest an edit" (its data comes from Foursquare/Yext feeds — fix at the aggregator too) |
| Yahoo Local | local.yahoo.com/info-236416612-… | Correct NAP | Verify website link present |
| BestProsInTown | bestprosintown.com/fl/north-fort-myers/c-s-plumbing-of-lee-/ | Correct city | Verify website link |
| Facebook | facebook.com/csplumbingoflc | Lists the site; check address/phone match §1 | Align About section |
| Data aggregators | Data Axle (Infogroup), Foursquare, Neustar/Localeze | Source of the old Cape Coral address that keeps re-propagating | Submit corrections at each (free forms); this stops MapQuest/Yahoo-type sites regenerating the old address |

New free listings to create with the §1 NAP (each is a citation; most are nofollow links, still worth it for entity confirmation):
Bing Places, Apple Business Connect, Nextdoor Business (strong in Cape Coral neighborhoods), BBB free profile (accreditation is Tier 2), Houzz, Thumbtack, Porch, Angi (if separate from HA), Alignable, Chamber of Commerce.com, Manta, Hotfrog.

## 3. Tier 2 — memberships, associations, industry profiles (weeks 3–8, ≈ $3k, fees are estimates to confirm)

These give **dofollow directory links on relevant, authoritative local domains** and put the company in front of builders. Ordered by value per dollar.

| Target | Est. annual cost | Link | Why it also pays for itself |
|---|---|---|---|
| **Lee BIA** (members.bia.net) | ~$700–1,000 | Member directory listing with website link | The builder door: Build My Future Lee County (student event, sponsors listed), Builders Care (charity arm; sponsor pages + press on fortmyers.org, eastleenews, prioritymarketing). Cape Coral Plumbing and Plumbing Solutions of SWFL are already there. |
| **BBB accreditation** | ~$500–1,000 (by headcount) | Profile with website link, A+ badge | Trust signal in the SERP; BBB profile ranks for brand searches |
| **Cape Coral Chamber** (web.capecoralchamber.com) | ~$400–600 | Member directory listing | Best of Cape Coral is a Breeze program but chamber events feed the same press; GOAT and Superior Plumbing joined in 2025 |
| **SWFL Inc.** (swflinc.com/business-directory) | ~$500 | Directory listing | Regional chamber with Aztec, Premier, Edison Fort listed |
| Greater Fort Myers Chamber (members.fortmyers.org) | ~$400–500 | Directory listing | Defer to month 3 unless budget allows; Coastal Plumbing Service is there |
| CBIA (Collier) / Charlotte-DeSoto BIA | ~$500 each | Directory | Only if Naples / Punta Gorda builder work is a real 2027 goal |

Free B2B profiles (links + bid invitations): **Levelset** (payment/lien profile; shows "no reported liens" and job history), **The Blue Book** (ProView), **Downtobid**, **Procore Construction Network**, **BuildingConnected**, **ConstructConnect** (plan room). Fill each with the capability statement PDF already on `/builders`.

Manufacturer contractor locators (dofollow link + lead routing; enroll in the contractor program, usually free with a rewards/certification step): **State / A.O. Smith Contractor Locator** (via LeadConnect / Contractor Rewards), **Rheem Find-a-Pro**, **Navien Service Specialist**, **Rinnai PRO**, **Bradford White For the Pro**, **Uponor** (if Uponor PEX is used on repipes), **Moen / Kohler** pro finders. List only brands actually installed (site says Rinnai, Navien, Rheem, A.O. Smith, Bradford White).

Government lists (citations, not links, but authoritative): Lee County licensed plumbing contractor list (leefl.gov PDF — confirm C&S appears under the current name), City of Cape Coral UEP "How to Connect" licensed-plumber list (ask the UEP office at uepnewconst@capecoral.gov how plumbers get listed; a capecoral.gov mention is the single most valuable local citation for the UEP moat).

## 4. Tier 3 — editorial, press and community links (weeks 4–12)

| Opportunity | Pitch | Target | Expected link |
|---|---|---|---|
| **Best of Cape Coral 2026** winner | Ask the Breeze for the winners listing page and confirm it links; send a 150-word release + photo for the "Best Of" coverage | Cape Coral Breeze (advertising dept; Laurie Ragle quoted in 2024 coverage) | capecoralbreeze.com |
| **North 1 East UEP explainer** | "What the plumber's side of a UEP connection actually costs and how to avoid paying twice" — timely: final assessment approved 2025-11-19, CIAC ≈ $25,538, 180-day connection window after NOA | Cape Coral Breeze, WGCU, WINK, NBC2, Gulfshore Business, Cape Coral Daily | Quote + link to the North 1 East guide page |
| **Polybutylene & Citizens** | "Repipe before the 4-point: what inspectors flag in Cape Coral homes built 1978–1995" | Royal Palm Coast Realtor Association newsletter/blog, local insurance agencies, home-inspection companies | Resource links from realtor and inspector sites |
| **Builders Care sponsorship** | Sponsor Pull the Cork (Jan) or the Charity Clay Shoot; offer an in-kind plumbing repair for a Builders Care homeowner | Lee BIA Builders Care | Sponsor page + coverage on fortmyers.org, eastleenews.com, prioritymarketing.com |
| **Habitat for Humanity Lee & Hendry** | In-kind rough-in on one build | Habitat | Partner page link |
| **Build My Future Lee County** | Master/supporting sponsor; Aiden speaks on estimating as a career | Lee BIA | Sponsor listing + press |
| **FGCU / FSW construction management** | Guest lecture on plumbing takeoffs; offer a student project (UEP calculator) | FGCU U.A. Whitaker College of Engineering, FSW | .edu mention/link from program news |
| **Builder partners** | Ask Hansen Homes, Stellar Development, Decker Homes (already on the GC logo wall) for a "trade partners" or testimonial link; offer the case-study page in return | Each builder's marketing contact | Builder sites |
| **`/partners` reciprocity** | Every company on `/partners` gets a note: "we link to you; here's our page" | Each partner | Local business sites |
| **Draft Construction** | draftconstructionswfl.com should link to csplumbinglee.com prominently (sister company; already linked from our footer) | Internal | Sister site |
| **Suppliers** | Ferguson / Winsupply branch "customer spotlight" posts occasionally link | Branch managers | Supplier blogs |
| **Unlinked mentions** | Search monthly for "C&S Plumbing of Lee" and ask for a link where it is text only | — | Various |

## 5. Tier 4 — assets built to be linked (month 2–3)

1. **UEP connection cost calculator** (`/uep-connection-cost-calculator` or inside the North 1 East guide): distance to main, septic abandonment, irrigation line, meter fee → range. Promote in Cape Coral Facebook groups, r/CapeCoral, Nextdoor; pitch to the Breeze as a sidebar.
2. **Cape Coral pipe material by year built** (table/map: polybutylene 1978–95, CPVC 2000–12, PEX after): realtors and inspectors link to it.
3. **Polybutylene & insurance guide** (Tier 3 pitch target).

## 6. Outreach templates

**A. Listing correction (association / directory)**
> Subject: Update to C&S Plumbing of Lee listing
> Hi — our listing at [URL] still shows our former Cape Coral office. We've been at 951 Pondella Rd, North Fort Myers, FL 33903 since [year]. Could you update the address, set the phone to 833-758-6248 and the website to https://www.csplumbinglee.com? Happy to send our W-9 or license (CFC1432485) if you need verification. Thanks — Aiden Pellechio, C&S Plumbing of Lee.

**B. Press pitch (UEP)**
> Subject: North 1 East homeowners: what the plumber's side of a UEP hookup really costs
> Hi [name] — with the North 1 East final assessment approved on Nov 19, several thousand Cape Coral owners will get a Notice of Availability and 180 days to connect. The city's number for the plumber's connection is $2,000–$3,000; what it covers (and the septic-abandonment and irrigation pieces people miss) isn't explained anywhere. We've done UEP hookups since North 2 and put together a plain-English guide: [URL]. Happy to walk through it or be quoted. — Aiden Pellechio, C&S Plumbing of Lee, 833-758-6248.

**C. Partner / builder reciprocal**
> Subject: Linking to you from csplumbinglee.com
> Hi [name] — we added [company] to the companies we recommend at https://www.csplumbinglee.com/partners. If you have a trade-partner or resources page, a link back to https://www.csplumbinglee.com (or to our [project page] about your job) would help both of us show up locally. Thanks — Aiden.

## 7. 90-day calendar

| Weeks | Work |
|---|---|
| 1–2 | §1 NAP decision; GBP audit; claim/fix all Tier 1 listings; data-aggregator corrections; create Bing/Apple/Nextdoor/BBB-free; fix Vercel so candsplumbingfl.com 301s; connect GSC via Supermetrics and pull baseline |
| 3–4 | Join Lee BIA + Cape Coral Chamber; BBB accreditation; Levelset/BlueBook/Downtobid/Procore profiles; enroll in State/A.O. Smith, Rheem, Navien, Rinnai contractor programs; publish the North 1 East UEP guide |
| 5–8 | Breeze "Best Of" link + release; UEP pitch to Breeze/WGCU/WINK; polybutylene/insurance guide + realtor-association pitch; `/partners` and builder reciprocal asks; SWFL Inc. |
| 9–12 | Builders Care sponsorship (next event); FGCU/FSW outreach; UEP calculator live and promoted; second GSC pull → retitle collisions, noindex zero-impression landings, add new `PROFILES` rows to `sameAs` |

## 8. KPIs and where to read them

| KPI | Source | Baseline (Nov 2026) | 90-day target |
|---|---|---|---|
| Referring domains | GSC Links report; Bing Webmaster Tools; Ahrefs Webmaster Tools (free) | ~10 directories, 0 editorial | 25+, ≥5 editorial/association |
| NAP-consistent citations | `citation-tracker.csv` | 4 of 12 correct | 100% of listed, old address nowhere |
| Indexed pages | GSC Indexing report | ~50 of 135; only 7 of 54 city landings had any impression in the 14 days to Nov 11 | 120+ |
| Map-pack rank (6 head terms) | manual check or rank tracker | map pack unknown; home page at organic position 12–17 for "plumber cape coral" | top 3 in Cape Coral + Fort Myers |
| GBP calls / direction requests | GBP Insights | — | +30% |
| Branded impressions | GSC (Supermetrics branded dimension, brand terms "c&s plumbing\|cs plumbing\|c and s plumbing") | "c&s plumbing": 40 impressions, 7 clicks, organic position 5 (14 days to Nov 11) | +25%, position 1 |
| Non-brand impressions & CTR | GSC Performance | ≈ 370 impressions/day, 0.7 % CTR; water-heater cluster 1,861 impressions / 0 clicks at position 21 | CTR ≥ 2 %; water-heater and tankless pages in the top 10 |

## 9. Do not

- Buy link packages, guest-post networks or "DA 50 backlinks". They are the fastest way to lose the rankings the work above earns.
- Mass-submit to hundreds of directories. Fifty consistent citations beat five hundred mixed ones.
- Use exact-match anchors ("plumber cape coral") in asks; "C&S Plumbing of Lee" or the URL is enough.
- Add a profile to `PROFILES` / `sameAs` before its NAP matches §1.
