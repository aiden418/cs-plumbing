# Device-session prompt

Paste the block below into a Claude session on Aiden's Mac with browser access
(Claude desktop app with the built-in browser, or Claude in Chrome). Built
2026-11-12 from `browser-session-playbook.md`; the decisions it carries
(confirm outward actions, primary phone 833-758-6248, merge first) are Aiden's.

```text
You are working on my Mac with browser access. Use whichever browser tools this session has (the built-in browser or Claude in Chrome). I'm Aiden Pellechio, PM/Estimator at C&S Plumbing of Lee, North Fort Myers FL. Our site is https://www.csplumbinglee.com (Next.js on Vercel, GitHub repo aiden418/cs-plumbing). A cloud session finished the code work on branch `claude/compassionate-sagan-l4l1sh` and wrote your brief at `docs/seo/browser-session-playbook.md` on that branch. Your job is to run that playbook end to end in the accounts signed in on this machine.

SETUP
- If the repo is cloned here: `git fetch origin && git checkout claude/compassionate-sagan-l4l1sh && git pull`, then read docs/seo/browser-session-playbook.md, docs/seo/backlink-and-citation-plan.md (NAP standard in section 1, outreach templates in section 6) and docs/seo/citation-tracker.csv. If the repo is not here, everything you need is in this message.
- First thing: open a new tab and tell me which of these are already signed in: GitHub, Vercel, GoDaddy, Google (Search Console, Gmail, Business Profile), Yelp, Angi/HomeAdvisor, Birdeye. I'll sign in to the rest.

RULES
1. Confirm before every outward action: show me the exact email (to, subject, body) before sending, the exact DNS record changes before saving, and the pull request before merging. Everything else (reading, navigating, filling forms, claiming listings) you do without asking.
2. Logins, 2FA codes, CAPTCHAs and payment screens are mine. Stop and tell me; never type a password or card number.
3. No money: no paid memberships, no ads, no upgrades, no accreditation fees. Free profiles only.
4. At GoDaddy touch only candsplumbingfl.com. No other domain, no other records than the ones listed.
5. Never sign out of anything. Never change account settings beyond the listing data below.
6. If something fails twice or a site blocks you, write it down and move on. Don't loop.
7. Keep every tab you open until the wrap-up, then close them.

DECISIONS ALREADY MADE (don't re-ask)
- Phone everywhere: 833-758-6248. It is the only line; never add a second number (Aiden, 2026-11-14).
- Merge the branch first (step 0). The Terms effective date in the code is 2026-11-12. If today is a later date, stop before merging and tell me; I'll have the date bumped first.

NAP STANDARD (copy exactly, everywhere)
- Name: C&S Plumbing of Lee (the legal name Draft Plumbing Corp only where a legal name is required)
- Address: 951 Pondella Rd, North Fort Myers, FL 33903
- Phone: 833-758-6248
- Website: https://www.csplumbinglee.com
- Categories: Plumber (primary); Water heater installation service; Drainage service; Contractor
- Description: Family-owned plumber in North Fort Myers since 1998. New-construction plumbing for builders, plus repipes, water heaters, drains, UEP hookups and 24/7 emergency service across Cape Coral, Fort Myers and Southwest Florida. Lic. CFC1432485.
- Hours: Open 24 hours, 7 days (office staffed Mon–Fri 7:30–4:30, Sat 9–3; mention only in descriptions)
- License: CFC1432485 (CFC057076 only where a second license field exists)
- Founded: 1998

STEP 0 — PREVIEW, THEN MERGE
a. Open https://cs-plumbing-j4pyrjcbr-aiden418s-projects.vercel.app (Vercel login may be required). At phone width check: /contact has a "Photos of the problem" upload block under the description; /services/repiping shows one 3/2 figure ($6,800 – $9,500), the sentence "We patch and texture every access cut we make; painting is by others," a one-year warranty and no "Lifetime"; /services/tankless-water-heaters loads; /coastal-comeback-plan shows the arrival-season (snowbirds coming back) copy; /terms shows revision 2026-11-12. Report anything wrong before merging.
b. On https://github.com/aiden418/cs-plumbing open a pull request from claude/compassionate-sagan-l4l1sh into main. Title: "Content consistency: price sheet, claims, forms, SEO docs". Body: one paragraph: single-source price sheet (src/lib/pricing.ts) and claims module (src/lib/claims.ts) wired into every page, calculator, email and schema; build-time guard against stray prices and promises; Terms rev. 2026-11-12; company license only on marketing surfaces; homepage trimmed; seasonal snowbird copy; photo upload and customer confirmation emails on the homeowner forms; tankless page; SEO docs. Show it to me, then merge with a merge commit and keep the branch.
c. On Vercel (project cs-plumbing) wait until the production deployment is READY, then open https://www.csplumbinglee.com/services/tankless-water-heaters and confirm it is the page, not a 404.

STEP 1 — SEARCH CONSOLE: PROPERTY FOR THE OLD DOMAIN
https://search.google.com/search-console → Add property → Domain → candsplumbingfl.com. Copy the TXT verification value. Keep this tab open.

STEP 2 — GODADDY DNS (candsplumbingfl.com only)
https://dcc.godaddy.com/control/portfolio → candsplumbingfl.com → DNS. Show me this change set, then apply it on my OK:
- Forwarding section: delete the domain forward (this removes the forwarding A records 15.197.225.128 and 3.33.251.168).
- Add record: A, name @, value 216.150.1.1, TTL 600.
- Add record: A, name @, value 216.150.16.1, TTL 600.
- Add record: TXT, name @, value = the Search Console value from step 1.
- Leave the existing www CNAME (it points at Vercel) alone.
Then go back to the Search Console tab and click Verify; if it fails, retry after 10 minutes. Open https://candsplumbingfl.com in a new tab: it should land on https://www.csplumbinglee.com. If not yet, note "DNS propagating" and recheck in the wrap-up.

STEP 3 — SEARCH CONSOLE: INDEXING, EXPORT, MOVE
In the www.csplumbinglee.com property:
a. Sitemaps → submit https://www.csplumbinglee.com/sitemap.xml again.
b. URL Inspection → Request indexing, one URL at a time, in this order. Stop when the daily-quota message appears and list what is left for tomorrow:
   https://www.csplumbinglee.com/services/tankless-water-heaters
   https://www.csplumbinglee.com/services/water-heaters
   https://www.csplumbinglee.com/
   https://www.csplumbinglee.com/services/repiping
   https://www.csplumbinglee.com/services/leak-repair
   https://www.csplumbinglee.com/services/drain-cleaning
   https://www.csplumbinglee.com/services/emergency
   https://www.csplumbinglee.com/coastal-comeback-plan
   https://www.csplumbinglee.com/terms
   https://www.csplumbinglee.com/north-fort-myers-plumber
   https://www.csplumbinglee.com/plumber-lehigh-acres
   https://www.csplumbinglee.com/plumber-estero
   https://www.csplumbinglee.com/plumber-sanibel
   (The last four now redirect to /areas/<city>; "page with redirect" is the expected result.)
c. Performance → Search results → date range Last 16 months → Export → Download CSV. Save the zip in Downloads as gsc-csplumbinglee-2026-11-12.zip. If the candsplumbingfl.com property has data, export it too as gsc-candsplumbingfl-2026-11-12.zip.
d. Only if candsplumbingfl.com is verified and redirects: open that property → Settings → Change of Address → new site https://www.csplumbinglee.com → Validate and Update.

STEP 4 — GMAIL: FIVE DRAFTS
Open Gmail → Drafts. For each one: fill the recipient if it is blank, show me to/subject/body, send on my OK.
1. "Member listing update — C&S Plumbing of Lee" → the CCCIA membership contact; find the address on cccia.org (membership or contact page).
2. "Claim and correct contractor profile — C&S Plumbing of Lee (CFC1432485)" → BuildZoom support; find the address on buildzoom.com's help or contact page. Before sending, open https://www.buildzoom.com/contractor/c-s-plumbing-of-lee-inc and click Claim; complete whatever the claim flow allows.
3. "Licensed plumber listing for UEP connections — C&S Plumbing of Lee" → uepnewconst@capecoral.gov
4. "Best of Cape Coral 2026 — Best Plumbing Contractor listing" → the Cape Coral Breeze Best Of or editorial contact; find it on capecoralbreeze.com.
5. "[Paste into Birdeye "Create a case"] Merge duplicate profile" is not an email. Sign in to Birdeye, open support → Create a case, paste the draft body, submit, then delete the draft.

STEP 5 — GOOGLE BUSINESS PROFILE
https://business.google.com → C&S Plumbing of Lee. Compare every field with the NAP standard and fix differences: phone 833-758-6248 only, address, website set to https://www.csplumbinglee.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp, categories, hours (add 24/7 emergency under "more hours"), description. Services: add Tankless water heater installation, Whole-home repipe, UEP water/sewer connection, Septic-to-sewer conversion, Slab leak repair. Create one post linking https://www.csplumbinglee.com/services/tankless-water-heaters (two short sentences, no prices). Report each field as before → after.

STEP 6 — LISTINGS (claim and correct; no payments)
In this order, using the NAP standard. If a site asks for payment or a phone verification code, tell me and move on.
- Yelp: https://www.yelp.com/biz/c-and-s-plumbing-of-lee-north-fort-myers → claim; set website, hours, services, photos if allowed.
- HomeAdvisor / Angi: https://www.homeadvisor.com/rated.CSPlumbingofLee.50304107.html → claim; remove "does not offer warranties" (we publish a one-year labor and materials warranty); set the NAP.
- Bing Places: https://www.bingplaces.com → create by importing from Google Business Profile.
- Apple Business Connect: https://businessconnect.apple.com → create.
- Nextdoor Business: https://business.nextdoor.com → create.
- BBB: https://www.bbb.org → free business profile only; no accreditation.
- Data Axle, Foursquare, Neustar Localeze: submit NAP corrections (they feed MapQuest and the aggregators still showing our old Cape Coral addresses).
- Networx (https://www.networx.com/c.c-s-plumbing-of-lee-inc) and MapQuest (https://www.mapquest.com/us/florida/c-s-plumbing-of-lee-442398673): request the address correction to 951 Pondella Rd.

WRAP-UP
1. Recheck the https://candsplumbingfl.com redirect and the Search Console verification; do step 3d now if it was skipped.
2. If the repo is here: set the status column in docs/seo/citation-tracker.csv for every row you touched, add a dated "Done / blocked" section at the end of docs/seo/browser-session-playbook.md, commit on a new branch seo/browser-session-2026-11-12 and push it. Do not push to main.
3. Give me one table: step, result (done / blocked / skipped), and exactly what is left for me (logins you couldn't get past, quota leftovers, anything needing payment or a decision).
```
