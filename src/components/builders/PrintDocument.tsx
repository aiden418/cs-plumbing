import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/constants";

// Letter-size, print-first document shell for the capability statement and
// prequal packet. The same page is the web view and the source for the PDFs
// in public/downloads (scripts/build-builder-pdfs.mjs prints it with headless
// Chrome). In print, everything outside .print-doc — nav, footer, sticky
// CTA, chat — is removed from layout so no blank trailing pages appear.
const PRINT_CSS = `
@page { size: Letter; margin: 0.5in; }
@media print {
  html, body { background: #fff !important; }
  body :not(:has(.print-doc)):not(.print-doc):not(.print-doc *) { display: none !important; }
  main { min-height: 0 !important; padding: 0 !important; }
  .print-doc { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; border: 0 !important; }
  .print-doc a { color: inherit; text-decoration: none; }
  .print-shell { background: #fff !important; padding: 0 !important; }
  .print-doc h2 { break-after: avoid; }
  /* Header already carries every contact detail; the footer only ever
     added a near-empty trailing page. */
  .print-doc footer { display: none !important; }
  .print-doc li, .print-doc tr, .print-doc header { break-inside: avoid; }
}
`;

export function PrintDocument({ title, children }: { title: string; children: ReactNode }) {
  const phoneDigits = BUSINESS.phoneRaw.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  return (
    <div className="print-shell bg-[#F5F5F7] px-4 pb-16 pt-28 sm:pt-32">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <article className="print-doc mx-auto max-w-[8.5in] rounded-2xl border border-gray-200 bg-white p-8 text-[13px] leading-relaxed text-gray-800 shadow-sm sm:p-12">
        <header className="flex flex-col gap-4 border-b-4 border-navy pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{title}</p>
            <h1 className="text-3xl font-black text-navy">{BUSINESS.fullName}</h1>
            <p className="text-gray-500">
              Florida Certified Plumbing Contractor · {BUSINESS.license} · {BUSINESS.license2}
            </p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p>
              {BUSINESS.address}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
            </p>
            <p>
              {BUSINESS.phone} ({phoneDigits}) ext. 0 · {BUSINESS.email}
            </p>
            <p>csplumbinglee.com/builders</p>
          </div>
        </header>
        {children}
        <footer className="mt-8 border-t border-gray-200 pt-3 text-[10px] text-gray-400">
          {BUSINESS.fullName} · {BUSINESS.license} / {BUSINESS.license2} · {BUSINESS.phone} ({phoneDigits}) ·
          csplumbinglee.com
        </footer>
      </article>
    </div>
  );
}

export function DocSection({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`mt-6 ${className ?? ""}`}>
      <h2 className="mb-2 border-b border-gray-200 pb-1 text-sm font-black uppercase tracking-wider text-navy">
        {title}
      </h2>
      {children}
    </section>
  );
}
