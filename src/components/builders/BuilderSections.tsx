import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  HardHat,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  BUILDER_DESK,
  BUILDER_PROOF,
  CAPABILITY_STATEMENT_PDF,
  CONSTRUCTION_PHASES,
  PREQUAL_DOCS,
  PREQUAL_PACKET_PDF,
  PREQUAL_REQUEST_HREF,
  PREQUAL_STATUS_LABEL,
  PHASE_SCHEDULE_NOTE,
  QUALIFICATIONS,
  SCHEDULING_NOTE,
  SERVICE_COVERAGE,
  SWFL_EXPERTISE,
} from "@/lib/builder-program";
import { cn } from "@/lib/utils";

// Server-rendered sections shared by /builders and the
// /new-construction-plumbing/[city] pages. All copy comes from
// src/lib/builder-program.ts. Anything not yet confirmed is hidden, never
// shown as a placeholder.

/** Three-generation story under the proof headline. */
export function BuilderProofStory() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          overline="Three generations"
          title={BUILDER_PROOF.headline}
          subtitle={BUILDER_PROOF.subline}
        />
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BUILDER_PROOF.generations.map((g) => (
            <li key={g.name} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {g.generation} generation
              </span>
              <h3 className="mt-2 text-lg font-bold text-gray-900">{g.name}</h3>
              <p className="text-sm font-medium text-gray-500">{g.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{g.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Phase-by-phase scope and what we need from the GC. No durations — see PHASE_SCHEDULE_NOTE. */
export function ConstructionPhases({ className }: { className?: string }) {
  return (
    <section id="phases" className={cn("scroll-mt-24 bg-[#F5F5F7] py-16 sm:py-24", className)}>
      <Container>
        <SectionHeading
          overline="Scope by phase"
          title="Slab to final, one plumbing sub"
          subtitle="What we do in each phase, what we need on site before we show up, and which inspection closes it out."
        />
        <p className="mx-auto -mt-8 mb-8 flex max-w-3xl items-start justify-center gap-2 text-center text-sm text-gray-600">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {PHASE_SCHEDULE_NOTE}
        </p>
        <ol className="space-y-5">
          {CONSTRUCTION_PHASES.map((phase, i) => (
            <li key={phase.id} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Phase {i + 1}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{phase.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{phase.summary}</p>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                    What we do
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    {phase.scope.map((s) => (
                      <li key={s} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                    What we need from the framer / GC
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-600">
                    {phase.needFromGC.map((s) => (
                      <li key={s} className="flex gap-2">
                        <HardHat className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                {phase.inspection}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** SWFL-specific conditions: water table, flood zones, UEP, materials. */
export function SwflExpertise() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          overline="Built for Southwest Florida"
          title="What's different about plumbing here"
          subtitle="Southwest Florida soil, flood zones and utilities change how new construction plumbing goes in."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SWFL_EXPERTISE.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
              {"href" in item && item.href && (
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {item.title} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Scheduling & coverage. Owner-approved wording; no capacity numbers. */
export function SchedulingPanel() {
  return (
    <section id="scheduling" className="scroll-mt-24 bg-[#F5F5F7] py-16 sm:py-24">
      <Container>
        <SectionHeading
          overline="Scheduling & coverage"
          title="Upcoming starts"
          subtitle={SCHEDULING_NOTE}
        />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <h3 className="font-bold text-gray-900">Where we work</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{SERVICE_COVERAGE}.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 text-primary">
              <CalendarClock className="h-5 w-5" />
              <h3 className="font-bold text-gray-900">Talk to estimating</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <a href={`tel:${BUILDER_DESK.phoneRaw}`} className="font-medium text-primary hover:underline">
                {BUILDER_DESK.phone}
              </a>{" "}
              ·{" "}
              <a href={`mailto:${BUILDER_DESK.email}`} className="font-medium text-primary hover:underline">
                {BUILDER_DESK.email}
              </a>
              , or{" "}
              <a href="#bid" className="font-medium text-primary hover:underline">
                send plans for a bid
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Owner-confirmed qualifications. */
export function Qualifications() {
  return (
    <section id="qualifications" className="scroll-mt-24 bg-navy py-16 sm:py-24">
      <Container>
        <SectionHeading
          tone="dark"
          overline="Qualifications"
          title="What your office will ask about"
          subtitle="Insurance, safety, billing and how we staff the work."
        />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUALIFICATIONS.map((q) => (
            <li key={q.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>
                {q.label}
                {"sourceUrl" in q && (
                  <span className="mt-1 block text-xs text-white/60">
                    Source:{" "}
                    <a
                      href={q.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-white"
                    >
                      {q.source} profile
                    </a>{" "}
                    (third-party ranking, checked {q.checkedOn})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Prequal packet: licenses + DBPR link, everything else on request via the office. */
export function PrequalDocs() {
  return (
    <section id="prequal" className="scroll-mt-24 py-16 sm:py-24">
      <Container>
        <SectionHeading
          overline="Prequalification"
          title="Capability statement & prequal packet"
          subtitle="What your office needs to set us up as a vendor. Licenses verify online; everything else is sent by our office on request."
        />
        <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={CAPABILITY_STATEMENT_PDF}
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" /> Capability statement (PDF)
          </a>
          <a
            href={PREQUAL_PACKET_PDF}
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 hover:border-primary hover:text-primary"
          >
            <Download className="h-4 w-4" /> Prequal packet (PDF)
          </a>
          <a
            href={PREQUAL_REQUEST_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 hover:border-primary hover:text-primary"
          >
            <Mail className="h-4 w-4" /> Request documents
          </a>
        </div>
        <ul className="mx-auto max-w-4xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {PREQUAL_DOCS.map((doc) => (
            <li key={doc.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="font-semibold text-gray-900">{doc.title}</p>
                <p className="mt-1 text-sm text-gray-500">{doc.detail}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                    doc.status === "available" ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy"
                  )}
                >
                  {PREQUAL_STATUS_LABEL[doc.status]}
                </span>
                {doc.href ? (
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {doc.hrefLabel} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <a href={PREQUAL_REQUEST_HREF} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Request <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-gray-500">
          Document requests go to{" "}
          <a href={PREQUAL_REQUEST_HREF} className="font-medium text-primary hover:underline">
            {BUILDER_DESK.email}
          </a>
          . Tell us the project and any certificate-holder or additional-insured wording.
        </p>
      </Container>
    </section>
  );
}

/** The builder-facing PM/estimating desk, framed as a team function. */
export function BuilderDesk() {
  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-24">
      <Container>
        <SectionHeading
          overline="Your point of contact"
          title="A project management desk for builders"
          subtitle="Builder work runs through our office: one team handling bids, schedule and sequencing, backed by the same crews that have been in the field since 1998."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BUILDER_DESK.functions.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Bids and scheduling: {BUILDER_DESK.contactName}, {BUILDER_DESK.contactRole} ·{" "}
          <a href={`mailto:${BUILDER_DESK.email}`} className="font-medium text-navy underline underline-offset-2">
            {BUILDER_DESK.email}
          </a>{" "}
          ·{" "}
          <a href={`tel:${BUILDER_DESK.phoneRaw}`} className="font-medium text-navy underline underline-offset-2">
            {BUILDER_DESK.phone}
          </a>
        </p>
      </Container>
    </section>
  );
}
