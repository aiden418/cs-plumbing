// Google Ads Search account 518-102-8884; copied from its conversion setup.
export const GOOGLE_ADS_ID = 'AW-16467696873';
const GOOGLE_ADS_SERVICE_LEAD = `${GOOGLE_ADS_ID}/wFO8CMD-hKcdEOm5tKw9`;

export const META_PIXEL_ID = '1372903383968668';
export const OPENAI_PIXEL_ID = 'DMBS1D5TFZstmLgAtY2XcW';
/**
 * GA4 Measurement ID for the "csplumbinglee.com" web stream (stream id
 * 11283145335) in the csplumbingoflee Analytics account, property
 * 490981318 — read from GA Admin → Data Streams on 2026-10-21. Public, like
 * the pixel ids above. NEXT_PUBLIC_GA_MEASUREMENT_ID overrides it (inlined
 * at build time, so a Vercel change needs a redeploy); set it to "off" to
 * disable the tag without a code change.
 */
const GA_DEFAULT_ID = 'G-2V9GN3FQ5B';
const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GA_MEASUREMENT_ID = gaEnv === 'off' ? '' : gaEnv || GA_DEFAULT_ID;

/**
 * Review-mode switch for the three browser tags (GA4 + Google Ads, Meta,
 * OpenAI), read from NEXT_PUBLIC_ANALYTICS. Like the GA id above it is
 * inlined at build time, so it has to be set when `next build` runs; setting
 * it only for `next start` does not turn the tags off.
 *
 *   unset / anything else   'on'           the real tags, exactly as in production
 *   off                     'off'          no tag and no beacon is rendered, so
 *                                          fbq / oaiq / gtag never exist and the
 *                                          conversion helpers below have nothing
 *                                          to call
 *   placeholder             'placeholder'  the tags load as in production, but
 *                                          with the fake ids below
 *
 * Only those two words change anything (letter case and surrounding spaces
 * are ignored). A missing, empty or unrecognised value is 'on', so the live
 * site can only be silenced on purpose.
 */
export type AnalyticsMode = 'on' | 'off' | 'placeholder';

export function analyticsMode(value: string | undefined): AnalyticsMode {
  const word = value?.trim().toLowerCase();
  if (word === 'off') return 'off';
  if (word === 'placeholder') return 'placeholder';
  return 'on';
}

export const ANALYTICS_MODE = analyticsMode(process.env.NEXT_PUBLIC_ANALYTICS);

/** The ids a tag loader renders with. `ga` is '' when GA itself is off. */
export interface TagIds {
  ga: string;
  googleAds: string;
  meta: string;
  openai: string;
}

/**
 * Stand-ins for placeholder mode: shaped like each vendor's real id, and
 * plainly not one. They let a build pull the vendors' scripts so their
 * weight can be measured without the tags reporting to the real properties.
 * It is a measuring mode, not a test mode: the conversion helpers below are
 * the same in every mode and still name the real Google Ads conversion, so
 * forms are only ever test-submitted with the tags off.
 */
export const PLACEHOLDER_TAG_IDS: TagIds = {
  ga: 'G-0000000000',
  googleAds: 'AW-00000000000',
  meta: '0000000000000000',
  openai: 'PLACEHOLDER00000000000',
};

/**
 * What the loaders in src/components/analytics render with: null when the
 * tags are off, the fake ids in placeholder mode, otherwise `real` untouched.
 * NEXT_PUBLIC_GA_MEASUREMENT_ID=off (an empty `ga`) holds in every mode.
 */
export function tagIds(mode: AnalyticsMode, real: TagIds): TagIds | null {
  if (mode === 'off') return null;
  if (mode === 'placeholder') {
    return { ...PLACEHOLDER_TAG_IDS, ga: real.ga ? PLACEHOLDER_TAG_IDS.ga : '' };
  }
  return real;
}

/**
 * The loaders read their ids from here and nowhere else. The conversion
 * helpers below and the server-side Conversions API keep using the real
 * constants above in every mode.
 */
export const TAG_IDS = tagIds(ANALYTICS_MODE, {
  ga: GA_MEASUREMENT_ID,
  googleAds: GOOGLE_ADS_ID,
  meta: META_PIXEL_ID,
  openai: OPENAI_PIXEL_ID,
});

// Meta event name -> OpenAI (ChatGPT ads) standard event. Only genuine
// conversion actions are mapped; unmapped events stay Meta-only.
const OAIQ_EVENT_MAP: Record<string, string> = {
  Contact: 'lead_created',
  Lead: 'lead_created',
  Schedule: 'appointment_scheduled',
};

// Meta event name -> GA4 event. Same rule as OAIQ_EVENT_MAP: conversions
// only. `generate_lead` is a GA4 recommended event; the other two are custom
// names chosen to read clearly in GA4's Events report.
const GA_EVENT_MAP: Record<string, string> = {
  Contact: 'contact',
  Lead: 'generate_lead',
  Schedule: 'book_appointment',
};

// Conversion reporting must never throw into a form's success path.
function safeFbq(...args: unknown[]) {
  try {
    window.fbq?.(...args);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('fbq failed', err);
  }
}

