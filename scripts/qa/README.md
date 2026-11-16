# QA harness

Scripts that check and measure the built site in the installed Chrome, with no npm
packages: Node 24 (global `fetch` and `WebSocket`) drives Chrome over the DevTools
protocol on a throwaway profile, the way `scripts/build-builder-pdfs.mjs` shells out
to Chrome. They exist so a "before" and an "after" of the redesign can be compared
with numbers instead of impressions.

| Script | Question it answers |
|---|---|
| `routes.mjs` | Which routes and redirects did the last build produce? |
| `snapshot.mjs` | What content does every built page serve? |
| `diff-snapshots.mjs` | Did anything get lost or changed between two snapshots? |
| `capture.mjs` | What do these pages look like, full length, at these viewports? |
| `vitals.mjs` | How fast and how heavy is a page load, cold and warm? |
| `sweep.mjs` | Is every built page intact at phone and desktop width? |
| `print-check.mjs` | Do the printable documents still print the same? |
| `selftest.mjs` | Does the harness itself still catch planted faults? |

## Before you run anything

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=off npx next build
OPENAI_ADS_CONVERSIONS_API_KEY= SMS_GATEWAY_TO= npx next start -p 3111 -H 127.0.0.1
```

- Run the scripts from the project root: they read the route list from `.next`
  (`--next-dir` points elsewhere). Use a port other than 3000 and stop the server when
  you are done.
- Chrome is looked up at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`;
  set `CHROME_PATH` for another location.
- Every script prints its options with `--help`. A wrong flag or a missing argument
  exits 2 with a one-line message.
- Compare like with like: both builds with the same `NEXT_PUBLIC_GA_MEASUREMENT_ID`, a
  blank `GOOGLE_PLACES_API_KEY`, and in the same season (the "arrival" / "departure"
  copy switches between April and May and between October and November).

## What the harness will not do

- **No analytics or ad tag reaches its vendor.** On every page, and every frame and
  worker it starts, the Meta, OpenAI and Google tag hosts are blocked with
  `Network.setBlockedURLs`; Chrome is also started with those hosts unresolvable; and
  each launch proves the blocking with a self-test before any page loads. Attempts are
  recorded, so a result can say "2 attempted, 2 blocked, 0 got through". The hosts:
  `connect.facebook.net`, `www.facebook.com`, `facebook.com/tr`, `bzrcdn.openai.com`,
  `bzr.openai.com`, `www.googletagmanager.com`, `google-analytics.com`,
  `googleads.g.doubleclick.net`, `googleadservices.com`, `doubleclick.net` (each with
  its subdomains).
- **No form is submitted and nothing is clicked.** These scripts only load pages. Form
  tests need `npm run start:capture`, which writes emails to a file instead of sending.
- Other third parties are not blocked: `/service-map` loads its Google Maps embed.

Every result records `navigator.webdriver` (it is `true`), the user agent
(`HeadlessChrome`) and `navigator.connection.effectiveType`.

## routes.mjs

```
node scripts/qa/routes.mjs                # pages, file routes, on-demand handlers, redirects
node scripts/qa/routes.mjs --pages        # one page path per line
node scripts/qa/routes.mjs --files        # robots.txt, sitemap.xml, llms.txt, …
node scripts/qa/routes.mjs --redirects    # "308 /home -> /"
node scripts/qa/routes.mjs --json
node scripts/qa/routes.mjs --next-dir path/to/.next
```

Reads `.next/prerender-manifest.json`, `.next/routes-manifest.json` and
`.next/app-path-routes-manifest.json`: every static page and every page prerendered
from `generateStaticParams`, whether or not the sitemap lists it. The other scripts
import `loadRoutes()` from it.

## snapshot.mjs

```
node scripts/qa/snapshot.mjs --base http://localhost:3111 --out snapshot.json
```

| Option | Meaning |
|---|---|
| `--base URL` | origin of the running build (required) |
| `--out FILE` | snapshot JSON to write (required) |
| `--next-dir DIR` | build output to read the route list from (default `.next`) |
| `--site ORIGIN` | production origin whose absolute URLs count as internal (default `https://www.csplumbinglee.com`; repeatable) |
| `--routes LIST` | only these page paths |
| `--rendered auto\|all\|none` | also read the rendered DOM: `auto` (default) only for routes whose server HTML leaves a section to the browser |
| `--no-og-images` | skip requesting each route's og:image / twitter:image |
| `--concurrency N` | parallel requests (default 6) |

