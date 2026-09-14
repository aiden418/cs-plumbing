import { NextResponse } from "next/server";
import type { Resend } from "resend";

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

export function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[&<>"'/]/g, (c) => ESCAPE_MAP[c] ?? c);
}

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true } as const;
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) } as const;
  }
  return { ok: true } as const;
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function tooManyRequests(retryAfter?: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
  );
}

export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

type EmailPayload = Parameters<Resend["emails"]["send"]>[0];

/**
 * The Resend SDK does not throw when the API rejects a send (bad/revoked key,
 * unverified sending domain, suppressed recipient, 5xx). It resolves with
 * `{ data: null, error }`. Awaiting `send()` without reading `error` reports
 * a lost lead as a success, so every required email goes through here.
 * Returns the Resend email id so the caller can log/return it for tracing.
 */
export async function sendEmailOrThrow(
  resend: Resend,
  payload: EmailPayload,
  label: string
): Promise<string> {
  const { data, error } = await resend.emails.send(payload);
  if (error || !data) {
    throw new Error(
      `Resend rejected ${label}: ${error?.name ?? "unknown_error"} — ${error?.message ?? "no message"}`
    );
  }
  return data.id;
}

/**
 * Secondary notifications (SMS gateway, customer copy) must never turn an
 * already-delivered lead into a user-facing failure and a retry. Log and move on.
 */
export async function sendEmailBestEffort(
  resend: Resend,
  payload: EmailPayload,
  label: string
): Promise<string | null> {
  try {
    return await sendEmailOrThrow(resend, payload, label);
  } catch (err) {
    console.error(`${label} failed (non-fatal):`, err);
    return null;
  }
}

export const SMS_TO = process.env.SMS_GATEWAY_TO ?? "";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "aiden@csplumbinglee.com";
