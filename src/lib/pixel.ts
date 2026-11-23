import type { LeadForm, LeadType } from './lead';

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

// What counts as what (2026-11-22):
//
//   LEAD          The office received an inquiry. Reported only with the Lead
//                 ID the server issued when it accepted the form (CS-XXXXXXXX,
//                 src/lib/api/lead.ts), once per ID. Homeowner requests and
//                 utility estimates are a Meta "Lead", an OpenAI
//                 "lead_created", a GA4 "generate_lead" and the Google Ads
//                 service-lead conversion, told apart by `lead_type`. Builder
//                 bid requests are their own event, "builder_lead".
//   INTERACTION   A tap or click that shows interest: Call, Text, the coupon
//                 button. Never a lead. Its GA4 names (phone_tap, text_tap,
//                 coupon_click) are deliberately not the names GA4 has marked
//                 as key events (generate_lead, and the old "contact").
//
// A request for a preferred time is a lead, not a scheduled appointment: the
// office still has to confirm it. Nothing on this site reports "Schedule" /
// "appointment_scheduled" / "book_appointment" any more.

// Meta event name -> OpenAI (ChatGPT ads) standard event. OpenAI only ever
// hears about an inquiry the server accepted.
const OAIQ_EVENT_MAP: Record<string, string> = {
  Lead: 'lead_created',
};

// Meta event name -> GA4 event, for the events trackEvent carries.
const GA_EVENT_MAP: Record<string, string> = {
  Lead: 'generate_lead',
};

/** Events that say "the office received an inquiry". They need the server's Lead ID. */
const LEAD_EVENTS = new Set(['Lead', 'Schedule']);

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
   * The Lead ID the server issued when it accepted the inquiry. It is the
   * pixel's `event_id`, Meta's `eventID` and the Google Ads `transaction_id`,
   * so each platform counts the inquiry once, and it is the same ID the
   * office email carries.
   */
  eventId?: string;
  /** Which funnel the server filed it under. Defaults to a homeowner request. */
  leadType?: LeadType;
  /** A marked test visit (?cs_test=1): recorded as "test_lead" in GA4 only. */
  test?: boolean;
}

/**
 * General events (page content viewed, and so on). A lead event without the
 * server's Lead ID is refused here, so a button click can never be counted
 * as an inquiry: use trackInteraction for clicks.
 */
export function trackEvent(
  event: string,
  params?: Record<string, string>,
  options?: { eventId?: string }
) {
  if (typeof window === 'undefined') return;
  if (LEAD_EVENTS.has(event) && !options?.eventId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`trackEvent("${event}") needs the server's Lead ID; a click is trackInteraction`);
    }
    return;
  }
  if (options?.eventId) safeFbq('track', event, params, { eventID: options.eventId });
  else safeFbq('track', event, params);
  const oaiqEvent = OAIQ_EVENT_MAP[event];
  if (oaiqEvent && options?.eventId) {
    safeOaiq('measure', oaiqEvent, { type: 'customer_action' }, { event_id: options.eventId });
  }
  const gaEvent = GA_EVENT_MAP[event];
  if (gaEvent) {
    safeGtag('event', gaEvent, {
      ...(params ?? {}),
      ...(options?.eventId ? { event_id: options.eventId } : {}),
    });
  }
}

/** Taps and clicks that show interest. The GA4 event name is the key. */
export type Interaction = 'phone_tap' | 'text_tap' | 'coupon_click';

const INTERACTIONS: Record<Interaction, { meta: ['track' | 'trackCustom', string]; label: string }> = {
  // Meta's standard "Contact" is its own metric there, separate from Leads.
  phone_tap: { meta: ['track', 'Contact'], label: 'Phone Call' },
  text_tap: { meta: ['track', 'Contact'], label: 'Text Message' },
  coupon_click: { meta: ['trackCustom', 'CouponClick'], label: 'Coupon Popup CTA' },
};

/**
 * An interaction, reported to Meta and GA4 only. OpenAI is not told, and no
 * Google Ads conversion is sent: nobody has asked for anything yet. Placed
 * calls are measured separately by the Google Ads forwarding number
 * (GoogleAnalytics.tsx).
 */
export function trackInteraction(kind: Interaction) {
  if (typeof window === 'undefined') return;
  const { meta, label } = INTERACTIONS[kind];
  const params = { content_name: label, content_category: 'Interaction' };
  safeFbq(meta[0], meta[1], params);
  safeGtag('event', kind, params);
}

// tel: clicks are tracked once, sitewide, by the document-level listener in
// MetaPixel.tsx. Do not also attach this to a tel: link's onClick or the
// click reports twice.
export function trackPhoneClick() {
  trackInteraction('phone_tap');
}

export function trackTextClick() {
  trackInteraction('text_tap');
}

/** The coupon card's button. It opens the request form; it is not a request. */
export function trackCouponClick() {
  trackInteraction('coupon_click');
}

// Lead IDs this browser has already reported. The same ID can come back more
// than once (a double tap answered twice, a retry of a request the office
// already had); it is still one inquiry.
const reportedLeads = new Set<string>();

function alreadyReported(leadId: string): boolean {
  if (reportedLeads.has(leadId)) return true;
  reportedLeads.add(leadId);
  try {
    const key = `cs_lead_${leadId}`;
    if (window.sessionStorage.getItem(key)) return true;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Storage blocked: the in-memory set still covers this page.
  }
  return false;
}

