# Homeowner forms, photo upload and confirmations

Internal note. Covers `/contact` (and every `ServiceRequestForm` on the
service pages and chat widget), `/booking`, and the two API routes behind
them. The two builder forms upload plan sets differently; see "Builder plan
uploads" at the end.

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
| Attachments | `src/lib/api/attachments.ts` | Count, MIME type (JPG/PNG/PDF) and size per form; filenames sanitized. 400 `{ error, code: "attachments" }`. The builder portal uses `BUILDER_UPLOAD` (10 files, 10 MB each, 25 MB total) as its server ceiling; the browser stops a plan set sooner (see "Builder plan uploads"). |
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

Verified 2026-11-16 the same way on `/api/builder-portal` (`SMS_GATEWAY_TO`
blank, so no SMS copy): the wizard's fields with one PDF and one PNG (200
with an `eventId`; office email with both attachments and a reply-to, plus
the confirmation to the builder), the bid form's fields with no files (200),
`website=qa` (200, no email, no `eventId`), a `.txt` file (400 with
`code: "attachments"`), an 11 MB PDF (400, the server ceiling), bad fields
(400), a foreign `Origin` (403) and a sixth request in a minute from one
address (429). A send Resend refuses cannot be produced with this harness;
`tests/builder-portal-route.test.ts` covers it with a stub.

## Builder plan uploads

The Builder Portal wizard (`/builder-portal`) and the short bid form
(`BuilderBidForm`, on `/builders` and the new-construction city pages) both
post multipart to `/api/builder-portal`, with plan files under `files`.

Plan files go up exactly as picked (a plan PDF cannot be downscaled the way a
phone photo is), so the whole selection has to fit under the same 4.5 MB
request limit:

| Where | Rule |
|---|---|
| Browser: `src/lib/plan-upload.ts`, `FileUpload` with `maxTotalBytes` | Up to 10 files, 4 MB in total (`PLAN_SET_MAX_BYTES`, which is `PHOTO_UPLOAD.maxBytesTotal`, not a second number). The hint states it. A selection that would pass it is refused when it is chosen, with a message offering to email large plan sets to `BUSINESS.email` and submit the request without them. |
| Server: `BUILDER_UPLOAD` in `src/lib/api/attachments.ts` | 10 files, 10 MB each, 25 MB total, JPG/PNG/PDF. In production the platform limit is reached first, so only a local run gets this far. |

If the platform refuses a request anyway, the answer is its own 413, which
does not carry our JSON. Both forms tolerate a body that is not JSON and show
their generic "call us" line; a server message is shown verbatim only for
`code: "attachments"`.

The office email goes through `sendEmailOrThrow` like the other routes: a
send Resend refuses is a 500 with no `eventId`, the builder sees an inline
error instead of the success screen, and no `builder_lead` event fires. The
SMS copy and the builder's confirmation are best effort.

Still open: a direct-to-storage upload (Vercel Blob client upload) would let
a full plan set through the form instead of by email.
