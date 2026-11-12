import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { BUSINESS } from "@/lib/constants";
import { PLAN_PATHNAME_RE, PLAN_UPLOAD } from "@/lib/plan-upload";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/api/secure";

/**
 * Mints the short-lived client tokens the builder forms use to upload plan
 * sets straight to Vercel Blob (see src/lib/plan-upload.ts and
 * docs/forms-and-photos.md). The browser never sends file bytes through this
 * route, so Vercel's 4.5 MB request limit no longer applies to plans.
 *
 * There is no login on the site, so the token itself carries the limits: file
 * type, size, a random suffix and a 30-day expiry. A per-IP rate limit and an
 * origin check keep the route from being a free upload endpoint for others.
 */
export const dynamic = "force-dynamic";

const UNAVAILABLE = {
  error: `File uploads are temporarily unavailable. Send your request without files and email your plans to ${BUSINESS.email}.`,
  code: "uploads-unavailable",
};

/**
 * Probe the forms call before uploading. The SDK reports a token failure with
 * one generic message, so this is how the builder gets a real explanation.
 */
export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  // Own bucket: a 10-file submission needs 10 tokens, which must not drain
  // the 5-a-minute limit on the submission route.
  const rl = rateLimit(`blob:${getClientIp(request)}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(UNAVAILABLE, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Only token requests for a plan file under our folder. Upload-completed
  // callbacks cannot arrive: no callback URL is put in the token.
  if (!isTokenRequest(body) || !PLAN_PATHNAME_RE.test(body.payload.pathname)) {
    return NextResponse.json(
      { error: "Only PDF, JPG and PNG plan files can be uploaded." },
      { status: 400 }
    );
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...PLAN_UPLOAD.types],
        maximumSizeInBytes: PLAN_UPLOAD.maxBytesEach,
        addRandomSuffix: true,
        ttlDays: PLAN_UPLOAD.ttlDays,
      }),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Builder portal upload token error:", error);
    return NextResponse.json(
      { error: `Could not start the upload. Please try again, or email your plans to ${BUSINESS.email}.` },
      { status: 400 }
    );
  }
}

type TokenRequest = {
  type: "blob.generate-client-token";
  payload: { pathname: string; multipart: boolean; clientPayload: string | null };
};

function isTokenRequest(value: unknown): value is TokenRequest {
  if (!value || typeof value !== "object") return false;
  const body = value as { type?: unknown; payload?: { pathname?: unknown } };
  return body.type === "blob.generate-client-token" && typeof body.payload?.pathname === "string";
}

/**
 * Friction for scripted abuse, not a security boundary: a browser on another
 * site cannot mint tokens, a script that sets no Origin still can. The real
 * limits are the token constraints, the rate limit and the blob expiry.
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim();
  if (!host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
