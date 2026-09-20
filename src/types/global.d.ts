declare global {
  interface Window {
    // All tags are injected by inline snippets and may never arrive (blocked
    // by an ad blocker, or the env var is unset), so they're optional — every
    // call site already guards on truthiness. Args are `unknown[]` rather than
    // `any[]`: these are variadic tag APIs, and anything is still assignable.
    fbq?: (...args: unknown[]) => void;
    /** Internal back-reference set by the Meta snippet. Never read from TS. */
    _fbq?: unknown;
    oaiq?: (...args: unknown[]) => void;
    /** GA4 (gtag.js) */
    gtag?: (...args: unknown[]) => void;
    /** Shared by gtag.js and Google Tag Manager */
    dataLayer?: unknown[];
  }
}

export {};
