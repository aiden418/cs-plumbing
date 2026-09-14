/**
 * OpenAI Ads Conversions API (server-side). Pairs with the browser pixel in
 * src/lib/pixel.ts: both report the same conversion with the same id, so
 * OpenAI dedupes them, and the server copy still lands when the browser
 * pixel is blocked (ad blockers, in-app browsers, cleared cookies).
 *
 * Server-only. Never import from a client component. Inert until
 * OPENAI_ADS_CONVERSIONS_API_KEY is set. Never throws, never blocks the lead.
 *
 * Schema per OpenAI's published reference (openai/plugins, openai-ads-conversions):
 * POST https://bzr.openai.com/v1/events?pid=<pixel id>, bearer auth,
 * events[] with id/type/timestamp_ms/oppref/source_url/action_source/user/data.
 */
import { createHash, randomUUID } from "node:crypto";
import { OPENAI_PIXEL_ID } from "@/lib/pixel";
import { getClientIp } from "@/lib/api/secure";

const DEFAULT_ENDPOINT = "https://bzr.openai.com/v1/events";
const DEFAULT_SITE_ORIGIN = "https://www.csplumbinglee.com";
const TIMEOUT_MS = 4000;

export type ConversionType = "lead_created" | "appointment_scheduled";

/** Request facts captured before the response is sent (after() runs later). */
export interface RequestContext {
  cookieHeader: string | null;
  userAgent: string | null;
  ip: string;
}

export interface ServerConversion {
  type: ConversionType;
  /** Shared with the browser pixel's `event_id`; OpenAI dedupes on it. */
  id: string;
  context: RequestContext;
  /** Pathname the visitor converted on (client-supplied, validated here). */
  sourcePath?: string;
  email?: string;
}

export function isCapiConfigured(): boolean {
  return Boolean(process.env.OPENAI_ADS_CONVERSIONS_API_KEY);
}

export function newConversionId(): string {
  return randomUUID();
}

export function captureRequestContext(request: Request): RequestContext {
  return {
    cookieHeader: request.headers.get("cookie"),
    userAgent: request.headers.get("user-agent"),
    ip: getClientIp(request),
  };
}

/** Raw cookie value, deliberately not decoded: oppref is opaque to us. */
export function readRawCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      const value = part.slice(eq + 1).trim();
      return value || undefined;
    }
  }
  return undefined;
}

/**
 * origin + pathname only. Query strings and fragments are stripped, and
 * anything that is not a plain site path falls back to the site root, so a
 * client can never make us report a foreign or malformed URL.
 */
export function sanitizeSourceUrl(path: unknown, origin: string = siteOrigin()): string {
  if (
    typeof path === "string" &&
    path.length <= 200 &&
    /^\/[A-Za-z0-9\-._~/]*$/.test(path) &&
    !path.startsWith("//")
  ) {
    return origin + path;
  }
  return origin + "/";
}

function siteOrigin(): string {
  return process.env.OPENAI_ADS_SITE_ORIGIN || DEFAULT_SITE_ORIGIN;
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function buildEvent(ev: ServerConversion) {
  const user: Record<string, string> = {};
  const email = ev.email?.trim().toLowerCase();
  if (email) user.email_sha256 = sha256Hex(email);
  if (ev.context.userAgent) user.user_agent = ev.context.userAgent.slice(0, 512);
  if (ev.context.ip && ev.context.ip !== "unknown") user.ip_address = ev.context.ip;

  const oppref = readRawCookie(ev.context.cookieHeader, "__oppref");

  return {
    id: ev.id,
    type: ev.type,
    timestamp_ms: Date.now(),
    ...(oppref ? { oppref } : {}),
    source_url: sanitizeSourceUrl(ev.sourcePath),
    action_source: "web" as const,
    ...(Object.keys(user).length ? { user } : {}),
    data: { type: "customer_action" as const },
  };
}

/** Log-only summary of an API error body. Never echoes request data. */
function describeError(body: string): string {
  try {
    const json = JSON.parse(body) as Record<string, unknown>;
    const msg = json.message ?? json.error ?? json.detail;
    return typeof msg === "string" ? msg.slice(0, 200) : JSON.stringify(msg ?? json).slice(0, 200);
  } catch {
    return body.slice(0, 200);
  }
}

export async function reportConversion(ev: ServerConversion): Promise<void> {
  try {
    const key = process.env.OPENAI_ADS_CONVERSIONS_API_KEY;
    if (!key) return;
    const endpoint = process.env.OPENAI_ADS_CAPI_ENDPOINT || DEFAULT_ENDPOINT;
    const validateOnly = process.env.OPENAI_ADS_CAPI_VALIDATE_ONLY === "true";
    const event = buildEvent(ev);

    const res = await fetch(`${endpoint}?pid=${encodeURIComponent(OPENAI_PIXEL_ID)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ validate_only: validateOnly, events: [event] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const tag = `OpenAI CAPI ${ev.type} (id=${ev.id}, oppref=${"oppref" in event ? "present" : "absent"}${validateOnly ? ", validate_only" : ""})`;
    if (res.ok) {
      console.log(`${tag} accepted, HTTP ${res.status}`);
    } else {
      console.error(`${tag} rejected, HTTP ${res.status}: ${describeError(await res.text())}`);
    }
  } catch (err) {
    console.error(
      `OpenAI CAPI ${ev.type} failed (id=${ev.id}):`,
      err instanceof Error ? err.message : String(err)
    );
  }
}
