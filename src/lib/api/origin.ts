/**
 * Same-origin check for the public form endpoints (/api/contact, booking,
 * quote, builder-portal, estimator).
 *
 * A browser always sends an Origin header on a cross-site POST, so a request
 * whose Origin names another site, or the opaque "null" origin, cannot have
 * come from one of our own pages and is refused. A request with no Origin at
 * all (curl, the local delivery harness, server-to-server) is left alone: the
 * forms are lead capture with no session to forge, and schema validation, the
 * honeypot, the rate limit and Vercel's firewall stay in front of those
 * callers either way.
 *
 * The Origin is compared with the Host header. Vercel routes on Host and
 * rewrites the forwarded-host headers to match it, so a client cannot make a
 * foreign Origin "match" by adding headers of its own.
 *
 * Dependency-free on purpose: unit-tested without the Next.js runtime.
 */
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return true;

  const value = origin.trim();
  if (value === "" || value === "null") return false;

  let originHost: string;
  try {
    originHost = new URL(value).host;
  } catch {
    return false;
  }

  const host = (request.headers.get("host") ?? "").trim();
  if (!host || !originHost) return false;
  return originHost.toLowerCase() === host.toLowerCase();
}
