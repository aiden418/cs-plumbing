"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import { ANALYTICS_MODE } from "@/lib/pixel";
import { BUSINESS } from "@/lib/business";

const POOL_SCRIPT = "https://backend.leadconnectorhq.com/appengine/loc/PE7gURxtQmo0kQ8TX7oC/pool/xvwAcbZUW1mOHs6lNFVo/number_pool.js";
const POOL_NUMBERS = new Set([
  "12393603402", "12397995723", "12393459082", "12394755704",
]);
const subscribe = () => () => {};
const allowedInBrowser = () =>
  ANALYTICS_MODE === "on" &&
  !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;

/** Vendor assigns the number; this bridge preserves it across React navigation
 * and late-mounted call buttons without making another assignment request.
 * SMS links keep their original destination. No conversion is fired here.
 */
export default function CallTracking() {
  const enabled = useSyncExternalStore(subscribe, allowedInBrowser, () => false);

  useEffect(() => {
    if (!enabled) return;
    let assigned = "";
    let scheduled = false;
    const digits = (value: string) => value.replace(/\D/g, "");
    const original = digits(BUSINESS.phoneHref);

    function syncLinks() {
      scheduled = false;
      // The vendor also replaces numbers in non-telephone anchor URLs.
      document.querySelectorAll<HTMLAnchorElement>('a[href^="sms:"]').forEach((link) => {
        link.classList.add("noswap");
      });
      const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]');
      for (const link of links) {
        const number = digits(link.getAttribute("href") || "");
        if (!link.closest(".noswap") && POOL_NUMBERS.has(number)) {
          assigned = number;
          break;
        }
      }
      if (!assigned) return;
      const national = assigned.slice(1);
      const display = `${national.slice(0, 3)}-${national.slice(3, 6)}-${national.slice(6)}`;
      const replace = (value: string) => value
        .replace(/833-PLUMB-IT/gi, display)
        .replace(/(?:\+1[ .-]?)?\(?833\)?[ .-]?758[ .-]?6248/g, display);

      for (const link of links) {
        if (link.closest(".noswap")) continue;
        const number = digits(link.getAttribute("href") || "");
        if (number !== original && !POOL_NUMBERS.has(number)) continue;
        const href = `tel:+${assigned}`;
        if (link.getAttribute("href") !== href) link.setAttribute("href", href);
        const label = link.getAttribute("aria-label");
        if (label && replace(label) !== label) link.setAttribute("aria-label", replace(label));
        // Change text nodes, never replace React-owned children or icons.
        const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const value = node.nodeValue || "";
          const next = replace(value);
          if (next !== value) node.nodeValue = next;
        }
      }
    }

    syncLinks();
    const observer = new MutationObserver(() => {
      if (!scheduled) {
        scheduled = true;
        queueMicrotask(syncLinks);
      }
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ["href", "aria-label"],
    });
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <Script id="cs-number-pool" src={POOL_SCRIPT} strategy="afterInteractive" />
      <Script id="cs-call-session" src="https://backend.leadconnectorhq.com/appengine/js/user_session.js" strategy="afterInteractive" />
    </>
  );
}
