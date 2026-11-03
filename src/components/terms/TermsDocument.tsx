import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import {
  AUDIENCE_LABEL,
  TERMS_EFFECTIVE_DATE,
  TERMS_PLAIN_ENGLISH,
  TERMS_REVISIONS,
  TERMS_SHORT_URL,
  TERMS_VERSION,
  formatTermsDate,
  itemLetter,
  numberedTerms,
  type NumberedClause,
  type NumberedSection,
} from "@/lib/terms";
import TermsPrintButton from "./TermsPrintButton";

// Print: the same pattern as PrintDocument (builders) — hide everything that
// is not inside .terms-doc, so the navbar, hero, footer, sticky CTA and chat
// widget fall away and the letterhead inside the article takes over. The
// @page margin boxes put the revision and page numbers on every sheet in
// Chrome/Edge 131+ and headless Chromium; other browsers print without the
// running footer but still get the page-1 letterhead.
const PRINT_CSS = `
@page {
  size: Letter;
  margin: 0.6in 0.6in 0.8in;
  @bottom-left {
    content: "${BUSINESS.legalName} · Terms & Conditions rev. ${TERMS_VERSION} · ${TERMS_SHORT_URL}";
    font: 8pt system-ui, sans-serif;
    color: #666;
  }
  @bottom-right {
    content: "Page " counter(page) " of " counter(pages);
    font: 8pt system-ui, sans-serif;
    color: #666;
  }
}
@media print {
  html, body { background: #fff !important; font-size: 9.5pt; line-height: 1.4; }
  body :not(:has(.terms-doc)):not(.terms-doc):not(.terms-doc *) { display: none !important; }
  main { min-height: 0 !important; padding: 0 !important; }
  .terms-doc { max-width: none !important; }
  .terms-doc a { color: inherit; text-decoration: none; }
  .terms-doc h2 { break-after: avoid; margin-top: 1.4em !important; margin-bottom: 0.5em !important; font-size: 13pt !important; }
  .terms-doc .clause + .clause { margin-top: 0.55em !important; }
  .terms-doc p, .terms-doc li { orphans: 3; widows: 3; }
  .terms-doc li { break-inside: avoid; }
  .terms-toc { position: static !important; break-inside: avoid; }
  .terms-toc ol { columns: 2; column-gap: 2em; }
  .terms-toc li { break-inside: avoid; }
}
`;

function ClauseLinks({ clause }: { clause: NumberedClause }) {
  if (!clause.links?.length) return null;
  return (
    <>
      {" "}
      {clause.links.map((link, i) => {
        const external = /^https?:/.test(link.href);
        const internal = link.href.startsWith("/");
        const cls = "text-primary font-medium underline-offset-2 hover:underline";
        return (
          <span key={link.href}>
            {i > 0 && <span className="mx-1 text-gray-300">·</span>}
            {internal ? (
              <Link href={link.href} className={cls}>
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className={cls}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            )}
          </span>
        );
      })}
    </>
  );
}

