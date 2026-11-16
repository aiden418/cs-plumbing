# Homeowner forms, photo upload and confirmations

Internal note. Covers `/contact` (and every `ServiceRequestForm` on the
service pages and chat widget), `/booking`, and the two API routes behind
them. The builder portal has its own upload path and is not covered here.

## What a submission does

| Step | Contact form (`/api/contact`) | Booking / estimate (`/api/booking`) |
|---|---|---|
| Validation | `serviceRequestSchema` (`src/lib/service-request.ts`) | `BookingSchema` in the route |
| Office email | `office@csplumbinglee.com`, photos attached, "Photos attached: N" line | same, plus the confirmation id in the subject |
| SMS copy | if `SMS_TO` is set | if `SMS_TO` is set |
| Customer email | "We received your request" with `CLAIMS.bookingConfirmation` and a "We received N photos" line when photos came in | "Your Booking/Estimate Request" with the same sentence and photo line |
| Tracking | Meta/Google lead events + server-side conversion (after the response) | same |

Both routes accept JSON (no photos; the chat widget always sends this) or
`multipart/form-data` (the form switches to it only when photos are
attached). `src/lib/api/attachments.ts` parses either shape; string fields
go through the same zod schema as before, files are validated and attached
as base64 (Resend's wire format). Nothing is stored on our side.

## Photo limits and why

`src/lib/photo-upload.ts` is the single source for the limits and is used by
the browser (hints, pre-submit check) and the server (hard check):

| Rule | Value | Reason |
|---|---|---|
| Files | up to 5 | enough for a leak, a fixture and a panel shot |
| Types | JPG, PNG, PDF | iPhones convert HEIC to JPG on upload when HEIC is not accepted |
| Per file / total | 4 MB / 4 MB | **Vercel rejects request bodies over 4.5 MB before our code runs** |
| Photo size | longest edge 1600 px, JPEG q0.82 | `src/lib/compress-image.ts` downscales in the browser as photos are picked, so five phone photos land around 1–2 MB in total |

A server-side rejection (wrong type, too many, too large) comes back as
`{ error, code: "attachments" }` and the form shows that message verbatim.
Any other failure shows the generic "call us" message.

## Checks every route runs before sending

In order, on `/api/contact`, `/api/booking`, `/api/quote` and
`/api/builder-portal` (the pure-math `/api/estimator` runs only the origin
check):

| Check | Where | Behaviour |
|---|---|---|
| Rate limit | `rateLimit` in `src/lib/api/secure.ts` | 5 per minute per IP, 429 with `Retry-After`. In-memory, so per warm instance; Vercel's firewall is the real throttle. |
| Same origin | `src/lib/api/origin.ts` | A browser POST whose `Origin` is another site (or `null`) gets 403. No `Origin` (curl, this harness) is allowed. |
| Schema | zod | 400 "Invalid submission" |
| Honeypot | `website` field | 200 with no email and no `eventId` |
| Attachments | `src/lib/api/attachments.ts` | Count, MIME type (JPG/PNG/PDF) and size per form; filenames sanitized. 400 `{ error, code: "attachments" }`. The builder portal uses `BUILDER_UPLOAD` (10 files, 10 MB each, 25 MB total). |
| Quote figures | `src/lib/quote-submission.ts` | `/api/quote` recomputes the estimate from the selections with the same engine as the page; the browser's `result` is ignored. |

`npm test` covers all of these (`tests/`).

## Testing delivery locally without sending mail

`scripts/resend-capture.cjs` intercepts the Resend API and writes each
would-be email to `.resend-capture.jsonl` (git-ignored):

```bash
npm run build
npm run start:capture
```

Then post a test submission from another terminal:

```bash
curl -F name="Test Homeowner" -F email="you@example.com" -F phone="2395551234" \
     -F zip="33903" -F service="leak" -F message="Under the kitchen sink" \
     -F photos=@/path/to/leak.jpg http://localhost:3000/api/contact
```

Each line of `.resend-capture.jsonl` holds one email as Resend would have
received it: `to`, `subject`, `html`, and `attachments[].filename`. The
rate limiter allows 5 submissions a minute per IP; vary the
`x-forwarded-for` header when testing more than that.

Verified 2026-11-12 with this harness: multipart with 2 PNG + 1 PDF (200,
three attachments on the office email, "We received 3 photos" in the
customer email), a `.txt` file (400 with the type message), six files (400),
JSON with no photos on both routes (200, unchanged), booking multipart with
one PNG (200, attachment on the office email), and a multipart submission
with bad fields (400 "Invalid submission" from zod).

## Known gap (not in this change)

The builder portal's upload (`src/components/builder-portal/FileUpload.tsx`
defaults, `BUILDER_UPLOAD` in `src/lib/api/attachments.ts`) still advertises
10 MB per file and 25 MB total, which Vercel's 4.5 MB request limit makes
unreachable: a builder attaching a full plan set gets a platform 413, not our
error message. Fix is either a direct-to-storage upload (Vercel Blob client
upload) or a much lower advertised cap with a "email large plan sets"
fallback line.

