/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    /** Meta Pixel */
    fbq: (...args: any[]) => void;
    _fbq: any;
    /** GA4 (gtag.js) */
    gtag: (...args: any[]) => void;
    /** Shared by gtag.js and Google Tag Manager */
    dataLayer: any[];
  }
}

export {};
