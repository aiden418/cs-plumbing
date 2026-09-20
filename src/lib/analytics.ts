/**
 * Central conversion tracking.
 *
 * Every lead path on the site funnels through the helpers below so a single
 * call site reaches every destination:
 *
 *   1. Meta Pixel   — `fbq('track', ...)` with Meta's standard event names.
 *   2. OpenAI pixel — `oaiq('measure', ...)` for genuine conversions only
 *                     (see OAIQ_EVENT_MAP), deduped against the server-side
 *                     Conversions API copy by event id.
 *   3. GA4          — `gtag('event', ...)` with GA4 snake_case names.
 *   4. GTM          — a clean `dataLayer.push({ event, ... })` so marketers can
 *                     trigger Google Ads conversions and other tags.
 *
 * IMPORTANT: GA4 is loaded *directly* via gtag.js (see GoogleAnalytics.tsx).
 * Do NOT also add a GA4 configuration tag inside the GTM container — events
 * would be counted twice. GTM is here for Google Ads and third-party tags.
 */

/** Public tracking IDs. These are browser-visible by design. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1372903383968668";
export const OPENAI_PIXEL_ID = "DMBS1D5TFZstmLgAtY2XcW";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

type Params = Record<string, string | number | boolean | undefined>;

// Meta event name -> OpenAI (ChatGPT ads) standard event. Only genuine
// conversion actions are mapped; unmapped events never reach OpenAI.
const OAIQ_EVENT_MAP: Record<string, string> = {
  Contact: "lead_created",
  Lead: "lead_created",
  Schedule: "appointment_scheduled",
};

// Conversion reporting must never throw into a form's success path.
function safeCall(name: "fbq" | "oaiq" | "gtag", ...args: unknown[]) {
  try {
    window[name]?.(...args);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn(`${name} failed`, err);
  }
}

function fireGoogle(name: string, params?: Params) {
  safeCall("gtag", "event", name, params ?? {});
  try {
    window.dataLayer?.push({ event: name, ...(params ?? {}) });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("dataLayer failed", err);
  }
}

/**
 * Fire one conversion to every configured destination.
 * `meta` uses Meta's standard event vocabulary; `ga` uses GA4's.
 */
function fire(
  meta: { event: string; params?: Params },
  ga: { name: string; params?: Params },
  options?: { eventId?: string },
) {
  if (typeof window === "undefined") return;

  safeCall("fbq", "track", meta.event, meta.params);

  const oaiqEvent = OAIQ_EVENT_MAP[meta.event];
  if (oaiqEvent) {
    const args: unknown[] = ["measure", oaiqEvent, { type: "customer_action" }];
    if (options?.eventId) args.push({ event_id: options.eventId });
    safeCall("oaiq", ...args);
  }

  fireGoogle(ga.name, ga.params);
}

/**
 * Engagement that is NOT a lead (popup views, CTA clicks, funnel steps).
 * Goes to Meta as a custom event and to GA4/GTM — never to OpenAI, and never
 * as a Meta standard event, so ad platforms don't optimise toward it as if
 * it were a conversion.
 */
export function trackEngagement(name: string, params?: Params) {
  if (typeof window === "undefined") return;
  safeCall("fbq", "trackCustom", name, params);
  fireGoogle(name, params);
}

/* ── OpenAI user matching ───────────────────────────────────────────── */

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Give the OpenAI pixel a hashed identifier for the converting user so the
 * conversion can still be matched to the ad click when the first-party
 * click cookie is missing (cross-browser, in-app browser, cleared cookies).
 * Per the OpenAI Ads docs, user fields go on `oaiq("init", { user })`, never
 * on `measure`, and a follow-up init after the first does not repeat pixelId.
 * Only the normalized SHA-256 leaves the browser; raw email is never sent.
 */
export async function identifyOaiqUser(user: { email?: string }) {
  if (typeof window === "undefined" || !window.oaiq) return;
  const email = user.email?.trim().toLowerCase();
  if (!email || !globalThis.crypto?.subtle) return;
  try {
    const email_sha256 = await sha256Hex(email);
    safeCall("oaiq", "init", { user: { email_sha256 } });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("oaiq identify failed", err);
  }
}

/* ── Contact clicks ─────────────────────────────────────────────────── */

