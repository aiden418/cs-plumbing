import type { Metadata } from "next";
import { DocSection, PrintDocument } from "@/components/builders/PrintDocument";
import {
  BUILDER_DESK,
  BUILDER_PROOF,
  CONSTRUCTION_PHASES,
  NEW_CONSTRUCTION_CITIES,
  PHASE_SCHEDULE_NOTE,
  QUALIFICATIONS,
  SCHEDULING_NOTE,
  SERVICE_COVERAGE,
  SWFL_EXPERTISE,
} from "@/lib/builder-program";
import { AWARDS, BUSINESS, CONTRACTOR_RANKING, NEW_CONSTRUCTION_BENEFITS } from "@/lib/constants";

// Source for public/downloads/cs-plumbing-capability-statement.pdf.
// Regenerate after editing builder-program.ts: npm run builders:pdf
export const metadata: Metadata = {
  title: "Capability Statement — New Construction Plumbing",
  description: `${BUILDER_PROOF.headline}. C&S Plumbing of Lee capability statement for builders and general contractors.`,
  alternates: { canonical: "/builders/capability-statement" },
  robots: { index: false, follow: true },
};

export default function CapabilityStatementPage() {
  return (
    <PrintDocument title="Capability Statement · New Construction Plumbing">
      <div className="mt-5 rounded-xl bg-navy p-5 text-white">
        <p className="text-2xl font-black">{BUILDER_PROOF.headline}</p>
        <p className="mt-1 text-white/75">
          {BUSINESS.repipesCompleted.toLocaleString()}+ homes repiped. {BUILDER_PROOF.subline}
        </p>
      </div>

      <DocSection title="Company">
        <p>
          Founded in Cape Coral in {BUSINESS.founded} by brothers Chris and Sam Pellechio with their
          father. Family owned and operated since {BUSINESS.founded}:{" "}
          {BUILDER_PROOF.generations.map((g) => `${g.name} (${g.role.toLowerCase()})`).join(" → ")}.
          Office at {BUSINESS.address}, {BUSINESS.city}, FL.
        </p>
      </DocSection>

      <DocSection title="Core competencies — slab to final">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {CONSTRUCTION_PHASES.map((p) => (
            <li key={p.id}>
              <strong className="text-navy">{p.name}.</strong> {p.summary}
            </li>
          ))}
          <li>
            <strong className="text-navy">Estimating & PM.</strong> Plan takeoffs, bid scopes, phase
            scheduling, trade sequencing, permits and inspections.
          </li>
        </ul>
        <p className="mt-2 text-gray-600">{PHASE_SCHEDULE_NOTE}</p>
      </DocSection>

      <DocSection title="Qualifications">
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {QUALIFICATIONS.map((q) => (
            <li key={q.id}>• {q.label}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          Ranking source: {CONTRACTOR_RANKING.source} contractor profile, {CONTRACTOR_RANKING.sourceUrl} (third-party
          ranking, not a state-issued rating; checked {CONTRACTOR_RANKING.checkedOn}).
        </p>
      </DocSection>

      <DocSection title="Customer benefits — after the build">
        <p className="font-semibold text-navy">{NEW_CONSTRUCTION_BENEFITS.heading}</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {NEW_CONSTRUCTION_BENEFITS.items.map((b) => (
            <li key={b.id}>
              <strong>{b.title} ({b.appliesTo.toLowerCase()}).</strong> {b.body}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-gray-500">Customer benefits are separate from warranty terms.</p>
      </DocSection>

      <DocSection title="Southwest Florida conditions">
        <ul className="list-disc space-y-1 pl-5">
          {SWFL_EXPERTISE.map((e) => (
            <li key={e.id}>
              <strong>{e.title}.</strong> {e.body}
            </li>
          ))}
        </ul>
      </DocSection>

      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        <DocSection title="Service area">
          <p>
            {SERVICE_COVERAGE}, including {NEW_CONSTRUCTION_CITIES.map((c) => c.city).join(", ")}.
          </p>
        </DocSection>
        <DocSection title="Scheduling">
          <p>{SCHEDULING_NOTE}</p>
        </DocSection>
        <DocSection title="Licenses & verification">
          <p>
            Florida Certified Plumbing Contractor {BUSINESS.license} and {BUSINESS.license2}. Verify by
            license number at myfloridalicense.com (DBPR).
          </p>
        </DocSection>
        <DocSection title="Recognition">
          <ul className="space-y-0.5">
            {AWARDS.map((a) => (
              <li key={a.slug}>
                {a.title} — {a.category} ({a.issuer} readers)
              </li>
            ))}
          </ul>
        </DocSection>
      </div>

      <DocSection title="Point of contact">
        <p>
          Bids, scheduling and documents: {BUILDER_DESK.contactName}, {BUILDER_DESK.contactRole} ·{" "}
          {BUILDER_DESK.phone} · {BUILDER_DESK.email}. Owner: Samuel &ldquo;Sam&rdquo; Pellechio ·{" "}
          {BUSINESS.ownerPhone} or 833-PLUMB-IT ext. 1. Submit plans at csplumbinglee.com/builders.
        </p>
      </DocSection>
    </PrintDocument>
  );
}
