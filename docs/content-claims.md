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
| Licenses | CFC1432485 only on marketing surfaces; both licenses on Terms, prequal packet, capability statement, builder print documents and the JSON-LD credential list. |
| Service-call fee | No amount published: free estimates on installations, repipes and water heaters; repair visits carry a diagnostic fee quoted at booking. |
| Booking confirmation | Within 1 business day, usually the same day — same sentence in every form and customer email. Builder bids: acknowledged within 1 business day; no takeoff turnaround promised. |
| Response time | Typically 30–60 minutes in Cape Coral, Fort Myers and North Fort Myers; same-day elsewhere. No per-city minute claims. |
| Coastal Comeback Plan | $349 / $549 confirmed; copy flips by season (`season()`), pages revalidate daily. |
| Hybrid rebate | "Up to ~$2,000" kept; confirm with FPL / LCEC each year. |
