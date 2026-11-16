import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Button, { classifyHref, relFor, type ButtonProps } from "../src/components/ui/Button";
import { stepState, stepStates } from "../src/components/ui/Stepper";
import Stepper from "../src/components/ui/Stepper";
import { stepOfLabel } from "../src/components/ui/WizardProgress";
import WizardProgress from "../src/components/ui/WizardProgress";
import Reveal, { REVEAL_MAX_STAGGER, revealIndex, startsBelowFold } from "../src/components/ui/Reveal";
import FaqAccordion from "../src/components/ui/FaqAccordion";
import Breadcrumbs from "../src/components/ui/Breadcrumbs";
import { installMediaStubs } from "./fixtures/media-stubs";
import { BUSINESS } from "../src/lib/business";

// Button --------------------------------------------------------------------

const button = (props: Partial<ButtonProps>, label: string) => createElement(Button, props as ButtonProps, label);

test("href classification: pages of the site go through next/link, the rest are plain links", () => {
  assert.equal(classifyHref("/booking"), "internal");
  assert.equal(classifyHref("/services/drain-cleaning?x=1#faq"), "internal");
  assert.equal(classifyHref("#request-service"), "internal");
  assert.equal(classifyHref("?plan=gold"), "internal");
  assert.equal(classifyHref(BUSINESS.phoneHref), "tel");
  assert.equal(classifyHref(BUSINESS.smsHref), "sms");
  assert.equal(classifyHref(`mailto:${BUSINESS.email}`), "mailto");
  assert.equal(classifyHref("https://www.google.com/maps"), "external");
  assert.equal(classifyHref("HTTP://example.com"), "external");
  assert.equal(classifyHref("//cdn.example.com/a.pdf"), "external");
  assert.equal(classifyHref("javascript:void(0)"), "other");
});

test("rel: noopener noreferrer only for an external link opened in a new tab", () => {
  assert.equal(relFor("external", "_blank", undefined), "noopener noreferrer");
  assert.equal(relFor("external", undefined, undefined), undefined);
  assert.equal(relFor("tel", "_blank", undefined), undefined);
  assert.equal(relFor("external", "_blank", "me"), "me");
});

test("a tel: button is a plain <a> with no handler and keeps its label", () => {
  const html = renderToStaticMarkup(button({ href: BUSINESS.phoneHref }, `Call ${BUSINESS.phone}`));
  assert.match(html, /^<a /);
  assert.ok(html.includes(`href="${BUSINESS.phoneHref}"`));
  assert.ok(html.includes(`Call ${BUSINESS.phone}`));
  assert.ok(!html.includes("rel="));
});

test("a loading button keeps its label, is busy and does not submit", () => {
  const html = renderToStaticMarkup(button({ type: "submit", loading: true }, "Send request"));
  assert.ok(html.includes("Send request"));
  assert.ok(html.includes('aria-busy="true"'));
  assert.ok(html.includes('type="button"'));
  assert.ok(!html.includes("disabled="));
});

test("a disabled link has no href", () => {
  const html = renderToStaticMarkup(button({ href: "/booking", disabled: true }, "Book"));
  assert.ok(!html.includes("href="));
  assert.ok(html.includes('aria-disabled="true"'));
});

test("labels are never uppercased", () => {
  const html = renderToStaticMarkup(button({ variant: "gold" }, "Get a quote"));
  assert.ok(!/\buppercase\b/.test(html));
});

// Stepper -------------------------------------------------------------------

test("step states follow the current index; an item's own state wins", () => {
  assert.deepEqual([0, 1, 2, 3].map((i) => stepState(i, 1)), ["done", "current", "todo", "todo"]);
  assert.deepEqual([0, 1].map((i) => stepState(i, undefined)), ["todo", "todo"]);
  assert.deepEqual([0, 1].map((i) => stepState(i, -1)), ["todo", "todo"]);
  assert.deepEqual(stepStates([{}, { state: "done" }, {}], 0), ["current", "done", "todo"]);
});

