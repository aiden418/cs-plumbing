"use client";

import Script from "next/script";
import { GA4_ID, GTM_ID } from "@/lib/analytics";

/**
 * GA4 (gtag.js) + Google Tag Manager.
 *
 * Both are opt-in: if the matching env var is unset, nothing renders, so a
 * missing ID degrades to no tag rather than a broken one.
 *
 * GA4 is configured here directly. Do NOT also add a GA4 configuration tag
 * inside the GTM container — page views and events would be double-counted.
 * GTM is loaded for Google Ads conversions and other third-party tags, which
 * trigger off the `dataLayer` events pushed in @/lib/analytics.
 */
export default function GoogleAnalytics() {
  if (!GA4_ID && !GTM_ID) return null;

  return (
    <>
      {GA4_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}
          </Script>
        </>
      )}

      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}
    </>
  );
}

/**
 * GTM's <noscript> fallback. Must render immediately after <body> opens,
 * so it is a separate export from the script bundle above.
 */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
