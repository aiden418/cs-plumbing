# Keyword map — www.csplumbinglee.com

Internal working doc (not published; `docs/` is outside the site build).
Written 2026-11-12 from the site inventory, competitor SERPs and third-party
volume estimates. **Replace every estimate with Search Console data as soon
as the Supermetrics GSC source is connected** (see "Measurement").

## 1. What the demand actually looks like

| Query | Market | Est. monthly searches | Est. CPC | Source |
|---|---|---|---|---|
| plumber near me | Fort Myers | ~1,185 | ~$21 | homeservicebase.com |
| plumber near me | Cape Coral | ~650 | — | homeservicebase.com |
| fort myers plumber | Fort Myers | ~720 | ~$34 | seobandwagon.com (DataForSEO) |
| plumbing | Fort Myers / Cape Coral | ~505 / ~275 | — | homeservicebase.com |
| drain cleaning | Fort Myers | ~145 | — | homeservicebase.com |
| water heater replacement fort myers | Fort Myers | ~25 | — | homeservicebase.com |
| All home-services queries | Fort Myers–Cape Coral metro | ~11,960 | — | seobandwagon.com |

Estimates disagree with each other and none is dated; treat them as order-of-magnitude only.

What they do show:

1. **The volume is in "plumber near me" and "{city} plumber".** Those are map-pack queries. The Google Business Profile, review velocity and citation consistency decide them, not the 54 city pages.
2. **Service + city long tail is small** (tens of searches a month each). Fifty-four such pages split a thin pie, and Google only indexes them once the domain has authority. Backlinks come first; the pages are already written.
3. **Nobody local owns the niches below.** Franchise competitors (Roto-Rooter, Benjamin Franklin, Mr. Rooter) run generic city pages; Repipe Specialists owns "repipe" but says nothing about UEP, septic-to-sewer or builder work.

## 2. Strategy in one paragraph

Win the map pack for the Lee County core (Cape Coral, Fort Myers, North Fort Myers, Lehigh Acres) with GBP + citations + reviews. Own four moats where intent is high and competition is weak: **Cape Coral UEP connections**, **polybutylene repipes driven by insurance**, **septic-to-sewer conversions**, and **new-construction plumbing for builders**. Keep every other city page indexed but stop expecting it to rank until the domain has links.

## 3. Clusters → owning page

Rule: **one page owns one primary query.** Secondary pages may mention it but must not carry it in the title. Where two pages collide, GSC decides which keeps the query (the one with impressions) and the other is retitled.

