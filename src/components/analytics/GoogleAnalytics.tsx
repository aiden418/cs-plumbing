"use client";

import Script from "next/script";
import { BUSINESS } from "@/lib/business";
import { GOOGLE_ADS_ID, TAG_IDS } from "@/lib/pixel";

const WEBSITE_CALL_CONVERSION_LABEL = "V3DdCPHyq7wdEOm5tKw9";

/**
 * Google Analytics 4 via gtag.js. Renders nothing until GA_MEASUREMENT_ID is
 * set, so an unconfigured build ships no Google script at all. The same
 * goes for a tags-off build (NEXT_PUBLIC_ANALYTICS=off, see TAG_IDS in
 * src/lib/pixel.ts).
 *
 * Client-side route changes are reported by GA4's Enhanced Measurement
 * ("page changes based on browser history events", on by default for a web
 * stream), so there is deliberately no manual page_view here — adding one
 * would double-count every navigation. The Google Ads forwarding tag
 * measures placed calls separately from the click events in src/lib/pixel.ts.
 */
export default function GoogleAnalytics() {
  if (!TAG_IDS?.ga) return null;
  const { ga: GA_MEASUREMENT_ID, googleAds: googleAdsId } = TAG_IDS;
  const websiteCallConfig = googleAdsId === GOOGLE_ADS_ID ? `
          gtag('config', '${googleAdsId}/${WEBSITE_CALL_CONVERSION_LABEL}', {
            phone_conversion_number: ${JSON.stringify(BUSINESS.phone)},
            phone_conversion_callback: (() => {
              // Google calls this once with a forwarding number, then again on its
              // refresh timer and each time the tab is shown again (and never for a
              // visitor it has no number for). One observer and one set of lists
              // serve every call, so a repeat does nothing new and a changed number
              // replaces the earlier one.
              const publishedNumber = ${JSON.stringify(BUSINESS.phoneRaw)};
              // Every href and every visible form a company call link has carried:
              // the published ones, then each forwarding number Google has sent.
              const hrefs = [${JSON.stringify(BUSINESS.phoneHref)}];
              const displays = ${JSON.stringify([BUSINESS.phone, BUSINESS.phoneDigits])};
              let forwardingHref = '';
              let displayNumber = '';
              let observer = null;

              function replaceNumber(text) {
                let value = text;
                for (const number of displays) {
                  if (number !== displayNumber) value = value.replaceAll(number, displayNumber);
                }
                // A label that gives both forms, digits then (vanity), would otherwise read the new number twice.
                return value.replaceAll(displayNumber + ' (' + displayNumber + ')', displayNumber);
              }

              function updatePhoneLinks() {
                const selector = hrefs.map(href => 'a[href="' + href + '"]').join(', ');
                for (const link of document.querySelectorAll(selector)) {
                  if (link.getAttribute('href') !== forwardingHref) {
                    link.setAttribute('href', forwardingHref);
                  }
                  const label = link.getAttribute('aria-label');
                  if (label) {
                    const updatedLabel = replaceNumber(label);
                    if (updatedLabel !== label) link.setAttribute('aria-label', updatedLabel);
                  }
                  const textNodes = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
                  while (textNodes.nextNode()) {
                    const node = textNodes.currentNode;
                    const updatedText = replaceNumber(node.data);
                    if (updatedText !== node.data) node.data = updatedText;
                  }
                }
              }

              // Next.js navigation and menus can render new phone links after the tag loads.
              // Disconnect while applying updates so our writes do not trigger another scan.
              function refreshPhoneLinks() {
                observer.disconnect();
                updatePhoneLinks();
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['href', 'aria-label'],
                });
              }

              return (formattedNumber, mobileNumber) => {
                // Keep the published number if Google cannot supply a usable forwarding number.
                if (typeof mobileNumber !== 'string' || !/^\\+?\\d{10,15}$/.test(mobileNumber) ||
                    mobileNumber.replace(/^\\+?1?/, '') === publishedNumber) return;

                forwardingHref = 'tel:' + mobileNumber;
                displayNumber = formattedNumber || mobileNumber;
                if (!hrefs.includes(forwardingHref)) hrefs.push(forwardingHref);
                if (!displays.includes(displayNumber)) displays.push(displayNumber);
                if (!observer) observer = new MutationObserver(refreshPhoneLinks);
                refreshPhoneLinks();
              };
            })(),
          });
        ` : "";
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
          gtag('config', '${googleAdsId}');
          ${websiteCallConfig}
        `}
      </Script>
    </>
  );
}