## Site photos: folders, `images.json` and the image manifest

Internal note on how the pictures in `public/images` reach the pages. (This
is about the site's own photos, not the photos a homeowner attaches to a
form, which the sections above cover.)

The goal is the owner-update standard: drop a photo into a folder, or replace
a file under the same name, and it shows on the site with no page code edited
and no stale cache.

### How a picture reaches a page

| Piece | What it does |
|---|---|
| `public/images/**` | The pictures. Originals are only ever read, never rewritten. |
| `public/images/<folder>/images.json` | Optional, per folder: alt text, captions, order, hidden, cover, featured (format below). |
| `src/content/media.json` | The fixed pictures by name ("slots", such as `home.hero`) and crops made from a picture. |
| `scripts/build-image-manifest.mjs` | Scans all of the above and writes `src/generated/` (git-ignored). |
| `src/generated/images.ts` | One static import per picture: `IMAGES["/images/..."]`. |
| `src/generated/images-meta.json` | Plain data: size, bytes, fingerprint, dominant colour, the settings from `images.json`, the ordered photo list of every folder, the resolved slots. |
| `src/generated/derived/` | Crops declared in `media.json` (the phone cut of the hero, logo crops). |
| `src/generated/staged/` | Byte-for-byte copies of pictures whose file name is not safe in a URL. |
| `src/lib/media.ts` | What server components call: `image()`, `collection()`, `slot()`, `imageMeta()`, `folders()`. |
| `src/lib/media-types.ts` | Types only (`MediaRef` and friends); safe to import from client components. |

Why static imports: `vercel.json` serves `/images/*` as immutable for a year
and `next/image` caches its resized copies by URL, so a file replaced under
the same name could keep showing the old picture. Next 16 also refuses a
local image URL with a query string, so `?v=hash` is not available (and
`images.localPatterns` must stay unset). A static import is served from
`/_next/static/media/<name>.<hash>.<ext>`, where the hash is of the file's
contents: replace the file and the URL changes.

Clean `/images/...` paths are still the right thing for JSON-LD, Open Graph
tags and the sitemap; every `MediaRef` carries one in `path`.

### Order of operations (fresh clone, tests, deploy)

`src/generated/` is not in git, and `src/lib/media.ts` imports it, so the
manifest has to run before TypeScript, the tests or a build can work. The
package scripts take care of that:

```
npm install       ->  postinstall: manifest (never fails the install)
npm run dev       ->  predev: manifest, then scripts/dev.mjs (next dev + watcher)
npm test          ->  pretest: manifest
npm run build     ->  prebuild: manifest -> check:claims -> check-images --gate -> next build
npm run photos    ->  both ingest scripts, then the manifest
```

Running `npx tsc --noEmit` or `npx next build` by hand on a fresh clone works
once `npm install` has finished (its `postinstall` wrote `src/generated/`).
If `src/generated/` is ever missing or stale: `npm run images:manifest`
(`--check` exits 1 when it is stale and writes nothing).

The manifest caches its measurements in `node_modules/.cache/cs-images/`,
keyed by path, size and modified time. Measured on this repository
(426 pictures, 8 SVG files, 183 MB): 1.2 s cold, 0.04 s warm.

`npm run dev` watches `public/images` and `src/content/media.json` and
re-runs the manifest about a quarter of a second after a change, so a dropped
or replaced file shows on the next refresh.

### `images.json`

One optional file per folder, beside the pictures. Keys are file names in that
folder (capital letters matter). Every field is optional, and a photo with no
entry still shows, with alt text derived from its file name.

The file sits inside `public/`, so it is itself readable on the web
(`/images/gallery/images.json`). Write nothing in it that a visitor should not
read, notes included.

```json
{
  "photo-1.jpg": {
    "alt": "White PVC drain lines laid out inside a block stem wall",
    "caption": "Underground rough-in, Cape Coral",
    "title": "Underground Plumbing Layout",
    "category": "new-construction",
    "id": "12",
    "order": 1,
    "position": "50% 30%",
    "cover": true,
    "featured": true
  },
  "photo-2.jpg": { "hidden": true },
  "_note": "an entry starting with an underscore is a note and is ignored"
}
```

