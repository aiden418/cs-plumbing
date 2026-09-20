import { z } from "zod";
import { escapeHtml } from "@/lib/api/secure";

/**
 * Lead-source attribution (server side). Validates the `attribution` object
 * the browser attaches to a lead (see src/lib/attribution.ts) and renders the
 * "Lead source" block for the admin email. Everything is optional: a lead is
 * never rejected or delayed because its source is missing or malformed.
 */

const short = z.string().max(300);

const TouchSchema = z.object({
  at: short.optional(),
  landingPage: short.optional(),
  referrer: short.optional(),
  params: z.record(z.string().max(40), short).optional(),
});

export const AttributionSchema = z
  .object({ first: TouchSchema, last: TouchSchema })
  .optional()
  // Malformed attribution must not fail the whole submission.
  .catch(undefined);

type Touch = z.infer<typeof TouchSchema>;
export type Attribution = z.infer<typeof AttributionSchema>;

/** FormData routes receive attribution as a JSON string. */
export function parseAttributionJson(value: unknown): Attribution {
  if (typeof value !== "string" || !value) return undefined;
  try {
    return AttributionSchema.parse(JSON.parse(value));
  } catch {
    return undefined;
  }
}

const REFERRER_LABELS: [RegExp, string][] = [
  [/(^|\.)google\./, "Google search (organic)"],
  [/(^|\.)bing\.com$/, "Bing search (organic)"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo search"],
  [/(^|\.)yahoo\.com$/, "Yahoo search"],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)(facebook\.com|fb\.com)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)nextdoor\.com$/, "Nextdoor"],
  [/(^|\.)yelp\.com$/, "Yelp"],
];

/** One plain-English line: where this visit came from. */
export function describeTouch(touch: Touch | undefined): string {
  if (!touch) return "Unknown";
  const p = touch.params ?? {};

  if (p.gclid || p.gbraid || p.wbraid) return "Google Ads (paid click)";
  if (p.msclkid) return "Microsoft / Bing Ads (paid click)";
  if (p.ttclid) return "TikTok Ads (paid click)";
  if (p.utm_source) {
    const medium = p.utm_medium ? ` / ${p.utm_medium}` : "";
    const campaign = p.utm_campaign ? ` — campaign "${p.utm_campaign}"` : "";
    return `${p.utm_source}${medium}${campaign}`;
  }
  if (p.fbclid) return "Facebook / Instagram (link click)";

  if (touch.referrer) {
    try {
      const host = new URL(touch.referrer).hostname.replace(/^www\./, "");
      const match = REFERRER_LABELS.find(([pattern]) => pattern.test(host));
      return match ? match[1] : `Referral from ${host}`;
    } catch {
      return "Unknown referrer";
    }
  }
  return "Direct (typed the address, bookmark, or untracked app link)";
}

/** HTML block for the admin lead email. All values are escaped. */
export function renderAttributionHtml(attribution: Attribution, sourcePath?: string): string {
  const row = (label: string, value: string) =>
    `<p style="margin: 4px 0;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

  const rows: string[] = [];
  if (attribution) {
    const { first, last } = attribution;
    const lastLabel = describeTouch(last);
    const firstLabel = describeTouch(first);
    rows.push(row("Came from", lastLabel));
    if (firstLabel !== lastLabel) rows.push(row("First found us via", firstLabel));
    if (first.landingPage) rows.push(row("First page seen", first.landingPage));
    if (first.at) rows.push(row("First visit", first.at.slice(0, 10)));
    const keyword = last.params?.utm_term ?? first.params?.utm_term;
    if (keyword) rows.push(row("Ad keyword", keyword));
  } else {
    rows.push(row("Came from", "Not captured (visitor blocks browser storage)"));
  }
  if (sourcePath) rows.push(row("Submitted from page", sourcePath));

  return `
    <div style="padding: 12px 20px; background: #eef6ff; border-top: 1px solid #d5e6fa; font-size: 13px; color: #333;">
      <p style="margin: 0 0 6px; font-weight: bold; color: #0077CC;">Lead source</p>
      ${rows.join("\n      ")}
    </div>`;
}