test("the stepper is nav > ol with aria-current on the current step only", () => {
  const html = renderToStaticMarkup(
    createElement(Stepper, { label: "Phases", current: 1, items: [{ label: "A" }, { label: "B", href: "#b" }, { label: "C" }] }),
  );
  assert.match(html, /^<nav aria-label="Phases"[^>]*><ol/);
  assert.equal(html.match(/aria-current="step"/g)?.length, 1);
  assert.ok(/<a[^>]*href="#b"[^>]*aria-current="step"|<a[^>]*aria-current="step"[^>]*href="#b"/.test(html));
});

test("wizard progress reads 'Step 2 of 4'", () => {
  assert.equal(stepOfLabel(1, 4), "Step 2 of 4");
  assert.equal(stepOfLabel(9, 4), "Step 4 of 4");
  assert.equal(stepOfLabel(-3, 4), "Step 1 of 4");
  const html = renderToStaticMarkup(createElement(WizardProgress, { steps: ["Service", "Details", "Time", "Review"], current: 1 }));
  assert.ok(html.includes("Step 2 of 4"));
  assert.equal(html.match(/aria-current="step"/g)?.length, 1);
});

// Reveal --------------------------------------------------------------------

test("reveal stagger is clamped to six items", () => {
  assert.equal(REVEAL_MAX_STAGGER, 6);
  assert.equal(revealIndex(undefined), 0);
  assert.equal(revealIndex(-2), 0);
  assert.equal(revealIndex(Number.NaN), 0);
  assert.equal(revealIndex(2.7), 2);
  assert.equal(revealIndex(40), 5);
});

test("only elements that start below the fold are held back", () => {
  assert.equal(startsBelowFold(900, 844), true);
  assert.equal(startsBelowFold(844, 844), true);
  assert.equal(startsBelowFold(843, 844), false);
  assert.equal(startsBelowFold(-400, 844), false); // scrolled past: stays visible
});

test("Reveal writes attributes only: nothing is hidden in the server HTML", () => {
  const html = renderToStaticMarkup(createElement(Reveal, { index: 3 }, "Hello"));
  assert.equal(html, '<div data-reveal="" style="--reveal-i:3">Hello</div>');
  assert.ok(!/opacity|hidden/.test(html));
});

// Legacy wrappers ------------------------------------------------------------

test("every FAQ answer is in the HTML, in native exclusive details", () => {
  const faqs = [
    { question: "Q one?", answer: "Answer one." },
    { question: "Q two?", answer: "Answer two." },
  ];
  const html = renderToStaticMarkup(createElement(FaqAccordion, { faqs }));
  assert.equal(html.match(/<details /g)?.length, 2);
  assert.equal(html.match(/<summary /g)?.length, 2);
  assert.ok(html.includes("Answer one.") && html.includes("Answer two."));
  const names = [...html.matchAll(/name="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(names.length, 2);
  assert.equal(names[0], names[1]);
  assert.ok(!/<details[^>]*\sopen(?:[\s>=])/.test(html));
});

test("breadcrumbs mark the last crumb as the current page", () => {
  const html = renderToStaticMarkup(
    createElement(Breadcrumbs, { items: [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Repiping" }] }),
  );
  assert.match(html, /^<nav aria-label="Breadcrumb"><ol/);
  assert.equal(html.match(/aria-current="page"/g)?.length, 1);
  assert.ok(html.includes('href="/services"'));
});

test("CTASection keeps its words and links", async () => {
  // The band shows a photograph from the picture system, which plain Node cannot import.
  installMediaStubs();
  const { default: CTASection } = await import("../src/components/home/CTASection");
  const html = renderToStaticMarkup(createElement(CTASection));
  assert.ok(html.includes("Ready to Get Started?"));
  assert.ok(html.includes("Southwest Florida&#x27;s most trusted plumbing company."));
  assert.ok(html.includes('href="/booking"') && html.includes("Book a Service"));
  assert.ok(html.includes(`href="${BUSINESS.phoneHref}"`) && html.includes(`Call ${BUSINESS.phone}`));
  assert.ok(html.includes("Free estimates · No hidden fees · Satisfaction guaranteed"));
  assert.ok(html.includes('data-tone="ink"'));
});