| # | Cluster | Primary queries | Owning page | Current title | Action |
|---|---|---|---|---|---|
| 1 | Plumber + city (map pack) | plumber cape coral · plumber fort myers · plumber north fort myers · plumber lehigh acres | `/areas/<city>` + GBP | "Plumber in Cape Coral, FL \| C&S Plumbing of Lee" | Done: 4 duplicate `plumber-<city>` landings now 301 to `/areas/<city>`. Home now owns "plumber in cape coral & fort myers". |
| 2 | Emergency plumber + city | emergency plumber cape coral · 24 hour plumber fort myers | `/emergency` (core) · `/emergency-plumber-<city>` | "24/7 Emergency Plumber Cape Coral & Fort Myers \| C&S Plumbing" (new) | `/emergency` owns the two core cities; city pages own the rest. |
| 3 | Repipe / polybutylene / cast iron | repipe cape coral · polybutylene pipe replacement cape coral · whole house repipe cost fort myers · cast iron pipe replacement cape coral | `/services/repiping` (hub) · `/repiping-<city>` · blog `whole-home-repipe-cost-cape-coral`, `polybutylene-pipe-problems-cape-coral` | "Whole-Home Repiping \| Cape Coral & Fort Myers" | **Watch-list:** hub and `/repiping-cape-coral` both target "repiping cape coral". If GSC shows the hub ranking, retitle the city page to the cost angle ("Repipe Cost Cape Coral …"); if the city page ranks, retitle the hub to "Whole-Home Repiping in Southwest Florida". Add a **cast iron drain replacement** page (gap). |
| 4 | Water heaters | water heater replacement cape coral · tankless water heater installation fort myers · water heater repair near me | `/services/water-heaters` · `/water-heater-repair-<city>` · blog | "Water Heater Install & Repair \| Cape Coral" | Add a **tankless** page or section targeting "tankless water heater installation cape coral / fort myers" (gap; Navien/Rinnai install is a differentiator). |
| 5 | UEP / septic-to-sewer (moat) | cape coral uep plumber · uep connection cost cape coral · septic to sewer conversion north fort myers · septic abandonment cape coral | `/services/uep-utilities` · `/uep-connection-cape-coral` · `/septic-to-sewer-north-fort-myers` · blog `septic-to-sewer-conversion-swfl` | "UEP Hookup Cape Coral \| Water, Sewer & Septic" | Strong already. Add the **North 1 East guide** (gap, timely) and keep it updated as Notices of Availability go out (~end 2027). |
| 6 | New construction (B2B) | new construction plumbing contractor fort myers · plumbing subcontractor cape coral · plumber for builders swfl | `/builders` · `/services/new-construction` · `/new-construction-plumbing/<city>` · `/plumbing-subcontractor-swfl` | "New Construction Plumbing for Builders \| …" | Volume is tiny; value is high. Links from Lee BIA, CCCIA, Levelset, BlueBook matter more than copy. Add a **Lehigh Acres spot-lot builder** angle (gap). |
| 7 | Slab leak / leak detection | slab leak repair cape coral · leak detection fort myers · slab leak insurance florida | `/services/leak-repair` · `/leak-repair-<city>` · blog `slab-leak-detection-southwest-florida`, `slab-leak-insurance-florida` | "Leak Detection & Repair \| Cape Coral & Fort Myers" | Fine. Promote the insurance post (it is the linkable one). |
| 8 | Drain cleaning | drain cleaning cape coral · hydro jetting fort myers · sewer camera inspection | `/services/drain-cleaning` · `/drain-cleaning-<city>` | "Drain Cleaning Services \| Cape Coral & Fort Myers Plumber" | Fine. |
| 9 | Water quality | water softener installation cape coral · well water treatment lehigh acres · sulfur smell well water | `/services/water-softeners` · `/water-softeners-<city>` · blog | "Water Softener Installation \| Cape Coral & Fort Myers" | Add **well water** wording to the Lehigh/North Fort Myers pages (now on the area hubs). |
| 10 | Remodel plumbing | bathroom remodel plumber cape coral · kitchen plumbing fort myers | `/services/plumbing-remodel` · `/plumbing-remodel-<city>` | "Kitchen & Bath Plumbing Remodels \| Cape Coral" | Fine. |
| 11 | Commercial | commercial plumber fort myers · backflow testing cape coral · grease trap service | `/services/commercial` · `/commercial-plumbing-<city>` | "Commercial Plumbing Services" | Title has no geo: use "Commercial Plumber Cape Coral & Fort Myers \| C&S Plumbing". |
| 12 | Brand | c&s plumbing of lee · cs plumbing lee · c and s plumbing cape coral | `/` · GBP | — | Brand searches are the leading indicator that offline marketing and PR are working; track them in GSC separately (Supermetrics "branded vs non-branded" dimension). |

## 4. Content gaps worth building (in priority order)

