# Homeowner forms, photo upload and confirmations

Internal note. Covers `/contact` (and every `ServiceRequestForm` on the
service pages and chat widget), `/booking`, and the two API routes behind
them. The builder portal's plan-set upload has its own section at the end.

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

## Builder portal: plan sets (direct-to-Blob upload)

Covers the "Submit plans for a bid" form (`BuilderBidForm` on `/builders#bid`
and the new-construction city pages) and the four-step `/builder-portal`
wizard. Both post to `/api/builder-portal`.

Plan sets are PDFs of 5-30 MB, so they cannot ride along in the request the
way homeowner photos do: a Vercel Function rejects bodies over 4.5 MB with a
platform 413 before our code runs. Instead:

1. The browser asks `/api/builder-portal/upload` for a client token and the
   `@vercel/blob/client` SDK puts each file straight into Vercel Blob
   (`src/lib/upload-plans.ts`). The token carries the limits: PDF, JPG or
   PNG, 50 MB per file, a random suffix, deletion after 30 days (`ttlDays`).
2. The form then posts JSON with the blob URLs: `files: [{ url, name, size }]`.
3. The route accepts only URLs in **our** store (hostname pinned to the store
   id inside `BLOB_READ_WRITE_TOKEN`) under `builder-portal/`, fetches the
   files and attaches them when the set is 15 MB or less. Larger sets, and
   any file that cannot be fetched, arrive as links. Links are always in the
   office email with a "30 days" note; the builder's confirmation lists the
   filenames.

`src/lib/plan-upload.ts` is the single source for the limits, used by the
browser (hints, pre-submit check, blob pathname) and the server (token
constraints, URL validation):

| Rule | Value | Reason |
|---|---|---|
| Files | up to 10 | unchanged |
| Per file | 50 MB | full architectural sets; enforced in the token and on the server |
| Per submission | 200 MB | ten 20 MB files |
| Attached to the office email when the set is | 15 MB or less | base64 makes 15 MB about 20 MB on the wire: under Resend's 40 MB email cap and under the inbound limit of common office mailboxes. Raise to 25 MB if the office mailbox is Google Workspace |
| Types | PDF, JPG, PNG | enforced in the token and on the server |
| Retention | 30 days, then Blob deletes the file | token `ttlDays`; no cleanup code |

**Messages.** A file problem comes back as `{ error, code: "attachments" }`
and both forms show it verbatim, as they do a `PlanUploadError` from the
browser helper (upload failed, too many uploads, uploads unavailable).
Anything else shows the generic "call us" message. The wizard no longer uses
`alert()`.

**Without a Blob store** (`BLOB_READ_WRITE_TOKEN` unset): the token route
answers 503 with `code: "uploads-unavailable"`, the forms show that message
with a "Send request without plans" button, and the submission still goes
through. A submission that names files anyway gets 400 `attachments`.

**Abuse surface.** There is no login, so anyone can request tokens. What
bounds it: the token limits above, 30 token requests a minute per IP, an
Origin check, and the 30-day expiry. Set a spend alert on the Vercel team.

**Old tabs.** A multipart body (a page loaded before this change) gets 400
"Please reload the page and try again."

### Testing the builder portal locally

The same harness stands in for Blob storage: a GET of
`https://<store>.public.blob.vercel-storage.com/builder-portal/<name>` is
served from `BLOB_FIXTURE_DIR` (default `.blob-fixtures`, git-ignored) by
basename, and `start:capture` sets a dummy token
(`vercel_blob_rw_localstore_capture`, store id `localstore`) unless
`BLOB_READ_WRITE_TOKEN` is already set. Set it to an empty string to exercise
the degraded path.

```bash
mkdir -p .blob-fixtures
head -c $((4*1024*1024)) /dev/urandom > .blob-fixtures/lot-12-plans-a1b2c3.pdf
npm run build && npm run start:capture
```

```bash
curl -H 'content-type: application/json' http://localhost:3000/api/builder-portal -d '{
  "name":"Test Builder","company":"Test Homes LLC","email":"you@example.com",
  "phone":"2395551234","community":"Cape Coral Unit 42","source":"builders-hub",
  "files":[{"url":"https://localstore.public.blob.vercel-storage.com/builder-portal/lot-12-plans-a1b2c3.pdf",
            "name":"Lot 12 Plans.pdf","size":4194304}]}'
```

The token route takes the same body the SDK sends:

```bash
curl -H 'content-type: application/json' http://localhost:3000/api/builder-portal/upload \
  -d '{"type":"blob.generate-client-token","payload":{"pathname":"builder-portal/lot-12-plans.pdf","clientPayload":null,"multipart":false}}'
```

The browser upload itself cannot run offline (the SDK puts the file to
`vercel.com/api/blob`), so the end-to-end check mocks that one request in
Playwright and lets the preflight, the token route, the JSON submission and
the harness run for real.

Verified 2026-11-12 with this harness:

- JSON with no files (200; office and confirmation emails captured).
- Three files, 12 MB in total (200; three attachments under their original
  names, three links, retention note). Two files, 20 MB in total (200; no
  attachments, two links, "over the 15 MB attachment limit"). A file declared
  as 1 MB whose blob is 16 MB (200; "could not be attached", link). A blob
  that 404s (200; link only).
- A URL in another store, a `..` path, a query string, a declared size over
  50 MB and a declared total over 200 MB (400 with the builder-facing message
  and `code: "attachments"`, nothing captured). Eleven files and malformed
  JSON (400 "Invalid submission"). A multipart body (400 reload message). A
  filled honeypot (200, nothing captured). The sixth request in a minute (429).
- Token route: a valid request returns a client token whose payload carries
  `ttlDays: 30`, the 50 MB cap, the three content types and the random
  suffix; an `.exe` pathname, a `..` pathname and an upload-completed event
  (400); a foreign Origin (403); the 31st request in a minute (429); the GET
  probe (`{ ok: true }`).
- Degraded mode (empty token): GET and POST on the token route (503
  `uploads-unavailable`), a submission with files (400 `attachments`), a
  submission without files (200).
- Browser (Playwright, Blob put mocked, everything else real): the bid form on
  `/builders` shows "Uploading plans (1 of 1)" with a progress bar and a
  disabled drop zone, then "Uploaded" and "Sending", then "Plans received",
  and the captured office email carries the attachment and the link. The
  wizard reaches "Quote Request Submitted"; a forced 500 shows the inline
  error instead of an alert, and the retry reuses the uploaded blob rather
  than uploading again. In degraded mode both forms show the
  uploads-unavailable message and "Send request without plans" completes.

Not verified here: a real upload against a live Blob store, multipart uploads
over 20 MB, and delivery of the attachment through the office mailbox. Those
are the owner's production test (see `docs/builder-door-checklist.md`).