function safeOaiq(...args: unknown[]) {
  try {
    window.oaiq?.(...args);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('oaiq failed', err);
  }
}

function safeGtag(...args: unknown[]) {
  try {
    window.gtag?.(...args);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('gtag failed', err);
  }
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
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
  if (typeof window === 'undefined' || !window.oaiq) return;
  const email = user.email?.trim().toLowerCase();
  if (!email || !globalThis.crypto?.subtle) return;
  try {
    const email_sha256 = await sha256Hex(email);
    safeOaiq('init', { user: { email_sha256 } });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('oaiq identify failed', err);
  }
}

export interface ConversionOptions {
  /** Submitter email; hashed client-side and sent on init, never on measure. */
  email?: string;
  /**
   * Id the server used for its Conversions API copy of this conversion.
   * Passed as the pixel's `event_id` so OpenAI dedupes browser + server.
   */
  eventId?: string;
}

export function trackEvent(
  event: string,
  params?: Record<string, string>,
  options?: { eventId?: string }
) {
  if (typeof window === 'undefined') return;
  safeFbq('track', event, params);
  const oaiqEvent = OAIQ_EVENT_MAP[event];
  if (oaiqEvent) {
    const args: unknown[] = ['measure', oaiqEvent, { type: 'customer_action' }];
    if (options?.eventId) args.push({ event_id: options.eventId });
    safeOaiq(...args);
  }
  const gaEvent = GA_EVENT_MAP[event];
  if (gaEvent) {
    safeGtag('event', gaEvent, {
      ...(params ?? {}),
      ...(options?.eventId ? { event_id: options.eventId } : {}),
    });
  }
}

// tel: clicks are tracked once, sitewide, by the document-level listener in
// MetaPixel.tsx. Do not also attach this to a tel: link's onClick or the
// click reports twice (two Meta "Contact" + two OpenAI "lead_created").
export function trackPhoneClick() {
  trackEvent('Contact', { content_name: 'Phone Call', content_category: 'Lead' });
}

export function trackTextClick() {
  trackEvent('Contact', { content_name: 'Text Message', content_category: 'Lead' });
}

/**
 * Shared path for form conversions. The server issues `eventId` only when it
 * actually delivered the inquiry; a honeypot-tripped submission returns
 * success without one. No id, no conversion event, on either platform.
 */
async function trackFormConversion(
  metaEvent: string,
  params: Record<string, string>,
  opts?: ConversionOptions
) {
  if (!opts?.eventId) return;
  if (opts.email) await identifyOaiqUser({ email: opts.email });
  trackEvent(metaEvent, params, opts);
  // Only confirmed service inquiries reach this path. Deduplicate retries
  // with the server-issued ID; never send customer contact details to Ads.
  safeGtag('event', 'conversion', {
    send_to: GOOGLE_ADS_SERVICE_LEAD,
    transaction_id: opts.eventId,
  });
}

/**
 * Call only after the server has confirmed the inquiry was delivered.
 * Pass the submitter's email (when the form collects one) so the OpenAI
 * pixel can match the conversion; it is hashed before leaving the browser.
 */
export function trackContactForm(opts?: ConversionOptions) {
  return trackFormConversion('Lead', { content_name: 'Contact Form', content_category: 'Service Request' }, opts);
}

export function trackQuoteBuilder(opts?: ConversionOptions) {
  return trackFormConversion('Lead', { content_name: 'Quote Builder', content_category: 'Quote Request' }, opts);
}

/** Booking-page "estimate request": a lead, not a scheduled appointment. */
export function trackEstimateRequest(opts?: ConversionOptions) {
  return trackFormConversion('Lead', { content_name: 'Estimate Request', content_category: 'Quote Request' }, opts);
}

export function trackBooking(opts?: ConversionOptions) {
  return trackFormConversion('Schedule', { content_name: 'Booking Form', content_category: 'Service Booking' }, opts);
}

/**
 * Builder / GC bid request. Deliberately NOT a Meta "Lead" or an OpenAI
 * "lead_created": builder leads are a different funnel with different value,
 * and folding them into homeowner lead counts would poison both audiences.
 * Fires a Meta custom event, a GA4 event and a dataLayer event (for GTM, if
 * ever added) under the same name. Same eventId rule as trackFormConversion: no id from
 * the server means nothing was delivered, so nothing is reported.
 */
export function trackBuilderLead(
  params: { units?: string; community?: string; source?: string },
  opts?: ConversionOptions
) {
  if (typeof window === 'undefined' || !opts?.eventId) return;
  const data: Record<string, string> = {
    content_name: 'Builder Bid Request',
    content_category: 'Builder Lead',
    ...(params.units ? { units: params.units } : {}),
    ...(params.community ? { community: params.community } : {}),
    ...(params.source ? { source: params.source } : {}),
  };
  safeFbq('trackCustom', 'builder_lead', data, { eventID: opts.eventId });
  safeGtag('event', 'builder_lead', { ...data, event_id: opts.eventId });
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: 'builder_lead', event_id: opts.eventId, ...data });
  } catch {
    // never throw into a form's success path
  }
}
