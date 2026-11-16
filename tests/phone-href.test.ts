import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import ts from "typescript";
import { BUSINESS } from "../src/lib/business";
import { BUILDER_DESK } from "../src/lib/builder-program";
import { NEW_CONSTRUCTION_BENEFITS } from "../src/lib/constants";
import { ROOT, listSourceFiles, parseSource, rel, textNodes } from "./support/source-scan";

// Every link that dials the company line uses BUSINESS.phoneHref
// ("tel:+1" and the ten digits), or a field that is that value
// (BUILDER_DESK.phoneHref, NEW_CONSTRUCTION_BENEFITS.contactHref). Until this
// test existed the site built `tel:${BUSINESS.phoneRaw}` in about forty
// places and typed the digits into nineteen blog links, all without the
// country code.
//
// Links that dial someone else (a partner on /partners, the person who
// submitted a form in the office emails) are built from that person's
// number and are not affected. The JSON-LD telephone fields are not links;
// they keep building "+1" + phoneRaw.

const sources = listSourceFiles().map((file) => ({ file, name: rel(file), source: parseSource(file) }));
const lineOf = (source: ts.SourceFile, node: ts.Node) =>
  source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

/** The literal text an expression ends with, when that can be read off the source. */
function trailingText(node: ts.Expression): string | undefined {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isTemplateExpression(node)) return node.templateSpans[node.templateSpans.length - 1].literal.text;
  if (ts.isParenthesizedExpression(node)) return trailingText(node.expression);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) return trailingText(node.right);
  return undefined;
}

const endsWithTel = (text: string | undefined) => text !== undefined && /tel:(\+1)?$/.test(text);

/** Every expression placed directly after "tel:" (or "tel:+1"), by template or by `+`. */
function assembledTelLinks(source: ts.SourceFile): { expression: string; line: number }[] {
  const out: { expression: string; line: number }[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isTemplateExpression(node)) {
      node.templateSpans.forEach((span, i) => {
        const before = i === 0 ? node.head.text : node.templateSpans[i - 1].literal.text;
        if (endsWithTel(before)) out.push({ expression: span.expression.getText(source), line: lineOf(source, span) });
      });
    } else if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.PlusToken &&
      endsWithTel(trailingText(node.left))
    ) {
      out.push({ expression: node.right.getText(source), line: lineOf(source, node.right) });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

test("the phone forms in BUSINESS are all the same ten digits", () => {
  const raw = BUSINESS.phoneRaw;
  assert.match(raw, /^\d{10}$/, "phoneRaw is ten digits, no country code");
  assert.equal(BUSINESS.phoneE164, "+1" + raw);
  assert.equal(BUSINESS.phoneHref, "tel:+1" + raw);
  assert.equal(BUSINESS.phoneDigits, `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`);
  assert.ok(BUSINESS.smsHref.startsWith(`sms:${BUSINESS.phoneE164}?`), "the text link uses the same number");
  assert.equal(BUSINESS.builderPhone, `${BUSINESS.phone} ext. 0`);
  assert.equal(BUSINESS.ownerPhone, `${BUSINESS.phone} ext. 1`);
});

test("the builder desk and the new-construction benefits line dial the company line", () => {
  assert.equal(BUILDER_DESK.phoneHref, BUSINESS.phoneHref);
  assert.equal(NEW_CONSTRUCTION_BENEFITS.contactHref, BUSINESS.phoneHref);
});

test("no source file types the company number into a tel: link", () => {
  const offenders: string[] = [];
  for (const { name, source } of sources) {
    for (const node of textNodes(source)) {
      // "tel:8337586248", "tel:+18337586248", "tel:833-758-6248", …
      for (const match of node.raw.matchAll(/tel:([+\d().\s-]{7,})/g)) {
        if (match[1].replace(/\D/g, "").endsWith(BUSINESS.phoneRaw)) offenders.push(`${name}:${node.line} ${match[0].trim()}`);
      }
    }
  }
  assert.deepEqual(offenders, [], "Use BUSINESS.phoneHref (in an HTML string: href=\"${BUSINESS.phoneHref}\") instead of typing the number.");
});

test("no tel: link is assembled from phoneRaw or contactRaw", () => {
  const offenders: string[] = [];
  for (const { name, source } of sources) {
    for (const link of assembledTelLinks(source)) {
      if (/\b(phoneRaw|contactRaw)\b/.test(link.expression)) offenders.push(`${name}:${link.line} tel: + ${link.expression}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    "A link that dials the company line takes its whole href from BUSINESS.phoneHref (or BUILDER_DESK.phoneHref / the benefits contactHref): the ten digits alone lack the +1.",
  );
});

test("links to a partner or to the person who sent a form still dial their own number", () => {
  // If one of these is rebuilt, keep its tel: link on the other party's
  // number and update the entry; it must never become BUSINESS.phoneHref.
  const otherParty: [file: string, expression: RegExp][] = [
    ["src/app/partners/PartnersPage.tsx", /\bpartner\.phone\b/],
    ["src/app/api/contact/route.ts", /\bsafe\.phone\b/],
    ["src/app/api/booking/route.ts", /\bsafe\.phone\b/],
    ["src/app/api/builder-portal/route.ts", /\bsafe\.phone\b/],
    ["src/app/api/quote/route.ts", /\bsafeLead\.phone\b/],
  ];
  for (const [file, expression] of otherParty) {
    const links = assembledTelLinks(parseSource(path.join(ROOT, file)));
    assert.ok(
      links.some((link) => expression.test(link.expression)),
      `${file} should still build a tel: link from ${expression.source}; found: ${links.map((l) => l.expression).join(", ") || "none"}`,
    );
  }
});
