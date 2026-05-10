export const META_PIXEL_ID = '1372903383968668';

export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
}

export function trackPhoneClick() {
  trackEvent('Contact', { content_name: 'Phone Call', content_category: 'Lead' });
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
