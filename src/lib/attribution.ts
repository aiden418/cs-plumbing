/**
 * Lead-source attribution (browser side).
 *
 * Remembers how a visitor found the site so every lead email can say where it
 * came from. Two touches are kept in localStorage:
 *
 *   first — the visit that first brought them here (never overwritten)
 *   last  — the most recent visit that arrived from somewhere identifiable
 *           (an ad click, a tagged link, or another website)
 *
 * Nothing here is sent to any third party; it only rides along in the body of
 * the visitor's own form submission. See src/lib/api/attribution.ts for the
 * server half that validates it and renders it into the lead email.
 */

const STORAGE_KEY = "cs-attribution";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
// Ad-platform click ids: Google Ads, Google (iOS), Meta, Microsoft, TikTok.
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;

export interface Touch {
  /** ISO timestamp of the visit. */
  at: string;
  /** Path + query of the first page seen on that visit. */
  landingPage: string;
  /** Full referrer URL, empty for direct visits. */
  referrer: string;
  params: Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>>;
}

export interface Attribution {
  first: Touch;
  last: Touch;
}

function readTouch(): Touch {
  const query = new URLSearchParams(window.location.search);
  const params: Touch["params"] = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = query.get(key);
    if (value) params[key] = value.slice(0, 200);
  }

  let referrer = document.referrer;
  try {
    // Internal navigation is not a traffic source.
    if (referrer && new URL(referrer).hostname === window.location.hostname) referrer = "";
  } catch {
    referrer = "";
  }

  return {
    at: new Date().toISOString(),
    landingPage: (window.location.pathname + window.location.search).slice(0, 300),
    referrer: referrer.slice(0, 300),
    params,
  };
}

/** Call once per page load. Safe when storage is blocked (private mode). */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const touch = readTouch();
    const stored = getAttribution();
    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ first: touch, last: touch }));
      return;
    }
    const identifiable = touch.referrer !== "" || Object.keys(touch.params).length > 0;
    if (identifiable) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, last: touch }));
    }
  } catch {
    // Storage unavailable — leads still submit, just without a source.
  }
}

/** Include the result in a lead form's POST body as `attribution`. */
export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Attribution;
    return parsed?.first && parsed?.last ? parsed : undefined;
  } catch {
    return undefined;
  }
}
