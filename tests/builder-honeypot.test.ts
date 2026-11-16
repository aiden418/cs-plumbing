import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BuilderBidForm from "../src/components/builders/BuilderBidForm";
import BuilderPortalPage from "../src/app/builder-portal/BuilderPortalPage";

/**
 * Both builder forms post to /api/builder-portal, which drops a submission
 * whose `website` field is filled in (tests/builder-portal-route.test.ts). That
 * only works if the field is in the page. The Builder Portal wizard shipped
 * without it; this reads the HTML each form renders on the server and checks
 * the field is there, in the same shape as on the other forms.
 */

test("both builder forms render the website honeypot: in the page, out of sight, not display:none", () => {
  const forms = {
    "bid form": renderToStaticMarkup(createElement(BuilderBidForm, { source: "builders-hub" })),
    "portal wizard": renderToStaticMarkup(createElement(BuilderPortalPage)),
  };
  for (const [name, html] of Object.entries(forms)) {
    const inputs = html.match(/<input\b[^>]*\bname="website"[^>]*>/g) ?? [];
    assert.equal(inputs.length, 1, `${name}: exactly one website field`);
    const input = inputs[0];
    assert.match(input, /\btype="text"/, name);
    assert.match(input, /\btabindex="-1"/i, name);
    assert.match(input, /\bautocomplete="off"/i, name);
    assert.match(input, /\baria-hidden="true"/, name);
    // A bot that skips fields hidden with display:none, visibility:hidden or
    // the hidden attribute must still find this one.
    const classes = (input.match(/\bclass="([^"]*)"/)?.[1] ?? "").split(/\s+/);
    for (const banned of ["hidden", "invisible"]) {
      assert.ok(!classes.includes(banned), `${name}: class "${banned}" on the honeypot`);
    }
    assert.doesNotMatch(input, /(?<![\w-])hidden(?=[\s=/>])|display:\s*none|visibility:\s*hidden/i, name);
  }
});

test("the wizard's honeypot starts empty, so a real submission is never dropped", () => {
  const html = renderToStaticMarkup(createElement(BuilderPortalPage));
  const input = html.match(/<input\b[^>]*\bname="website"[^>]*>/)?.[0] ?? "";
  assert.match(input, /\bvalue=""/);
});
