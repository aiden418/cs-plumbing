export const META_PIXEL_ID = '1372903383968668';
export const OPENAI_PIXEL_ID = 'DMBS1D5TFZstmLgAtY2XcW';

// Meta event name -> OpenAI (ChatGPT ads) standard event. Only genuine
// conversion actions are mapped; unmapped events stay Meta-only.
const OAIQ_EVENT_MAP: Record<string, string> = {
  Contact: 'lead_created',
  Lead: 'lead_created',
  Schedule: 'appointment_scheduled',
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
