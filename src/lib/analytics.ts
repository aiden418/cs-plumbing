/**
 * Central conversion tracking.
 *
 * Every lead path on the site funnels through the helpers below so a single
 * call site reaches all three destinations:
 *
 *   1. Meta Pixel  — `fbq('track', ...)` with Meta's standard event names.
 *   2. GA4         — `gtag('event', ...)` with GA4 snake_case names.
 *   3. GTM         — a clean `dataLayer.push({ event, ... })` so marketers can
 *                    trigger Google Ads conversions and other tags.
 *
 * IMPORTANT: GA4 is loaded *directly* via gtag.js (see GoogleAnalytics.tsx).
 * Do NOT also add a GA4 configuration tag inside the GTM container — events
 * would be counted twice. GTM is here for Google Ads and third-party tags.
 */

/** Public tracking IDs. These are browser-visible by design. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1372903383968668";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

type Params = Record<string, string | number | boolean | undefined>;

/**
 * Fire one conversion to every configured destination.
 * `meta` uses Meta's standard event vocabulary; `ga` uses GA4's.
 */
function fire(
  meta: { event: string; params?: Params },
  ga: { name: string; params?: Params },
) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", meta.event, meta.params);
  }
  if (window.gtag) {
    window.gtag("event", ga.name, ga.params ?? {});
  }
  if (window.dataLayer) {
    window.dataLayer.push({ event: ga.name, ...(ga.params ?? {}) });
  }
}

/**
 * Low-level escape hatch, kept for call sites that already speak Meta's
 * vocabulary. Prefer a named helper below — they carry GA4 names too.
 */
export function trackEvent(event: string, params?: Params) {
  const name = (params?.content_name ?? event)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  fire({ event, params }, { name, params });
}

/* ── Contact conversions ────────────────────────────────────────────── */

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

export function trackContactForm() {
  fire(
    { event: "Lead", params: { content_name: "Contact Form", content_category: "Service Request" } },
    { name: "generate_lead", params: { lead_source: "contact_form" } },
  );
}

/* ── Booking funnel ─────────────────────────────────────────────────── */

/** Fired once, when the visitor begins interacting with the booking flow. */
export function trackBookingStart(requestType: string) {
  fire(
    { event: "InitiateCheckout", params: { content_name: "Booking Start", content_category: requestType } },
    { name: "booking_start", params: { request_type: requestType } },
  );
}

/** Fired on each successful advance through the booking wizard. */
export function trackBookingStep(step: number, stepName: string, requestType: string) {
  fire(
    { event: "AddToCart", params: { content_name: `Booking Step ${step}: ${stepName}` } },
    { name: "booking_step", params: { step_index: step, step_name: stepName, request_type: requestType } },
  );
}

export function trackBooking(requestType?: string) {
  fire(
    { event: "Schedule", params: { content_name: "Booking Form", content_category: "Service Booking" } },
    { name: "booking_submit", params: { request_type: requestType ?? "booking" } },
  );
}

/* ── Quote builder ──────────────────────────────────────────────────── */

export function trackQuoteStart(service: string) {
  fire(
    { event: "InitiateCheckout", params: { content_name: "Quote Builder Start", content_category: service } },
    { name: "quote_start", params: { service } },
  );
}

export function trackQuoteStep(step: number, service: string) {
  fire(
    { event: "AddToCart", params: { content_name: `Quote Step ${step}`, content_category: service } },
    { name: "quote_step", params: { step_index: step, service } },
  );
}

export function trackQuoteBuilder() {
  fire(
    { event: "Lead", params: { content_name: "Quote Builder", content_category: "Quote Request" } },
    { name: "generate_lead", params: { lead_source: "quote_builder" } },
  );
}

/* ── Builder / GC paths ─────────────────────────────────────────────── */

export function trackPlanUpload(fileCount: number) {
  fire(
    { event: "Lead", params: { content_name: "Builder Plan Upload", content_category: "Builder" } },
    { name: "generate_lead", params: { lead_source: "builder_portal", file_count: fileCount } },
  );
}

/* ── Cost estimator (calculation only, not yet a lead) ──────────────── */

export function trackEstimatorUse(service: string) {
  fire(
    { event: "ViewContent", params: { content_name: "Cost Estimator", content_category: service } },
    { name: "estimator_use", params: { service } },
  );
}
