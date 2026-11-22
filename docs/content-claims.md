# Prices and promises: one source each

**Rule:** a published dollar figure is written only in `src/lib/pricing.ts`; a customer-facing promise (response time, confirmation window, warranty, what a repipe includes, service-call policy, how the license is shown) is written only in `src/lib/claims.ts`. Every page, FAQ, city landing, blog post, llms.txt, OG image and the quote calculator reads from those two files.

`npm run check:claims` (also run as `prebuild`, so a stray literal fails the Vercel build) scans `src/` for `$` figures and minute-based response claims typed anywhere else. It is a ratchet against `scripts/content-claims.baseline.json`: a file may not gain literals; each cleanup pass lowers the ceiling with `node scripts/check-content-claims.mjs --baseline`.

## Adding or changing a price

1. Edit the entry in `PRICES` (`src/lib/pricing.ts`), set `checked` to today's date.
2. Use it: `range("repipe.pex3x2")` → `$6,800 – $9,500` in tables, `priceRange` and schema; `rangeInline(...)` → `$6,800–$9,500` in prose; `from`, `startingAt`, `perFoot`, `perYear`, `upcharge`, `span(low, high)` for the rest. `composed()` only wraps text built from those.
3. Never type the number. A documented historical job (case-study `cost`) or a calculator modifier may keep a literal with a trailing `// claim-ok: <reason>` comment.

## Changing a promise

Edit `CLAIMS` or `EMERGENCY_CLAIMS` in `src/lib/claims.ts`. Call sites: booking, contact and quote pages, the inline service-request form, the customer confirmation emails in `src/app/api/*`, the emergency band and page, FAQs, service and city landings, llms.txt.

## Decisions recorded 2026-11-12 (Aiden)

| Topic | Decision |
|---|---|
| Approved prices | The service-page tables (`costBreakdown`), now in `PRICES`. Chris and Sam to confirm each entry once (`checked`). |
| Repipe restoration | Patch + texture included; painting by others. Terms rev. 2026-11-12 says the same. |
| Installation warranty | One year labor + one year materials supplied by C&S; manufacturer warranties pass through. No "lifetime" or "25-year" claims. |
| Licenses | CFC1432485 only on marketing surfaces; both licenses on Terms, prequal packet, capability statement, builder print documents and the JSON-LD credential list. What the state's record showed for each (status, renewal date, the record's address) is `LICENSE_RECORD`, read on the DBPR site 2026-11-16; pages state it as a dated check, and `tests/license-record.test.ts` asks for a fresh look once the renewal date passes. |
| Service-call fee | No amount published: free estimates on installations, repipes and water heaters; repair visits carry a diagnostic fee quoted at booking. |
| Booking confirmation | Within 1 business day, usually the same day — same sentence in every form and customer email. Builder bids: acknowledged within 1 business day; no takeoff turnaround promised. |
| Response time | Typically 30–60 minutes in Cape Coral, Fort Myers and North Fort Myers; same-day elsewhere. No per-city minute claims. |
| Coastal Comeback Plan | $349 / $549 confirmed; copy flips by season (`season()`), pages revalidate daily. |
| Hybrid rebate | "Up to ~$2,000" kept; confirm with FPL / LCEC each year. |

## Open confirmations (flagged 2026-11-20, Aiden)

Nothing below has been changed on the site. Each item stays as published until the office answers.

| Item | Published now | Waiting on |
|---|---|---|
| 40-gallon electric tank, installed | `waterHeater.tank40`: $1,650 – $2,200 (approved 2026-11-12) | The office to confirm the range. One job's quote is not a public "from" price. When confirmed, edit `PRICES` and set `checked`; the header summary, pricing section, FAQs, quote builder and llms.txt follow. |
| Water heater maintenance | No price: every surface says "Request maintenance pricing" (`WATER_HEATER_MAINTENANCE` in `src/lib/water-heater-prices.ts`) | An approved public maintenance price, if the office wants one published. |
| Installation warranty on repipes | `CLAIMS.warrantyInstall`, `warrantyInstallShort`, `warrantyBullet`: one year on labor and on materials C&S supplies | Aiden (2026-11-20): the standard warranty is one year on labor, and a repipe may carry job-specific terms. Whether C&S covers repipe materials is not confirmed. Proposed wording: one-year labor warranty everywhere; on repipes, "materials coverage and any job-specific terms are written into your proposal". The Terms (clause 9.1) state one year on installation labor and materials and 30 days on repair labor, so a change here is also a Terms revision (`docs/terms-on-documents.md`). |

