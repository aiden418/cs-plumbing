import type { Metadata } from "next";
import { DocSection, PrintDocument } from "@/components/builders/PrintDocument";
import {
  BUILDER_DESK,
  PREQUAL_DOCS,
  PREQUAL_STATUS_LABEL,
  QUALIFICATIONS,
} from "@/lib/builder-program";
import { BUSINESS, COMPLETED_PROJECTS, CONTRACTOR_RANKING, WARRANTY } from "@/lib/constants";
import { projectStatusLabel } from "@/lib/projects";

// Source for public/downloads/cs-plumbing-prequal-packet.pdf.
// Regenerate after editing builder-program.ts: npm run builders:pdf
export const metadata: Metadata = {
  title: "Prequalification Packet — Builders & GCs",
  description: "C&S Plumbing of Lee vendor prequalification packet: licenses, insurance, W-9, bonding and warranty documents on request.",
  alternates: { canonical: "/builders/prequal-packet" },
  robots: { index: false, follow: true },
};

export default function PrequalPacketPage() {
  const ncProjects = COMPLETED_PROJECTS.filter((p) => p.category === "New Construction");
  return (
    <PrintDocument title="Vendor Prequalification Packet">
      <DocSection title="Company information">
        <table className="w-full text-left">
          <tbody className="[&_td]:py-1 [&_td:first-child]:w-44 [&_td:first-child]:text-gray-500">
            <tr><td>Legal name</td><td>{BUSINESS.legalName}</td></tr>
            <tr><td>Doing business as</td><td>{BUSINESS.fullName}</td></tr>
            <tr><td>Founded</td><td>{BUSINESS.founded}, Cape Coral, FL — family owned and operated</td></tr>
            <tr><td>Owner &amp; co-founder</td><td>Samuel &ldquo;Sam&rdquo; Pellechio · {BUSINESS.ownerPhone} or 833-PLUMB-IT ext. 1</td></tr>
            <tr><td>Office</td><td>{BUSINESS.address}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}</td></tr>
            <tr><td>Phone / email</td><td>{BUSINESS.phone} (833-758-6248) · {BUSINESS.email}</td></tr>
            <tr><td>Builder contact</td><td>{BUILDER_DESK.contactName}, {BUILDER_DESK.contactRole} · {BUILDER_DESK.phone} · {BUILDER_DESK.email}</td></tr>
            <tr><td>Licenses</td><td>Florida Certified Plumbing Contractor {BUSINESS.license} and {BUSINESS.license2}</td></tr>
          </tbody>
        </table>
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

      <DocSection title="Warranty">
        <p>{WARRANTY.detail}</p>
      </DocSection>

      <DocSection title="Documents">
        <p className="mb-3 text-gray-600">
          Licenses verify online. Every other document is sent by our office on request — email{" "}
          <strong>{BUSINESS.email}</strong> or call {BUILDER_DESK.phone} with the project name and any
          certificate-holder or additional-insured wording. No documents are enclosed in this packet.
        </p>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500">
              <th className="py-1.5">Document</th>
              <th className="py-1.5">Status</th>
              <th className="py-1.5">How to get it</th>
            </tr>
          </thead>
          <tbody>
            {PREQUAL_DOCS.map((d) => (
              <tr key={d.id} className="border-b border-gray-100 align-top">
                <td className="py-2 pr-3">
                  <strong>{d.title}</strong>
                  <br />
                  <span className="text-gray-500">{d.detail}</span>
                </td>
                <td className="py-2 pr-3 whitespace-nowrap">{PREQUAL_STATUS_LABEL[d.status]}</td>
                <td className="py-2">
                  {d.status === "available"
                    ? "myfloridalicense.com: search by license number"
                    : `Email ${BUSINESS.email}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection title="Documented new construction projects">
        <ul className="space-y-1">
          {ncProjects.map((p) => (
            <li key={p.slug}>
              <strong>{p.name}</strong>
              {p.location ? `, ${p.location}` : ""} · {projectStatusLabel(p)} · csplumbinglee.com/projects/{p.slug}
            </li>
          ))}
        </ul>
      </DocSection>
    </PrintDocument>
  );
}