// tel: and sms: clicks are tracked once, sitewide, by the document-level
// listener in MetaPixel.tsx. Do not also attach these to a link's onClick or
// the click reports twice on every platform.
export function trackPhoneClick() {
  fire(
    { event: "Contact", params: { content_name: "Phone Call", content_category: "Lead" } },
    { name: "phone_click", params: { method: "tel_link" } },
  );
}

export function trackTextClick() {
  fire(
    { event: "Contact", params: { content_name: "Text Message", content_category: "Lead" } },
    { name: "text_click", params: { method: "sms_link" } },
  );
}

// Email clicks are softer intent than a call or text: GA4/GTM + a Meta custom
// event only, so they don't count as leads on the ad platforms.
export function trackEmailClick() {
  trackEngagement("email_click", { method: "mailto_link" });
}

/* ── Form conversions ───────────────────────────────────────────────── */

export interface ConversionOptions {
  /** Submitter email; hashed client-side and sent on init, never on measure. */
  email?: string;
  /**
   * Id the server used for its Conversions API copy of this conversion.
   * Passed as the pixel's `event_id` so OpenAI dedupes browser + server.
   */
  eventId?: string;
}

/**
 * Shared path for form conversions. The server issues `eventId` only when it
 * actually delivered the inquiry; a honeypot-tripped submission returns
 * success without one. No id, no conversion event, on any platform.
 *
 * Every form lead is a GA4 `generate_lead`; `lead_source` tells them apart.
 */
async function trackFormConversion(
  meta: { event: string; params: Params },
  leadSource: string,
  opts?: ConversionOptions,
) {
  if (!opts?.eventId) return;
  if (opts.email) await identifyOaiqUser({ email: opts.email });
  fire(meta, { name: "generate_lead", params: { lead_source: leadSource } }, opts);
}

/**
 * Call only after the server has confirmed the inquiry was delivered.
 * Pass the submitter's email (when the form collects one) so the OpenAI
 * pixel can match the conversion; it is hashed before leaving the browser.
 */
export function trackContactForm(opts?: ConversionOptions) {
  return trackFormConversion(
    { event: "Lead", params: { content_name: "Contact Form", content_category: "Service Request" } },
    "contact_form",
    opts,
  );
}

export function trackChatLead(opts?: ConversionOptions) {
  return trackFormConversion(
    { event: "Lead", params: { content_name: "Chat Widget", content_category: "Service Request" } },
    "chat_widget",
    opts,
  );
}

export function trackQuoteBuilder(opts?: ConversionOptions) {
  return trackFormConversion(
    { event: "Lead", params: { content_name: "Quote Builder", content_category: "Quote Request" } },
    "quote_builder",
    opts,
  );
}

/** Booking-page "estimate request": a lead, not a scheduled appointment. */
export function trackEstimateRequest(opts?: ConversionOptions) {
  return trackFormConversion(
    { event: "Lead", params: { content_name: "Estimate Request", content_category: "Quote Request" } },
    "estimate_request",
    opts,
  );
}

export function trackBooking(opts?: ConversionOptions) {
  return trackFormConversion(
    { event: "Schedule", params: { content_name: "Booking Form", content_category: "Service Booking" } },
    "booking_form",
    opts,
  );
}

/* ── Funnel steps (engagement, not leads) ───────────────────────────── */

/** Fired once, when the visitor begins interacting with the booking flow. */
export function trackBookingStart(requestType: string) {
  trackEngagement("booking_start", { request_type: requestType });
}

/** Fired on each successful advance through the booking wizard. */
export function trackBookingStep(step: number, stepName: string, requestType: string) {
  trackEngagement("booking_step", { step_index: step, step_name: stepName, request_type: requestType });
}

export function trackQuoteStart(service: string) {
  trackEngagement("quote_start", { service });
}

export function trackQuoteStep(step: number, service: string) {
  trackEngagement("quote_step", { step_index: step, service });
}

/** Cost estimator: a calculation only, not yet a lead. */
export function trackEstimatorUse(service: string) {
  trackEngagement("estimator_use", { service });
}

/* ── Builder / GC paths ─────────────────────────────────────────────── */

// The builder-portal route has no server-side conversion copy yet, so there
// is no event id to gate on; the caller fires this only after `res.ok`.
export function trackPlanUpload(fileCount: number) {
  fire(
    { event: "Lead", params: { content_name: "Builder Plan Upload", content_category: "Builder" } },
    { name: "generate_lead", params: { lead_source: "builder_portal", file_count: fileCount } },
  );
}
