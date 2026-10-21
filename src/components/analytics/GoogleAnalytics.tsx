"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/pixel";

/**
 * Google Analytics 4 via gtag.js. Renders nothing until GA_MEASUREMENT_ID is
 * set, so an unconfigured build ships no Google script at all.
 *
 * Load timing is unchanged — `afterInteractive`, i.e. right after hydration —
 * but gtag.js is now inserted by the inline bootstrap (the same pattern as
 * MetaPixel and OpenAIPixel) instead of `<Script src>`. With `src`, next/script
 * also emits `<link rel="preload" as="script">` in <head>, which made the
 * 198 KB gtag.js a High-priority request competing with the stylesheet,
 * fonts and hero image for the first bytes on a phone; Lighthouse's model
 * then counted it as render-blocking whenever it finished before first
 * paint, swinging mobile LCP between 3.7 s and 8.3 s run to run. The
 * `gtag()` stub and dataLayer exist as soon as this snippet runs, so events
 * raised before gtag.js arrives queue and are not lost.
 *
 * Client-side route changes are reported by GA4's Enhanced Measurement
 * ("page changes based on browser history events", on by default for a web
 * stream), so there is deliberately no manual page_view here — adding one
 * would double-count every navigation. Conversion events (calls, texts,
 * forms, bookings, builder bids) are sent from src/lib/pixel.ts alongside
 * the Meta and OpenAI pixels so all three platforms see the same actions.
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <Script id="ga4" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        (function(d,s){var j=d.createElement(s);j.async=true;
        j.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
        d.head.appendChild(j);})(document,'script');
      `}
    </Script>
  );
}
