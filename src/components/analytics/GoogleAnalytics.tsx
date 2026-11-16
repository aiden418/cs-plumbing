"use client";

import Script from "next/script";
import { TAG_IDS } from "@/lib/pixel";

/**
 * Google Analytics 4 via gtag.js. Renders nothing until GA_MEASUREMENT_ID is
 * set, so an unconfigured build ships no Google script at all. The same
 * goes for a tags-off build (NEXT_PUBLIC_ANALYTICS=off, see TAG_IDS in
 * src/lib/pixel.ts).
 *
 * Client-side route changes are reported by GA4's Enhanced Measurement
 * ("page changes based on browser history events", on by default for a web
 * stream), so there is deliberately no manual page_view here — adding one
 * would double-count every navigation. Conversion events (calls, texts,
 * forms, bookings, builder bids) are sent from src/lib/pixel.ts alongside
 * the Meta and OpenAI pixels so all three platforms see the same actions.
 */
export default function GoogleAnalytics() {
  if (!TAG_IDS?.ga) return null;
  // Named as before so the tag markup below is unchanged. These are the real
  // ids unless the build is in placeholder mode.
  const { ga: GA_MEASUREMENT_ID, googleAds: GOOGLE_ADS_ID } = TAG_IDS;
  return (
    <>
      <Script
        id="ga4-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
