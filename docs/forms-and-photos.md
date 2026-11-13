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
defaults, `src/app/api/builder-portal/route.ts`) still advertises 10 MB per
file and 25 MB total, which Vercel's 4.5 MB request limit makes unreachable:
a builder attaching a full plan set gets a platform 413, not our error
message. Fix is either a direct-to-storage upload (Vercel Blob client
upload) or a much lower advertised cap with a "email large plan sets"
fallback line.
