"use client";

import Script from "next/script";
import { BUSINESS } from "@/lib/business";
import { GOOGLE_ADS_ID, TAG_IDS } from "@/lib/pixel";

const WEBSITE_CALL_CONVERSION_LABEL = "V3DdCPHyq7wdEOm5tKw9";
/** Google's call-tracking loader: the script its own tag loads for a website call conversion. */
const GOOGLE_CALL_SCRIPT = "https://www.gstatic.com/wcm/loader.js";
/** The Google tag library. Added to the page by the inline script below, never preloaded. */
const GOOGLE_TAG_SCRIPT = "https://www.googletagmanager.com/gtag/js";
/** The longest a visit waits for the Google tag, whatever else is going on (ms). */
const GOOGLE_TAG_MAX_WAIT_MS = 6000;

/**
 * Google Analytics 4 via gtag.js. Renders nothing until GA_MEASUREMENT_ID is
 * set, so an unconfigured build ships no Google script at all. The same
 * goes for a tags-off build (NEXT_PUBLIC_ANALYTICS=off, see TAG_IDS in
 * src/lib/pixel.ts).
 *
 * Client-side route changes are reported by GA4's Enhanced Measurement
 * ("page changes based on browser history events", on by default for a web
 * stream), so there is deliberately no manual page_view here — adding one
 * would double-count every navigation. The Google Ads forwarding number
 * measures placed calls separately from the click events in src/lib/pixel.ts.
 *
 * The forwarding number (conversion "C&S Website Phone Calls") comes from
 * Google's call-tracking script, and this component starts that script
 * itself. Google's documented way is a second
 * gtag('config', '<ads id>/<label>', { phone_conversion_number }) that the
 * account's Google tag turns into this same call. Since that tag became a
 * Tag Manager container (GTM-NNKGVTCD, seen 2026-11-22) it does nothing with
 * the command, in any form Google prints, so the script never loaded and no
 * visitor could be given a forwarding number. What is sent below is what the
 * tag sends internally: the same conversion id and label, the same number
 * and the same callback arguments. The Google tag is still needed: it stores
 * the ad click that the call script reads.
 *
 * When the tag loads (2026-11-22). The commands are queued at once, so no
 * event is ever lost, but the 150 KB library is no longer preloaded ahead of
 * the first screen. It is added to the page:
 *   - immediately, for a visit that arrived from a Google ad (a click id in
 *     the address, or Google's click cookie from an earlier visit): that
 *     visitor may tap Call within a second and must get the forwarding number;
 *   - otherwise once the page has loaded and the browser is idle, at the
 *     visitor's first touch, key press or scroll, or after
 *     GOOGLE_TAG_MAX_WAIT_MS, whichever comes first.
 * Google's call script starts in the same step, as before.
 */
export default function GoogleAnalytics() {
  if (!TAG_IDS?.ga) return null;
  const { ga: GA_MEASUREMENT_ID, googleAds: googleAdsId } = TAG_IDS;
  const websiteCallTracking = googleAdsId === GOOGLE_ADS_ID ? `
          (() => {
            const conversion = ${JSON.stringify({ ak: googleAdsId.replace(/^AW-/, ""), cl: WEBSITE_CALL_CONVERSION_LABEL })};
            const onForwardingNumber = (() => {
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
            })();

            // The call Google's own tag makes for a website call conversion. A queue
            // holds it until the script has loaded. If something has already started
            // the script, only the call is added and the script is not loaded twice.
            if (!window._googWcmImpl) {
              const queue = function () { (queue.q = queue.q || []).push(arguments); };
              window._googWcmImpl = queue;
              window._googWcmAk = window._googWcmAk || conversion.ak;
              const script = document.createElement('script');
              script.async = true;
              script.src = ${JSON.stringify(GOOGLE_CALL_SCRIPT)};
              document.head.appendChild(script);
            }
            window._googWcmImpl(2, onForwardingNumber, conversion, ${JSON.stringify(BUSINESS.phone)}, null, new Date());
          })();
        ` : "";
  const loadWhenReady = `
          (() => {
            let started = false;
            const waits = [];
            const start = () => {
              if (started) return;
              started = true;
              for (const [target, type] of waits) target.removeEventListener(type, start);
              const tag = document.createElement('script');
              tag.async = true;
              tag.src = ${JSON.stringify(`${GOOGLE_TAG_SCRIPT}?id=${GA_MEASUREMENT_ID}`)};
              document.head.appendChild(tag);
              ${websiteCallTracking}
            };
            const wait = (target, type) => {
              waits.push([target, type]);
              target.addEventListener(type, start, { once: true, passive: true });
            };
            // From a Google ad: nothing waits.
            const fromAd = /[?&](gclid|gbraid|wbraid)=/.test(window.location.search) ||
              /(^|;\\s*)_gcl_(aw|gb)=/.test(document.cookie);
            if (fromAd) { start(); return; }
            // Everyone else: after the first screen, or at the first sign of use.
            const whenIdle = () => {
              if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 2000 });
              else window.setTimeout(start, 200);
            };
            if (document.readyState === 'complete') whenIdle();
            else window.addEventListener('load', whenIdle, { once: true });
            for (const type of ['pointerdown', 'touchstart', 'keydown', 'scroll']) wait(window, type);
            window.setTimeout(start, ${GOOGLE_TAG_MAX_WAIT_MS});
          })();
        `;
  return (
    <Script id="ga4-init" strategy="afterInteractive">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${googleAdsId}');
          ${loadWhenReady}
        `}
    </Script>
  );
}
