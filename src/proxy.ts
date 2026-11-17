import { NextRequest, NextResponse } from "next/server";
import { ATTRIBUTION_COOKIE, ATTRIBUTION_SECONDS, captureAttribution, encodeAttribution } from "./lib/lead-attribution";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.headers.get("sec-gpc") === "1") {
    if (request.cookies.has(ATTRIBUTION_COOKIE)) response.cookies.delete(ATTRIBUTION_COOKIE);
    return response;
  }
  const analytics = process.env.NEXT_PUBLIC_ANALYTICS;
  if (analytics === "off" || analytics === "placeholder") return response;
  // Capture real document arrivals, not assets, API calls, or speculative link prefetches.
  if (request.method !== "GET" || !request.headers.get("accept")?.includes("text/html") || request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") return response;
  const attribution = captureAttribution(request.nextUrl, request.headers.get("referer"));
  if (!attribution) return response; // Direct returns keep the previous source without extending its life.
  const value = encodeAttribution(attribution);
  // Next's cookie serializer performs URL encoding; do not encode it twice.
  if (value) response.cookies.set(ATTRIBUTION_COOKIE, decodeURIComponent(value), {
    httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: ATTRIBUTION_SECONDS,
  });
  return response;
}

export const config = { matcher: ["/((?!api|_next|images|fonts|videos|favicon.ico|robots.txt|sitemap.xml).*)"] };