/**
 * Shared path for homeowner and utility form leads. The server issues the
 * Lead ID only when the office email was accepted; a honeypot-tripped or
 * failed submission has none. No ID, no lead, on any platform. One ID, one
 * lead, however many times the answer arrives.
 */
async function trackFormConversion(
  form: LeadForm,
  params: Record<string, string>,
  opts?: ConversionOptions
) {
  if (typeof window === 'undefined' || !opts?.eventId) return;
  if (alreadyReported(opts.eventId)) return;
  const leadType = opts.leadType ?? 'homeowner_request';
  const data: Record<string, string> = {
    ...params,
    ...(leadType === 'utility_estimate' ? { content_category: 'Utility Estimate' } : {}),
    lead_type: leadType,
    form,
  };
  if (opts.test) {
    // A marked test visit: visible in GA4 for checking, counted nowhere.
    safeGtag('event', 'test_lead', { ...data, event_id: opts.eventId });
    return;
  }
  if (opts.email) await identifyOaiqUser({ email: opts.email });
  trackEvent('Lead', data, { eventId: opts.eventId });
  // Only accepted inquiries reach this path. The Lead ID lets Google Ads
  // drop a repeat; customer contact details are never sent to Ads.
  safeGtag('event', 'conversion', {
    send_to: GOOGLE_ADS_SERVICE_LEAD,
    transaction_id: opts.eventId,
  });
}

/**
 * Call only after the server has accepted the inquiry, with the answer's
 * eventId, leadType and test fields. Pass the submitter's email (when the
 * form collects one) so the OpenAI pixel can match the conversion; it is
 * hashed before leaving the browser.
 */
export function trackContactForm(opts?: ConversionOptions) {
  return trackFormConversion('contact', { content_name: 'Contact Form', content_category: 'Service Request' }, opts);
}

/** The request form on the Cape Coral UEP connection page. */
export function trackUtilityEstimate(opts?: ConversionOptions) {
  return trackFormConversion(
    'utility_estimate',
    { content_name: 'Utility Connection Estimate', content_category: 'Utility Estimate' },
    { ...opts, leadType: 'utility_estimate' }
  );
}

export function trackQuoteBuilder(opts?: ConversionOptions) {
  return trackFormConversion('quote_builder', { content_name: 'Quote Builder', content_category: 'Quote Request' }, opts);
}

/** Booking-page "estimate request". */
export function trackEstimateRequest(opts?: ConversionOptions) {
  return trackFormConversion('estimate', { content_name: 'Estimate Request', content_category: 'Quote Request' }, opts);
}

/**
 * Booking-page request for a preferred date and time. A lead like the others:
 * the appointment exists only once the office has confirmed it.
 */
export function trackPreferredTimeRequest(opts?: ConversionOptions) {
  return trackFormConversion(
    'preferred_time',
    { content_name: 'Preferred Time Request', content_category: 'Service Request' },
    opts
  );
}

/**
 * Builder / GC bid request. Deliberately NOT a Meta "Lead" or an OpenAI
 * "lead_created": builder leads are a different funnel with different value,
 * and folding them into homeowner lead counts would poison both audiences.
 * Fires a Meta custom event, a GA4 event and a dataLayer event (for GTM, if
 * ever added) under the same name. Same rules as trackFormConversion: no
 * Lead ID from the server means nothing was delivered, so nothing is
 * reported, and one ID is reported once.
 */
export function trackBuilderLead(
  params: { units?: string; community?: string; source?: string },
  opts?: ConversionOptions
) {
  if (typeof window === 'undefined' || !opts?.eventId) return;
  if (alreadyReported(opts.eventId)) return;
  const data: Record<string, string> = {
    content_name: 'Builder Bid Request',
    content_category: 'Builder Lead',
    lead_type: 'builder_bid',
    ...(params.units ? { units: params.units } : {}),
    ...(params.community ? { community: params.community } : {}),
    ...(params.source ? { source: params.source } : {}),
  };
  if (opts.test) {
    safeGtag('event', 'test_lead', { ...data, event_id: opts.eventId });
    return;
  }
  safeFbq('trackCustom', 'builder_lead', data, { eventID: opts.eventId });
  safeGtag('event', 'builder_lead', { ...data, event_id: opts.eventId });
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: 'builder_lead', event_id: opts.eventId, ...data });
  } catch {
    // never throw into a form's success path
  }
}

/**
 * Water heater giveaway entry. Like builder leads, deliberately NOT a Meta
 * "Lead", an OpenAI "lead_created" or a Google Ads service-lead conversion:
 * someone entering a drawing is not asking for service, and counting them
 * would teach the ad platforms to chase giveaway entrants. Custom event on
 * Meta and GA4 only, so a giveaway audience can still be built from it.
 */
export function trackGiveawayEntry(opts?: ConversionOptions) {
  if (typeof window === 'undefined' || !opts?.eventId) return;
  const data = { content_name: 'Water Heater Giveaway', content_category: 'Giveaway Entry' };
  safeFbq('trackCustom', 'giveaway_entry', data, { eventID: opts.eventId });
  safeGtag('event', 'giveaway_entry', { ...data, event_id: opts.eventId });
}
