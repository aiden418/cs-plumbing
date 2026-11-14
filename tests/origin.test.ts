import { test } from "node:test";
import assert from "node:assert/strict";
import { isTrustedOrigin } from "../src/lib/api/origin";

// A plain Headers object (no "request" guard) so the Host header survives.
const withHeaders = (h: Record<string, string>) => ({ headers: new Headers(h) }) as Request;

test("same-origin browser POST is trusted", () => {
  assert.equal(
    isTrustedOrigin(withHeaders({ origin: "https://www.csplumbinglee.com", host: "www.csplumbinglee.com" })),
    true,
  );
});

test("host comparison ignores case and keeps the port", () => {
  assert.equal(isTrustedOrigin(withHeaders({ origin: "http://localhost:3000", host: "localhost:3000" })), true);
  assert.equal(isTrustedOrigin(withHeaders({ origin: "https://WWW.csplumbinglee.com", host: "www.csplumbinglee.com" })), true);
  assert.equal(isTrustedOrigin(withHeaders({ origin: "http://localhost:3001", host: "localhost:3000" })), false);
});

test("cross-site Origin is refused", () => {
  assert.equal(isTrustedOrigin(withHeaders({ origin: "https://evil.example", host: "www.csplumbinglee.com" })), false);
  // apex vs www is a different origin; the apex 308s to www before any page loads
  assert.equal(isTrustedOrigin(withHeaders({ origin: "https://csplumbinglee.com", host: "www.csplumbinglee.com" })), false);
  // lookalike that merely contains the host
  assert.equal(
    isTrustedOrigin(withHeaders({ origin: "https://www.csplumbinglee.com.evil.example", host: "www.csplumbinglee.com" })),
    false,
  );
});

test("opaque, empty or malformed Origin is refused", () => {
  assert.equal(isTrustedOrigin(withHeaders({ origin: "null", host: "www.csplumbinglee.com" })), false);
  assert.equal(isTrustedOrigin(withHeaders({ origin: "", host: "www.csplumbinglee.com" })), false);
  assert.equal(isTrustedOrigin(withHeaders({ origin: "not a url", host: "www.csplumbinglee.com" })), false);
});

test("a request with no Origin header (curl, local harness) is left alone", () => {
  assert.equal(isTrustedOrigin(withHeaders({ host: "www.csplumbinglee.com" })), true);
});

test("a matching Origin with no Host to compare against is refused", () => {
  assert.equal(isTrustedOrigin(withHeaders({ origin: "https://www.csplumbinglee.com" })), false);
});

test("client-supplied forwarded-host headers do not widen the match", () => {
  assert.equal(
    isTrustedOrigin(
      withHeaders({
        origin: "https://evil.example",
        host: "www.csplumbinglee.com",
        "x-forwarded-host": "evil.example",
      }),
    ),
    false,
  );
});