For every built page it GETs the raw server HTML and parses it with `DOMParser` in a
blank Chrome page: none of the page's scripts run and nothing is requested. Recorded
per route: HTTP status, title, meta description, canonical, robots and googlebot,
every `og:*` and `twitter:*` tag, each H1 (text, and the text with whitespace
removed), the H2/H3 outline, every JSON-LD block parsed with its keys sorted, element
ids, internal links by region (header / main / footer / other) with their text,
external links, `tel:` / `sms:` / `mailto:` links, images (the underlying source
decoded from `/_next/image?url=…`, plus alt), videos, posters, CSS background images
and iframes, the text blocks of `<main>` (h1–h6, p, li, td, th, dt, dd, summary,
figcaption, label, button, a, blockquote, legend, caption, option, and text that sits
in none of these), the text of the site header and footer, preload counts, and how
many sections are client-only.

Also recorded: the 404 page; the bytes (SHA-256, and the text when it is text) of
`robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `manifest.webmanifest` and
the icons; for every redirect in the build the observed status, `Location` and the
status of its target; and for every og:image / twitter:image URL the status, type and
SHA-256 of what it returns.

A route with a client-only section (today `/quote-builder`: its wizard is not in the
server HTML) is additionally loaded in the browser, tags blocked, and its rendered
text, links, ids and images are stored under `rendered`.

It prints warnings for anything odd (not HTTP 200, no `<main>`, not exactly one H1 in
the HTML, missing title / description / canonical, JSON-LD that does not parse) and
stores them in the file. Exit 0 unless it could not finish.

## diff-snapshots.mjs

```
node scripts/qa/diff-snapshots.mjs BEFORE.json AFTER.json --md report.md
```

| Option | Meaning |
|---|---|
| `--md FILE` | readable report, counts first |
| `--json FILE` | the full diff, machine-readable |
| `--strict` | also fail when something that had to stay was removed |
| `--list N` | items listed per section of the report (default 150; the JSON has all) |

**Must be equal on every route** (a difference exits 1): HTTP status, title,
description, canonical, robots / googlebot, every og:* and twitter:* tag, the H1s
compared with whitespace removed, every JSON-LD block. Also `robots.txt`,
`sitemap.xml`, `llms.txt`, `llms-full.txt` and the manifest byte for byte, every
redirect's status and `Location`, every social image still being an image, and no
route may disappear.

**Must still be present on the same route** (additions are fine; each removal is
listed with the routes it vanished from; exits 1 only with `--strict`): every text
block of `<main>`, every internal and external link href, every `tel:` / `sms:` /
`mailto:` target, every element id, every image and media source, and the header and
footer text.

Tolerated on purpose, and listed under "For information" so nothing is hidden:

- an og:image / twitter:image URL whose only change is Next's `?hash` suffix (it
  changes whenever the social image file is edited);
- text whose words are all still in the page's `<main>` but in different markup;
- `tel:` / `sms:` links that reach the same number in another notation
  (`tel:8337586248` and `tel:+18337586248`);
- an image now served from `/_next/static/media/<name>.<hash>.<ext>`;
- ids generated by React (`_R_…`);
- the Meta `<noscript>` beacon;
- H1 text that differs only in spacing, image alt text that changed, the H2/H3
  outline, other meta tags (viewport, keywords), preload counts, new routes, and
  re-rendered icons or social images.

Exit codes: 0 nothing that must be equal changed, 1 a must-equal rule was broken (or,
with `--strict`, something was removed), 2 bad arguments or an unreadable file.

## capture.mjs

```
node scripts/qa/capture.mjs --base http://localhost:3111 --out shots \
  --routes /,/about,/contact --viewports desktop,mobile
