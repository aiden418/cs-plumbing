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

export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  safeFbq('track', event, params);
  const oaiqEvent = OAIQ_EVENT_MAP[event];
  if (oaiqEvent) {
    safeOaiq('measure', oaiqEvent, { type: 'customer_action' });
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
 * Call only after the server has confirmed the inquiry was delivered.
 * Pass the submitter's email (when the form collects one) so the OpenAI
 * pixel can match the conversion; it is hashed before leaving the browser.
 */
export async function trackContactForm(user?: { email?: string }) {
  if (user) await identifyOaiqUser(user);
  trackEvent('Lead', { content_name: 'Contact Form', content_category: 'Service Request' });
}

export function trackQuoteBuilder() {
  trackEvent('Lead', { content_name: 'Quote Builder', content_category: 'Quote Request' });
}

export function trackBooking() {
  trackEvent('Schedule', { content_name: 'Booking Form', content_category: 'Service Booking' });
}
