export const META_PIXEL_ID = '1372903383968668';
export const OPENAI_PIXEL_ID = 'DMBS1D5TFZstmLgAtY2XcW';

// Meta event name -> OpenAI (ChatGPT ads) standard event. Only genuine
// conversion actions are mapped; unmapped events stay Meta-only.
const OAIQ_EVENT_MAP: Record<string, string> = {
  Contact: 'lead_created',
  Lead: 'lead_created',
  Schedule: 'appointment_scheduled',
};

export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  if (window.fbq) {
    window.fbq('track', event, params);
  }
  const oaiqEvent = OAIQ_EVENT_MAP[event];
  if (oaiqEvent && window.oaiq) {
    window.oaiq('measure', oaiqEvent, { type: 'customer_action' });
  }
}

export function trackPhoneClick() {
  trackEvent('Contact', { content_name: 'Phone Call', content_category: 'Lead' });
}

export function trackTextClick() {
  trackEvent('Contact', { content_name: 'Text Message', content_category: 'Lead' });
}

export function trackContactForm() {
  trackEvent('Lead', { content_name: 'Contact Form', content_category: 'Service Request' });
}

export function trackQuoteBuilder() {
  trackEvent('Lead', { content_name: 'Quote Builder', content_category: 'Quote Request' });
}

export function trackBooking() {
  trackEvent('Schedule', { content_name: 'Booking Form', content_category: 'Service Booking' });
}
