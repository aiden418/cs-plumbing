# Builder door — internal checklist (not published)

Facts the site deliberately does **not** show until confirmed, plus items
still owed by the owner. Each row names where the value lives. Never publish
a placeholder in its place.

## Owner decisions already applied (Sep 2026)

| Topic | Published wording | Where |
|---|---|---|
| Founding | Founded 1998 in Cape Coral by brothers Chris and Sam with their father; "Family owned and operated since 1998" | sitewide |
| Project counts | 9,500+ new construction homes plumbed; 3,500+ homes repiped — owner-reported, kept separate, never combined | `BUSINESS.homesCompleted`, `BUSINESS.repipesCompleted` |
| Contractor ranking | "Top 5% of Florida licensed contractors on BuildZoom" — third-party, linked, checked 2026-09-29 | `CONTRACTOR_RANKING` in constants.ts |
| Per-phase turnaround | No durations. "Phase schedules are coordinated with your superintendent…" | `PHASE_SCHEDULE_NOTE` |
| Capacity | No homes/month or crew count. "Contact our estimating team to discuss upcoming starts…" | `SCHEDULING_NOTE` |
| Coverage | "Southwest Florida, from Port Charlotte through Naples" (coverage, not permit jurisdictions) | `SERVICE_COVERAGE` |
| Warranty | One-year warranty on materials supplied by C&S, per written project terms. Not labor, not manufacturer, not customer-supplied fixtures | `WARRANTY` in constants.ts |
| Legal name | Draft Plumbing Corp, d/b/a C&S Plumbing of Lee (owner-stated 2026-11-03), on the Terms, prequal packet and schema; brand stays C&S Plumbing of Lee | `BUSINESS.legalName` |
| Licenses | CFC1432485 is the company's current license since the 2023 reorganization as part of Draft Construction; CFC057076 is Samuel Pellechio's original license (owner-stated 2026-11-03). Both stay on formal documents | `BUSINESS.license`, `BUSINESS.license2` |
| Qualifications | $2M GL, workers' comp, bonding on request, OSHA-30, 100% self-performed, AIA G702/G703, Procore/Textura | `QUALIFICATIONS` |
| Removed | EMR (none exists — do not list as outstanding), commercial auto / umbrella, drug testing, all bid-turnaround day counts, OSHA-10 wording | — |

## Still needed from the owner

| Item | Where it goes | Notes |
|---|---|---|
| W-9 exact legal-name match | prequal packet "Legal name" row, Terms clause 1.1 | Owner states Draft Plumbing Corp; an older Sunbiz record reads C & S PLUMBING OF LEE, INC. Confirm the signed W-9 and the DBPR record for CFC1432485 match Draft Plumbing Corp |
| BuildZoom profile housekeeping | external | Profile still shows the former Cape Coral address (1011 SE 12th Ct) and only CFC057076; claim/update it so the linked source matches the site |
| Production `ADMIN_EMAIL` | Vercel env | Intended destination is office@csplumbinglee.com (code default). Not verified: `vercel login` then `vercel env ls production` |
| Production bid-form test | /builders#bid after deploy; /builder-portal today | Owner submits a labeled test; confirm admin email, SMS gateway copy, and submitter confirmation arrive |
| Hangar 97 completion date | `COMPLETED_PROJECTS[hangar-97].completedOn` | Marked Completed per owner; date unset. Trim/final phases not photographed — confirm performed before listing |
| Case-study facts | `COMPLETED_PROJECTS[].caseStudy` | Fixture counts, schedule vs. plan, inspection results for Hansen 1210 trim-out and Hangar 97 — omitted until supplied |
| Permission to name builders in case studies | `caseStudy.builder.permission` | Hansen Homes and Stellar Development set to `false` → hidden in the case-study block. The existing project titles/client fields already name them (pre-existing content) — decide whether that stays |
| Homeowner warranty wording | residential/commercial service pages | Pre-existing "Warranty on all workmanship" (residential) and "Warranty on all installations" (commercial) are broader than the confirmed builder wording; repipe pages state a 1-year labor + manufacturer PEX warranty. Confirm or align |
| Permit jurisdictions (unverified, unpublished) | — | City of Cape Coral; Lee County (incl. Lehigh Acres, North Fort Myers); City of Fort Myers; Village of Estero; City of Bonita Springs; Town of Fort Myers Beach; City of Sanibel; City of Punta Gorda; Charlotte County; Collier County / City of Naples |

## Deploying a preview

- Vercel project: `cs-plumbing` under the team "aiden418's projects" (`prj_gqGm7unjOGUpRSCVshwcixPShANV`, team `team_TfHhocFdrWW121iFXwR98ePn`) — this is the project that holds the production domains (checked 2026-11-12 through the Vercel API; the `prj_NP9J…` / `team_l3HW…` IDs previously noted here belong to a different account and do not serve the site). Production domain `www.csplumbinglee.com`; `metadataBase`, canonicals and the sitemap all use it.
- Secondary domains on the same project, all 308 redirects to `www.csplumbinglee.com`: `csplumbinglee.com`, `www.candsplumbingfl.com` (added 2026-11-10) and `candsplumbingfl.com` (added 2026-11-12). A redirect only works once DNS points the host at Vercel: on 2026-11-12 the apex `candsplumbingfl.com` still had GoDaddy forwarding A records (15.197.225.128 / 3.33.251.168), so at GoDaddy either point the apex A record to `76.76.21.21` and remove the forwarding, or keep GoDaddy forwarding and make sure it is a permanent (301) unmasked forward to `https://www.csplumbinglee.com`. Never let either host serve a copy of the site — Google indexed `www.candsplumbingfl.com/contact` as a duplicate.
- GitHub: `aiden418/cs-plumbing`, production deploys from `main`. Feature branches (`claude/*`) get Vercel preview URLs when the Git integration is connected.
- The Vercel CLI token on this Mac is expired. To let the assistant deploy previews or read env vars: run `npx vercel login` in a terminal, complete the browser prompt, then `npx vercel env ls production` and `npx vercel deploy` work.
- `ADMIN_EMAIL` (production) must be `office@csplumbinglee.com`; the code default is the same, so an unset variable is also correct.

## Regenerating the PDFs

    npm run build && npx next start -p 3010 &
    npm run builders:pdf -- http://localhost:3010
