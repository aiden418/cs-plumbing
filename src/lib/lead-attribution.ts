/** First-party, last non-direct source within 30 days. URL evidence is not proof of a sale. */
export const ATTRIBUTION_COOKIE = "cs_lead_source";
export const ATTRIBUTION_DAYS = 30;
export const ATTRIBUTION_SECONDS = ATTRIBUTION_DAYS * 24 * 60 * 60;

const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"] as const;
type TrackingKey = typeof keys[number];
export type LeadAttribution = {
  v: 1;
  capturedAt: string;
  landingPath: string;
  referrerHost: string;
  tags: Partial<Record<TrackingKey, string>>;
};

function clean(value: unknown, max = 160): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max) : "";
}

export function attributionLabel(a: LeadAttribution | null): string {
  if (!a) return "Direct / unknown";
  const source = (a.tags.utm_source || "").toLowerCase();
  const medium = (a.tags.utm_medium || "").toLowerCase();
  const paid = ["cpc", "ppc", "paid_search", "paidsearch", "paid_social", "paidsocial"].includes(medium);
  if (source === "google" && paid) {
    return medium === "paid_search" || medium === "paidsearch" ? "Paid - Google Search" : "Paid - Google Ads (unspecified)";
  }
  if (paid && ["facebook", "fb"].includes(source)) return "Paid - Facebook";
  if (paid && ["instagram", "ig"].includes(source)) return "Paid - Instagram";
  if (paid && ["meta", "an", "msg"].includes(source)) return "Paid - Meta (unspecified)";
  // Google click IDs identify a paid click, but not Search versus another campaign type.
  if ((!source || source === "google") && (a.tags.gclid || a.tags.gbraid || a.tags.wbraid)) return "Paid - Google Ads (unspecified)";
  // fbclid is also attached to unpaid Facebook links. Never count it alone as paid.
  return "Unverified / non-paid source";
}

export function captureAttribution(url: URL, referrer: string | null, now = new Date()): LeadAttribution | null {
  const tags: LeadAttribution["tags"] = {};
  for (const key of keys) {
    const value = clean(url.searchParams.get(key), key.endsWith("clid") || key.endsWith("braid") ? 256 : 100);
    if (value && !value.includes("{{") && !value.includes("}")) tags[key] = value;
  }
  let referrerHost = "";
  try {
    const host = new URL(referrer || "").hostname;
    const normalized = (s: string) => s.toLowerCase().replace(/^www\./, "");
    if (normalized(host) !== normalized(url.hostname)) referrerHost = clean(host, 120);
  } catch { /* Missing or invalid referrer is direct/unknown. */ }
  if (!Object.keys(tags).length && !referrerHost) return null;
  return { v: 1, capturedAt: now.toISOString(), landingPath: clean(url.pathname, 160), referrerHost, tags };
}

export function encodeAttribution(a: LeadAttribution): string {
  const encoded = encodeURIComponent(JSON.stringify(a));
  // Leave room for cookie name and attributes below the browser's 4 KB limit.
  return encoded.length <= 3500 ? encoded : "";
}

export function decodeAttribution(value: string | undefined, now = new Date()): LeadAttribution | null {
  if (!value || value.length > 3500) return null;
  try {
    const a = JSON.parse(decodeURIComponent(value));
    if (a?.v !== 1 || typeof a.capturedAt !== "string" || !a.tags || typeof a.tags !== "object" || Array.isArray(a.tags)) return null;
    const age = now.getTime() - Date.parse(a.capturedAt);
    if (!Number.isFinite(age) || age < -60_000 || age > ATTRIBUTION_SECONDS * 1000) return null;
    const tags: LeadAttribution["tags"] = {};
    for (const key of keys) {
      const v = clean(a.tags[key], key.endsWith("clid") || key.endsWith("braid") ? 256 : 100);
      if (v) tags[key] = v;
    }
    const landingPath = clean(a.landingPath, 160).split(/[?#]/)[0];
    return { v: 1, capturedAt: a.capturedAt, landingPath: landingPath.startsWith("/") ? landingPath : "", referrerHost: clean(a.referrerHost, 120), tags };
  } catch { return null; }
}

export function attributionFromRequest(request: Request, now = new Date()): LeadAttribution | null {
  if (request.headers.get("sec-gpc") === "1") return null;
  const cookie = (request.headers.get("cookie") || "").split(";").map(s => s.trim()).find(s => s.startsWith(`${ATTRIBUTION_COOKIE}=`));
  return decodeAttribution(cookie?.slice(ATTRIBUTION_COOKIE.length + 1), now);
}