| Field | Meaning |
|---|---|
| `alt` | What the photo shows, for screen readers and search. |
| `caption`, `title`, `category`, `id` | Passed through to the page data (the gallery uses all four). |
| `order` | Photos with an `order` come first, lowest number first; the rest follow in natural file-name order (`photo-2` before `photo-10`). |
| `position` | CSS `object-position` for cropped frames. |
| `hidden` | Takes the photo off every page without deleting the file. (The file is still reachable at its `/images/...` address; delete it to take it off the internet.) |
| `cover` | The card photo of a project. More than one in a project is a warning. |
| `featured` | A homepage pick. |

Mistakes fail softly:

| Mistake | What happens |
|---|---|
| The file is not valid JSON | One line naming the file, line and column. That folder's settings are skipped, its photos still publish in file-name order, the step exits 0. |
| A wrong value (`"order": "first"`) | That one setting is ignored, with a line saying so. |
| An unknown setting (`"captoin"`) | A line naming it. |
| An entry for a file that is not there | A warning; with a hint when only the capital letters differ. |
| A price or a response-time figure in `alt`, `title` or `caption` | **The manifest step fails** (exit 1) and names the file and key. Same two rules as `scripts/check-content-claims.mjs`: a dollar sign followed by a digit, or a number of min/minutes in text that also contains respon, arriv, dispatch or on-site. The text is left out of the generated data. |

### `src/content/media.json`

```json
{
  "slots": {
    "home.hero": {
      "image": "/images/hero/drone-construction.jpg",
      "alt": "...",
      "position": "50% 50%",
      "mobile": { "aspect": "4/5", "focal": [0.44, 0.5], "maxWidth": 1280 }
    }
  },
  "crops": {
    "logo.emblem": { "image": "/images/logos/logo-new.png", "box": { "left": 0, "top": 0, "width": 0, "height": 0 } }
  }
}
```

- **Slot**: a fixed picture by name. `slot("home.hero")` returns
  `{ desktop, mobile?, alt }`, or `null` when the picture is missing.
- **Phone version of a slot**: if a file named `<name>-mobile.<ext>` sits
  beside the picture, it is used for phones as it is. Otherwise, when the
  slot has a `mobile` block, the manifest cuts one: the largest box of the
  `aspect` that fits, centred on `focal` (0 to 1 from the left, 0 to 1 from
  the top), optionally shrunk to `maxWidth`. It is a crop only: no colour
  change, no sharpening, JPEG quality 90, never enlarged. It is available as
  `image("derived:home.hero.mobile")` and through `slot()`.
- **Crop**: `box` is in pixels of the upright source. A PNG crop stays a PNG
  and keeps its transparency. Available as `image("derived:<id>")`. A box with
  no size makes nothing.
- A typo in this file prints one line and leaves the slots empty, so the
  deploy gate (below) stops the build rather than publish a page without its
  hero.

### Using it in code

```tsx
// a server component
import Image from "next/image";
import { collection, image, slot } from "@/lib/media";

const hero = slot("home.hero");               // { desktop, mobile?, alt } | null
const logo = image("/images/logos/logo-new.png", { alt: "" });   // MediaRef | null
const photos = collection("projects/ifha-community-center/underground");   // MediaRef[]
const everyGalleryPhoto = collection("gallery", { deep: true });   // includes gallery/<category>/

{hero && <Image src={hero.desktop.src} width={hero.desktop.width} height={hero.desktop.height} alt={hero.alt} sizes="100vw" />}
```

- `src/lib/media.ts` is server-only (`import "server-only"`): a client
  component that imports it fails the build. Resolve the picture on the
  server and pass the `MediaRef` down as a prop.
- A missing or hidden picture is `null` (or absent from a collection), so a
  component renders nothing instead of a broken image.
- `width` and `height` are the displayed size (a phone photo's rotation flag
  is already applied).
- The blur-up placeholder is opt-in: `image(path, { blur: true })`,
  `collection(folder, { blur: true })`, `slot(id, { blur: true })`. Whatever is
  handed to `next/image` travels to the browser inside the page, and on a
  68-photo test page the placeholders alone were 60 KB, 22% of the HTML (and
  58% of the navigation payload). The design shows `color`, the photo's
  dominant colour, while a photo loads.
- SVG files are listed but not imported: their `src` is the plain
  `/images/...` path, so a replaced SVG keeps its address.
- Tests that import anything built on `media.ts` call
  `installMediaStubs()` from `tests/fixtures/media-stubs.ts` first; plain Node
  cannot import a `.jpg`.