```

| Option | Meaning |
|---|---|
| `--base URL`, `--out DIR` | required |
| `--routes LIST` | comma separated paths; a query string is allowed (`"/?intro=1"`) |
| `--routes-file FILE` | one path per line (`#` starts a comment) |
| `--all` | every built page (`--next-dir`, default `.next`) |
| `--viewports LIST` | `desktop` = 1440x900 @1x; `mobile` = 390x844 @2x with mobile and touch emulation. Default: both |
| `--widths LIST` | extra widths, e.g. `320,768,1920`. Below 768: phone emulation @2x, 812 tall; otherwise 900 tall @1x |
| `--sizes LIST` | extra `WIDTHxHEIGHT` sizes, e.g. `844x390` (a phone held sideways is emulated as a phone) |
| `--height N` | height for `--widths` |
| `--dpr N` | device pixel ratio for every viewport |
| `--reduced-motion` | emulate `prefers-reduced-motion: reduce`; files get a `-reduced-motion` suffix |
| `--format jpeg\|png`, `--quality N` | default JPEG, quality 80 |
| `--fold` | also save the first screen alone, before any scrolling (`…--fold.jpg`) |
| `--show-coupon` | leave the coupon pop-up armed. By default `localStorage["cs-coupon-seen"]` is set so it stays closed |
| `--storage LIST` | extra localStorage entries, `key=value`; the value `now` becomes the current time in ms |
| `--settle MS` | wait after scrolling back to the top (default 600) |
| `--timeout MS` | load timeout (default 45000) |
| `--concurrency N` | pages in parallel (default 2) |

Files are named `<route>--<viewport>.jpg`: `home--desktop.jpg`,
`services_water-heaters--mobile.jpg`, `home--w320.jpg`, `home~intro-1--mobile.jpg`.
Next to them, `capture.json` and `capture.md` list for every capture the HTTP status,
the document `scrollHeight`, whether `scrollWidth` exceeds the viewport, the image
size, lazy images that never loaded, console errors and tag requests. Running it
again into the same folder adds to that index.

How a capture is taken: load, wait for the network to go quiet and fonts to be ready,
scroll to the bottom in steps and back to the top so lazy images load and scroll
reveals fire, wait, then capture the whole page from scroll position 0 with the
viewport at its real size. So a `100vh` hero is one screen tall, and fixed or sticky
chrome appears once, where it sits on the first screen. A section that is pinned
while scrolling shows as it is before the pin starts (its spacer is blank).

Exit 1 when a page could not be captured or a tag request got through.

## vitals.mjs

```
node scripts/qa/vitals.mjs --base http://localhost:3111 --out vitals.json \
  --routes /,/about --viewports desktop,mobile \
  --cpu 4 --network fast4g --throttle mobile --cold 5 --warm 3
```

| Option | Meaning |
|---|---|
| `--base URL`, `--out FILE.json`, `--routes LIST` | required. The Markdown table is written next to the JSON (`FILE.md`) unless `--md` names it |
| `--viewports LIST` | `desktop`, `mobile`, a width, or `WxH`. Default `desktop,mobile` |
| `--cold N`, `--warm M` | runs per route and viewport (default 5 and 3) |
| `--cpu RATE` | CPU slowdown, e.g. 4 (`Emulation.setCPUThrottlingRate`) |
| `--network fast4g\|slow4g` | `Network.emulateNetworkConditions`. `fast4g` keeps `effectiveType` at `4g`; `slow4g` reports `3g`, which makes the site skip the hero video |
| `--throttle LIST` | viewports that `--cpu` and `--network` apply to (default: all) |
| `--reduced-motion`, `--storage LIST` | as in `capture.mjs` |
| `--settle MS` | read the page this long after its load event (default 5000) |
| `--timeout MS` | load timeout (default 60000) |
| `--render FILE.json` | rebuild the Markdown table from an earlier result; nothing is measured |

A cold run gets a new browser context (empty cache, storage and sockets) on an origin
this browser has never used: `c1.localhost:PORT`, `c2.localhost:PORT`, … (the base
must be a localhost origin for that; otherwise the same origin is reused and the
report says so). Warm runs open another tab in the context and origin of the last
cold run, so the HTTP cache is primed. Runs are strictly one at a time.