| Priority | Page | Target queries | Angle / why it will earn links |
|---|---|---|---|
| 1 | **Cape Coral North 1 East UEP homeowner guide** (new page under `/services/uep-utilities/` or blog + landing) | north 1 east uep · cape coral uep assessment 2025 · uep connection deadline · uep plumber cost | Final assessment approved 2025-11-19; CIAC ≈ $25,538 per parcel; developed properties must connect within 180 days of the Notice of Availability (construction completes ~end 2027). Nobody local explains the plumber's side (what $2–3k covers, septic abandonment, irrigation mandatory in the Mid-Hawthorn area). Update as the city mails NOAs. Pitch to Cape Coral Breeze / WGCU. |
| 2 | **Polybutylene, Citizens and the 4-point inspection** (blog + section on `/services/repiping`) | polybutylene pipes insurance florida · citizens insurance polybutylene · 4 point inspection plumbing fail · repipe for insurance | Citizens will not write poly-B homes; carriers require 4-point inspections at 20–30 years. Realtors and insurance agents link to a clear guide. Existing posts `polybutylene-pipe-problems-cape-coral` and `slab-leak-insurance-florida` are the base. |
| 3 | **Cast iron drain replacement vs. lining, Cape Coral 1970s–80s homes** | cast iron pipe replacement cape coral · sewer line replacement fort myers · cast iron drain lining cost | Competitors (Zoom Drain) push lining; a plumber that explains when replacement beats lining wins the comparison query. |
| 4 | **Tankless water heater installation, Cape Coral & Fort Myers** | tankless water heater installation cape coral · navien installer fort myers · rinnai tankless cape coral | Ties to manufacturer locators (Navien, Rinnai) which also give links. |
| 5 | **UEP connection cost calculator** (interactive, linkable asset) | uep connection cost · how much to connect to city sewer cape coral | Inputs: distance to main, septic abandonment, irrigation. Calculators get linked from Facebook groups, Reddit, Breeze articles. |
| 6 | **Cape Coral pipe material by year built** (map or table) | what pipes does my house have · polybutylene years cape coral · cpvc homes 2004 | Linkable from realtor blogs and inspection companies. |
| 7 | **Lehigh Acres new-construction plumbing for spot-lot builders** (strengthen `/new-construction-plumbing/lehigh-acres`) | spot lot builder plumber lehigh acres · plumbing subcontractor lehigh acres | Lehigh is the most active spot-lot market in Lee County. |

## 5. Title rules (applied to home, `/emergency`, `/services/residential` this pass)

- ≤ 60 characters, primary keyword first, city second, brand last.
- Use `title: { absolute }` when the page's own title already carries the geo; the layout template adds " | C&S Plumbing of Lee" (22 chars) otherwise.
- One H1 per page, matching the title's intent, not a slogan.
- **Stop maintaining `metadata.keywords`.** Google ignores the tag; it costs editing time on every page. Leave the arrays in place (harmless) but do not add to them.

## 6. Google Business Profile keyword alignment (do this with the citation work)

- Primary category: **Plumber**. Secondary: *Water heater installation service*, *Drainage service*, *Repair service* only if they exist in GBP's list; never add categories the business does not serve.
- Services list: mirror the 10 service hubs by name (Emergency plumbing, Repiping, Water heaters, Drain cleaning, Leak detection, Water softeners, Remodel plumbing, UEP hookup, Commercial plumbing, New construction plumbing).
- Website link on the profile → home page with `?utm_source=google&utm_medium=organic&utm_campaign=gbp`; "Appointment" link → `/booking`.
- Weekly GBP post: one job photo + one sentence + one link to the matching city page. Posts carry the keyword into the profile.
- Q&A: seed the five questions the site already answers in llms.txt ("Do you offer 24/7 emergency plumbing?", "How much does repiping cost in Cape Coral?", UEP, septic-to-sewer, new construction).

## 7. Measurement

- **Source of truth:** Google Search Console via Supermetrics (data source `GW`). Pull monthly: query × page × impressions/clicks/position, last 16 months; Indexing report ("discovered – currently not indexed" count).
- **Track monthly:** indexed pages (target: 135 → 120+ within 90 days of the link work); impressions for clusters 1, 3, 5, 6; map-pack rank for *plumber cape coral*, *plumber fort myers*, *plumber north fort myers*, *emergency plumber cape coral*, *repipe cape coral*, *uep plumber cape coral* (check from a Cape Coral / Fort Myers location or with a rank tracker); branded impressions.
- **Decision rules:** a landing with 0 impressions after 90 days of link work → set `indexing: "noindex"` (keeps the page for ads/direct traffic) or redirect it into its area hub; a hub/city collision → retitle the loser per §3.