### `npm run photos:check` and the deploy gate

`scripts/check-images.mjs` stops (exit 1) for these and only these:

1. a `/images/...` path written in `src/` for a file that is not on disk
   (capital letters count: the live site is case-sensitive, a Mac is not);
2. a slot or crop in `media.json` whose picture is missing, or a `media.json`
   that cannot be read;
3. a published picture that still carries EXIF data, which on a phone photo
   includes the GPS position of a customer's home (fix: `npm run photos:strip`);
4. a HEIC, HEIF, TIFF or PSD file inside `public/images`.

Notes that never stop a deploy: a gallery or project photo with no alt text,
files over 1.5 MB (one summary line), two covers in one project, an
`images.json` entry for a missing file, an empty photo folder.

`--gate` (what `prebuild` runs) and the default mode fail on the same things;
the default mode prints the full list of photos that still need a description.

One softening of rule 1, on purpose: a folder with an `images.json` is an
owner-managed collection, where the owner may delete a photo. A path into such
a folder that code still names is reported as a note naming the place, not as
a failure, because pages reach those photos through `image()`, which skips a
missing file. A missing picture anywhere else still stops the deploy.

### Adding photos (ingest)

```
photo-inbox/<project-slug>/<phase-slug>/   ->  public/images/projects/<slug>/<phase>/photo-N.webp
photo-inbox/gallery/<category>/            ->  public/images/gallery/<category>/<category>-N.webp
```

`npm run photos` converts everything waiting in the inbox: auto-rotate, all
metadata stripped (GPS included), at most 2400 px wide, WebP. Numbers continue
after what is already there and nothing is ever overwritten. Each new file
gets an entry in the destination folder's `images.json` with an empty `alt`
(gallery photos also get the next free `id`, an empty `title` and their
`category` from the folder), so the check lists it until someone describes it.
Originals move to `photo-inbox/_done/<same path>`.

iPhone HEIC files are converted with macOS's built-in `sips` first, because
the bundled image library cannot decode them. On another system a HEIC file is
skipped with a message and stays in the inbox.

A web-ready JPG, PNG or WebP can also be dropped straight into a folder under
`public/images`. It shows up the same way; the check will ask for a
description and will refuse it if it still carries EXIF data.

### File names

Any file name works. A name that is plain letters, digits, dots, dashes and
underscores with a lower-case ending is imported straight from `public/`.
Anything else is imported through a byte-for-byte copy with a safe name in
`src/generated/staged/` (the original is not touched, and its `/images/...`
path stays the key). Measured on Next 16.4.6 with Turbopack, which is why:

| Name | Imported directly |
|---|---|
| `IMG_4001.JPG` (upper-case ending) | The build fails: "Unknown module type". |
| `C&S Logo.png`, `paren (1), comma.jpg` (a space together with `&`, `,` or `(`) | Builds, but `next start` answers 404 for the file and for its optimized variants. |
| `photo #2.jpg` | Builds; the optimizer answers 404. |
| `50% done.jpg` | Builds; the optimizer answers 500. |
| `what?.jpg` | The build fails: the `?` is read as a query. |
| `JPEG image-4165.jpeg` (one space), `café.jpg` | Works. |

### What it costs

Measured 2026-11-16 on this repository with a temporary page that rendered
the hero, the `home.hero` slot and all 64 gallery photos through `media.ts`
(so the whole registry was imported), against the same commit without it:

| | Without the registry | With every picture imported |
|---|---|---|
| `next build`, cold | 5.8 s | 6.4 s |
| `next build`, warm | 2.9 s | 3.0 s |
| `.next/static/media` | 0.5 MB | 183.8 MB (a hashed copy of every picture) |
| `.next/static/chunks` (browser JS and CSS) | 2,468 KB | 2,468 KB |
| `.next/cache` | 99 MB | 289 MB |
| First load of a page in `next dev` | 0.3 s | 2.8 s (then 0.05 s) |

The registry stays out of the browser bundles. The price is disk and upload
size: every published picture exists twice in a deployment, once under
`/images/` and once under `/_next/static/media/`.

### Proving nothing was lost

`scripts/qa/dump-page-images.mjs` reads the prerendered HTML of a build and
lists, per route, every picture by the SHA-256 of the file behind it, whether
the page uses `/images/...`, `/_next/image?url=...` or a hashed import:

```bash
npx next build && node scripts/qa/dump-page-images.mjs --out before.json
# ...switch pages to media.ts, build again...
node scripts/qa/dump-page-images.mjs --out after.json
node scripts/qa/dump-page-images.mjs --compare before.json after.json   # exit 1 if a route lost a picture
```