Recorded per run, by a probe installed before any page script: TTFB, DOMContentLoaded
and load; first contentful paint; the final largest-contentful-paint entry (time,
size, URL, element tag / id / class, and that resource's transfer size) with all
earlier candidates; cumulative layout shift (largest burst, plain total, and the
elements that moved); long tasks (count, longest, total, and the sum of each task's
time beyond 50 ms); resources by kind (document, js, css, font, img, video, other:
count, transfer size, encoded body size), first-party and third-party, plus the same
weights as bytes on the wire from the network log; the JavaScript the HTML itself
references as opposed to chunks requested later; the largest images on the first
screen and when each finished downloading; DOM element count; every
`performance.mark` named `intro:*` or `video:*`; and which path ran: the value of
`<html data-intro>`, and `video` or `still` for the hero.

The Markdown table shows the median with (min–max), one block per viewport, cold and
warm. Tag hosts are blocked, so tag scripts weigh nothing in these numbers.

Chrome does not count an image that fills the whole viewport as a largest-contentful-
paint candidate. Where a hero does that, the LCP entry is some small element; read
the "largest image on the first screen" columns instead.

Exit 1 when a run failed, a page was not HTTP 200, or a tag request got through.

## sweep.mjs

```
node scripts/qa/sweep.mjs --base http://localhost:3111 --out sweep
```

| Option | Meaning |
|---|---|
| `--base URL`, `--out PREFIX` | required; writes `PREFIX.md` and `PREFIX.json` |
| `--next-dir DIR` | build output to read the page list from (default `.next`) |
| `--routes LIST` | only these paths instead of every built page |
| `--widths LIST` | default `375,1440` (below 768: phone emulation @2x) |
| `--expect-tags any\|none` | `any` (default): tag requests may be attempted; they are blocked and counted. `none`: for a tags-off build, an attempted tag request fails the page |
| `--storage LIST` | localStorage entries to set before load |
| `--concurrency N` | pages in parallel (default 4) |
| `--timeout MS` | load timeout (default 45000) |

Each page is loaded, scrolled to the bottom and back, and must pass all of:

| Check | Fails when |
|---|---|
| `status` | the document is not HTTP 200 |
| `console` | there is a `console.error`, a browser error log entry or an uncaught exception |
| `request` | a first-party request fails or returns 4xx / 5xx |
| `overflow` | `scrollWidth` exceeds the viewport; the widest offending elements are named |
| `image` | an `<img>` has loaded with `naturalWidth` 0. Lazy images that never came on screen are forced to load first |
| `h1` | the number of visible `<h1>` elements is not exactly one |
| `tag leak` | a tag request got past the block |
| `tag request` | (only with `--expect-tags none`) a tag request was attempted |

Content that is wider than the viewport but clipped by `html` / `body` is a warning,
not a failure. The report gives counts first, then every failure, then a table of all
routes with the page height at each width. Exit 1 when any page fails.

## print-check.mjs

```
node scripts/qa/print-check.mjs --base http://localhost:3111 --out print-before.json
node scripts/qa/print-check.mjs --compare print-before.json print-after.json --md print-diff.md
```

| Option | Meaning |
|---|---|
| `--base URL`, `--out FILE.json` | required for a check |
| `--routes LIST` | default `/builders/capability-statement,/builders/prequal-packet,/terms` |
| `--pdf-dir DIR` | also keep the printed PDFs |
| `--timeout MS` | load timeout (default 45000) |
| `--compare A B` | compare two results; `--md FILE` writes the comparison as Markdown |

For each document it prints with `Page.printToPDF` (CSS page size, backgrounds on, no
browser header or footer) and reads the PDF back: page count, paper size, and the
text on every printed page. That includes what exists only on paper, such as the
Terms' "Page 2 of 13" footer, and it shows which pages are blank apart from a running
header or footer. Then, with print media emulated, it records the visible text lines
and whether any site chrome is still visible: the site header or nav and footer
(those outside `<main>`), anything `position: fixed`, any open dialog.

A check exits 1 when a document is not HTTP 200, shows site chrome in print, has a
blank page, or its text could not be read. `--compare` exits 1 when a page count or
paper size changed, printed text or print-media text was lost or changed (compared
ignoring whitespace), the page-number footers changed, a new blank page appeared, or
site chrome is visible in the second result.

## selftest.mjs

```
node scripts/qa/selftest.mjs --port 3111
```

Stop the site first if it is using that port. The script starts its own throwaway
server on `127.0.0.1:PORT` with small pages, each broken in one known way, runs
`sweep.mjs`, `capture.mjs`, `print-check.mjs` and `vitals.mjs` against them, and
checks that each reports exactly what was planted: broken images (visible, and lazy
inside a hidden block), two H1s, an invisible H1, sideways overflow, a console error
and an uncaught exception, a failed request, an HTTP 500, tag requests (blocked and
counted, and failing under `--expect-tags none`), a 20,000 px page stitched into one
image of that height, a three-sheet document read back sheet by sheet with its page
footers, chrome left visible in print, a blank last page, and a planted layout shift,
long task and `intro:` / `video:` marks. It takes about half a minute; exit 0 when
all 49 expectations hold. Run it after changing anything in `scripts/qa`, and after a
Chrome update.

## The library

`lib/chrome.mjs` is the driver the scripts share:

```js
import { launchChrome } from "./lib/chrome.mjs";

const browser = await launchChrome();
try {
  const page = await browser.newPage({ width: 390, height: 844, deviceScaleFactor: 2, mobile: true, touch: true });
  const nav = await page.goto("http://localhost:3111/", { waitUntil: "networkidle" });   // { status, finalUrl, idle, ms }
  const title = await page.evaluate(() => document.title);
  await page.steppedScroll();
  await page.screenshot({ path: "home.jpg", fullPage: true });
  console.log(page.report());   // console errors, failed first-party requests, tag attempts
  await page.close();
} finally {
  await browser.close();        // browser.kill() does the same synchronously; both remove the profile folder
}
```

- `launchChrome({ headless, args })` starts Chrome with `--headless=new
  --remote-debugging-port=0`, a profile folder under the system temp directory, and
  the flags that keep it quiet; reads the DevTools URL from stderr; and removes the
  profile when it closes, is killed, or the script exits or is interrupted.
- `newPage({ width, height, deviceScaleFactor, mobile, touch, reducedMotion,
  cpuThrottle, network, blockTagHosts = true, extraHeaders, userAgent, media,
  browserContextId })`. Each page gets its own browser context (cookies, storage and
  cache of its own) unless `browserContextId` shares one made with
  `browser.newContext()`.
- A page has `goto(url, { waitUntil: "load" | "domcontentloaded" | "networkidle",
  timeout })`, `evaluate(functionOrExpression, args)`, `addInitScript`,
  `seedLocalStorage`, `emulateMedia`, `setViewport`, `steppedScroll`, `layoutMetrics`,
  `screenshot({ path, fullPage, format, quality })`, `pdf`, `env()`, `close()`, and
  the logs `page.console`, `page.errors` and `page.requests`, with
  `consoleErrors()`, `failedFirstPartyRequests()`, `tagAttempts()`, `tagLeaks()` and
  `report()` on top of them.
- `launchChrome({ allowTagHosts: true })` together with
  `newPage({ blockTagHosts: false })` is the only way to let a tag host answer. It is
  meant for weighing a build that carries placeholder tag ids, never one with real
  ids, and no script here uses it.

`lib/extract.mjs` is the content extraction the snapshot runs inside the page,
`lib/pdf.mjs` reads Chrome's PDFs (page count, paper size, text per page), and
`lib/util.mjs` holds argument parsing and small helpers.

## Things worth knowing

- A single Chrome screenshot taller than 16,384 device pixels silently repeats the
  top of the page below that line. Full-page captures are therefore taken in tiles of
  8,192 device pixels and stitched; the result is one image up to 65,535 pixels tall
  (beyond that it is scaled down, and `scale` in `capture.json` says by how much).
- Each screenshot makes Chrome send the page one `resize` event (the window size it
  reports does not change).
- "Network idle" means the page itself has had nothing in flight for half a second.
  Media streams and requests made inside a cross-origin iframe do not count.
- Everything runs in Chrome on this machine. Safari, iOS and Firefox are not covered.
- Timings from an unthrottled local server are only good for comparing with another
  run on the same machine; sizes and counts are exact.

## Baseline

The "before" of the redesign, taken with these scripts from the unmodified site, is
in `.redesign/baseline/` (git-ignored); `baseline-notes.md` there says how each file
was made and what it shows.