function Clause({ clause }: { clause: NumberedClause }) {
  if (clause.notice) {
    return (
      <div
        id={clause.id}
        className="clause scroll-mt-24 rounded-lg border border-gray-300 bg-surface px-4 py-3 text-xs sm:text-sm font-semibold leading-relaxed text-gray-900 print:border-gray-400 print:bg-white"
      >
        {clause.text}
      </div>
    );
  }
  return (
    <div id={clause.id} className="clause scroll-mt-24">
      <p>
        <span className="mr-2 font-semibold text-gray-900 tabular-nums">{clause.number}</span>
        {clause.heading && <strong className="text-gray-900">{clause.heading} </strong>}
        {clause.text}
        <ClauseLinks clause={clause} />
      </p>
      {clause.items && (
        <ol className="mt-2 ml-7 space-y-1">
          {clause.items.map((item, k) => (
            <li key={k} className="relative pl-7">
              <span className="absolute left-0 tabular-nums text-gray-500">{itemLetter(k)}</span>
              {item}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Section({ section }: { section: NumberedSection }) {
  const audience = AUDIENCE_LABEL[section.audience];
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">
        <span className="mr-2 text-primary tabular-nums">{section.number}.</span>
        {section.title}
        {audience && (
          <span className="ml-2 inline-block align-middle rounded bg-gold/15 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-navy">
            {audience}
          </span>
        )}
      </h2>
      {section.intro && <p className="mb-4 italic">{section.intro}</p>}
      <div className="space-y-4">
        {section.clauses.map((clause) => (
          <Clause key={clause.id} clause={clause} />
        ))}
      </div>
    </section>
  );
}

export default function TermsDocument() {
  const sections = numberedTerms();
  const effective = formatTermsDate(TERMS_EFFECTIVE_DATE);
  const phoneDigits = BUSINESS.phoneRaw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  return (
    <article className="terms-doc mx-auto max-w-5xl">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Print-only letterhead. Lives inside the article so the print CSS keeps it. */}
      <header className="hidden print:block border-b-2 border-navy pb-3 mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Terms &amp; Conditions</p>
        <h1 className="text-2xl font-black text-navy">{BUSINESS.fullName}</h1>
        <p className="text-xs text-gray-600">
          {BUSINESS.legalName} · Florida Certified Plumbing Contractor {BUSINESS.license} · {BUSINESS.license2}
        </p>
        <p className="text-xs text-gray-600">
          {BUSINESS.address}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip} · {BUSINESS.phone} ({phoneDigits}) ·{" "}
          {BUSINESS.email}
        </p>
        <p className="mt-1 text-xs font-semibold text-gray-800">
          Rev. {TERMS_VERSION} · Effective {effective} · {TERMS_SHORT_URL}
        </p>
      </header>

      {/* Screen-only revision banner */}
      <div className="print:hidden flex flex-col gap-4 rounded-xl border border-gray-200 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-gray-900">
            Revision {TERMS_VERSION} · Effective {effective}
          </p>
          <p className="mt-1">
            Estimates, proposals, and invoices cite this page as{" "}
            <span className="font-medium text-gray-900">Terms rev. {TERMS_VERSION}</span>. The revision on your
            document governs your job.
          </p>
        </div>
        <TermsPrintButton />
      </div>

      {/* Plain-English summary */}
      <div className="mt-8 rounded-xl border border-gold/40 bg-gold/5 p-5 sm:p-6 print:border-gray-300 print:bg-white">
        <p className="text-[11px] font-bold uppercase tracking-wider text-navy">In plain English</p>
        <p className="mt-1 text-xs text-gray-500">
          A summary to help you read the Terms. The numbered Sections below are the agreement.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          {TERMS_PLAIN_ENGLISH.map((line) => (
            <li key={line} className="relative pl-5">
              <span className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="Contents" className="terms-toc lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Contents</p>
          <ol className="mt-2 space-y-1 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-gray-600 hover:text-primary transition-colors">
                  <span className="mr-1.5 tabular-nums text-gray-400">{s.number}.</span>
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#revision-history" className="text-gray-600 hover:text-primary transition-colors">
                <span className="mr-1.5 tabular-nums text-gray-400">{sections.length + 1}.</span>
                Revision history
              </a>
            </li>
          </ol>
        </nav>

        <div className="min-w-0 text-sm sm:text-base text-gray-600">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}

          <section id="revision-history" className="scroll-mt-24">
            <h2 className="mt-10 mb-3 text-xl font-bold text-gray-900">
              <span className="mr-2 text-primary tabular-nums">{sections.length + 1}.</span>
              Revision history
            </h2>
            <ul className="space-y-2">
              {TERMS_REVISIONS.map((r) => (
                <li key={r.version} className="clause">
                  <span className="font-semibold text-gray-900">Rev. {r.version}</span> (effective{" "}
                  {formatTermsDate(r.effectiveDate)}): {r.note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
