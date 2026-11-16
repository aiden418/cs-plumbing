import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section, { type Tone } from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper from "@/components/ui/Stepper";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Mail,
} from "@/components/ui/icons";
import BuilderBidForm from "@/components/builders/BuilderBidForm";
import { AFTER_SUBMIT, BUILDER_SECTIONS as COPY } from "@/content/builders";
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
  type ConstructionPhase,
} from "@/lib/builder-program";
import { picture } from "@/lib/media";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Server-rendered sections shared by /builders and the
// /new-construction-plumbing/[city] pages. All copy comes from
// src/lib/builder-program.ts and src/content/builders.ts. Anything not yet
// confirmed is hidden, never shown as a placeholder.

/** Offset for in-page anchors under the fixed header. */
export const ANCHOR_OFFSET = "scroll-mt-[calc(var(--nav-h)+1rem)]";

/** A hairline-ruled text link with an arrow (inline, 44 px tall). */
const textLink =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] hover:underline";

/** A small joint bullet for list rows. */
function JointBullet() {
  return <span className="joint mt-[0.55em] text-accent" aria-hidden="true" />;
}

/** Chapter header on the left (5 of 12 columns), content on the right. */
function SplitChapter({
  heading,
  children,
  className,
}: {
  heading: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-y-10 lg:grid-cols-12 lg:gap-x-8", className)}>
      <div className="lg:col-span-5">{heading}</div>
      <div className="lg:col-span-7">{children}</div>
    </div>
  );
}

/** Three-generation story under the proof headline. */
export function BuilderProofStory({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section tone={tone} labelledBy="builder-proof-heading">
      <Container>
        <SplitChapter
          heading={
            <SectionHeading
              id="builder-proof-heading"
              overline={COPY.proof.overline}
              title={BUILDER_PROOF.headline}
              subtitle={BUILDER_PROOF.subline}
              align="left"
              className="mb-0"
            />
          }
        >
          <ol className="border-b border-rule">
            {BUILDER_PROOF.generations.map((g, i) => (
              <Reveal
                as="li"
                index={i}
                key={g.name}
                className="grid gap-y-2 border-t border-rule py-7 sm:grid-cols-[10rem_1fr] sm:gap-x-8 sm:py-9"
              >
                <p className="label-tech flex items-start gap-2.5 pt-1.5 text-accent">
                  <span className="joint mt-[0.1em]" aria-hidden="true" />
                  <span>
                    {g.generation} {COPY.proof.generationSuffix}
                  </span>
                </p>
                <div>
                  <h3 className="font-display text-display-sm font-bold text-fg [font-stretch:108%]">{g.name}</h3>
                  <p className="mt-1 text-sm font-medium text-muted">{g.role}</p>
                  <p className="mt-3 max-w-[60ch] text-body">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** The named photograph for each phase, where the media map has one. */
const PHASE_PICTURE: Record<string, string> = {
  underground: "builders.phase.underground",
  "top-out": "builders.phase.second-rough",
  trim: "builders.phase.trim-out",
};

function PhaseDetail({ phase, index }: { phase: ConstructionPhase; index: number }) {
  return (
    <>
      <p className="label-tech flex items-center gap-2.5 text-accent">
        <span className="joint" aria-hidden="true" />
        {COPY.phases.phase} {index + 1}
      </p>
      <h3 className="mt-3 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{phase.name}</h3>
      <p className="mt-3 max-w-[56ch] text-lead text-body">{phase.summary}</p>
      <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        <div>
          <h4 className="label-tech border-b border-rule pb-3 text-fg">{COPY.phases.weDo}</h4>
          <ul className="mt-1">
            {phase.scope.map((s) => (
              <li key={s} className="flex gap-3 border-b border-rule py-3 text-[0.9375rem] leading-normal">
                <JointBullet />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="label-tech border-b border-rule pb-3 text-fg">{COPY.phases.weNeed}</h4>
          <ul className="mt-1">
            {phase.needFromGC.map((s) => (
              <li key={s} className="flex gap-3 border-b border-rule py-3 text-[0.9375rem] leading-normal">
                <JointBullet />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 max-w-[60ch] font-medium text-fg">{phase.inspection}</p>
    </>
  );
}

/**
 * Phase-by-phase scope and what we need from the GC, as the connection line:
 * the phases are the joints of a horizontal Stepper, each linking to its
 * row below (real phase photograph where the media map has one, text only
 * otherwise). No durations — see PHASE_SCHEDULE_NOTE.
 */
export function ConstructionPhases({ tone = "white", className }: { tone?: Tone; className?: string }) {
  const phases = CONSTRUCTION_PHASES.map((phase, index) => ({
    phase,
    index,
    media: PHASE_PICTURE[phase.id] ? picture(PHASE_PICTURE[phase.id]) : null,
  }));
  // Photographed phases alternate sides; the count runs over them only.
  let framedCount = 0;
  const rows = phases.map((p) => ({ ...p, side: p.media ? framedCount++ % 2 : -1 }));

  return (
    <Section id="phases" tone={tone} labelledBy="phases-heading" className={cn(ANCHOR_OFFSET, className)}>
      <Container>
        <div className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <SectionHeading
            id="phases-heading"
            overline={COPY.phases.overline}
            title={COPY.phases.title}
            subtitle={COPY.phases.subtitle}
            align="left"
            className="mb-0 lg:col-span-7"
          />
          <p className="max-w-[48ch] border-l border-rule pl-5 text-sm text-muted lg:col-span-4 lg:col-start-9">
            {PHASE_SCHEDULE_NOTE}
          </p>
        </div>

        <Stepper
          label={COPY.phases.stepperLabel}
          className="mt-12 border-y border-rule py-6 sm:mt-16 [&_li]:min-w-[10.5rem] lg:[&_li]:min-w-0"
          items={phases.map(({ phase, index }) => ({
            meta: `${COPY.phases.phase} ${index + 1}`,
            label: phase.name,
            href: `#phase-${phase.id}`,
          }))}
        />

        <ol className="mt-4 grid lg:grid-cols-2 lg:gap-x-8">
          {rows.map(({ phase, index, media, side }) =>
            media ? (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className={cn(
                ANCHOR_OFFSET,
                "grid gap-y-8 border-b border-rule py-12 sm:py-16 lg:col-span-2 lg:grid-cols-12 lg:items-center lg:gap-x-8",
              )}
            >
              <div className={cn("lg:col-span-7 lg:row-start-1", side === 1 ? "lg:col-start-6" : "lg:col-start-1")}>
                <PhaseDetail phase={phase} index={index} />
              </div>
              <Reveal
                className={cn(
                  "lg:col-span-4 lg:row-start-1",
                  side === 1 ? "lg:col-start-1" : "lg:col-start-9",
                )}
              >
                <Frame
                  media={media}
                  aspect="4/5"
                  sizes="(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 32rem, 100vw"
                  className="max-w-[32rem]"
                />
              </Reveal>
            </li>
            ) : (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className={cn(ANCHOR_OFFSET, "border-b border-rule py-12 sm:py-16")}
            >
              <PhaseDetail phase={phase} index={index} />
            </li>
            ),
          )}
        </ol>
      </Container>
    </Section>
  );
}

/** SWFL-specific conditions: water table, flood zones, UEP, materials. */
export function SwflExpertise({ tone = "shell" }: { tone?: Tone }) {
  return (
    <Section tone={tone} labelledBy="swfl-heading">
      <Container>
        <SectionHeading
          id="swfl-heading"
          overline={COPY.swfl.overline}
          title={COPY.swfl.title}
          subtitle={COPY.swfl.subtitle}
          align="left"
        />
        <ul className="grid border-b border-rule md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
          {SWFL_EXPERTISE.map((item, i) => (
            <Reveal
              as="li"
              index={i}
              key={item.id}
              className="border-t border-rule py-8"
            >
              <div>
                <h3 className="text-xl leading-snug font-semibold text-fg">{item.title}</h3>
                <p className="mt-3 max-w-[60ch] text-body">{item.body}</p>
                {"href" in item && item.href && (
                  <Link href={item.href} className={cn(textLink, "group mt-3")}>
                    {item.title}{" "}
                    <ArrowRight
                      className="size-5 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Scheduling & coverage. Owner-approved wording; no capacity numbers. */
export function SchedulingPanel({ tone = "white", divider = false }: { tone?: Tone; divider?: boolean }) {
  return (
    <Section
      id="scheduling"
      tone={tone}
      divider={divider}
      spacing="sm"
      labelledBy="scheduling-heading"
      className={ANCHOR_OFFSET}
    >
      <Container>
        <SplitChapter
          heading={
            <SectionHeading
              id="scheduling-heading"
              overline={COPY.scheduling.overline}
              title={COPY.scheduling.title}
              subtitle={SCHEDULING_NOTE}
              align="left"
              className="mb-0"
            />
          }
        >
          <dl className="border-b border-rule lg:mt-2">
            <div className="grid gap-y-1 border-t border-rule py-6 sm:grid-cols-[12rem_1fr] sm:gap-x-8">
              <dt>
                <h3 className="label-tech pt-1 text-accent">{COPY.scheduling.whereWeWork}</h3>
              </dt>
              <dd className="text-lg text-fg">{SERVICE_COVERAGE}.</dd>
            </div>
            <div className="grid gap-y-1 border-t border-rule py-6 sm:grid-cols-[12rem_1fr] sm:gap-x-8">
              <dt>
                <h3 className="label-tech pt-1 text-accent">{COPY.scheduling.talkToEstimating}</h3>
              </dt>
              <dd className="text-lg text-body">
                <a href={BUILDER_DESK.phoneHref} className={cn(textLink, "tabular-nums")}>
                  {BUILDER_DESK.phone}
                </a>{" "}
                ·{" "}
                <a href={`mailto:${BUILDER_DESK.email}`} className={cn(textLink, "break-all")}>
                  {BUILDER_DESK.email}
                </a>
                {COPY.scheduling.orSend}
                <a href="#bid" className={textLink}>
                  {COPY.scheduling.sendPlans}
                </a>
                .
              </dd>
            </div>
          </dl>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** Owner-confirmed qualifications. */
export function Qualifications({ tone = "navy" }: { tone?: Tone }) {
  return (
    <Section id="qualifications" tone={tone} labelledBy="qualifications-heading" className={ANCHOR_OFFSET}>
      <Container>
        <SplitChapter
          heading={
            <SectionHeading
              id="qualifications-heading"
              overline={COPY.qualifications.overline}
              title={COPY.qualifications.title}
              subtitle={COPY.qualifications.subtitle}
              align="left"
              className="mb-0"
            />
          }
        >
          <ul className="grid border-b border-rule sm:grid-cols-2 sm:gap-x-10">
            {QUALIFICATIONS.map((q) => (
              <li key={q.id} className="flex gap-3 border-t border-rule py-5 text-fg">
                <JointBullet />
                <span>
                  {q.label}
                  {"sourceUrl" in q && (
                    <span className="mt-1 block text-sm text-muted">
                      {COPY.qualifications.source}{" "}
                      <a
                        href={q.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link underline underline-offset-2 hover:text-fg"
                      >
                        {q.source} {COPY.qualifications.profile}
                      </a>{" "}
                      {COPY.qualifications.checkedPrefix} {q.checkedOn})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** One downloadable document as a hairline row: the whole row is the download link. */
function DocumentRow({ href, label }: { href: string; label: string }) {
  // Plain <a>: a PDF isn't a route, so next/link would try a client navigation first.
  return (
    <li className="border-t border-rule">
      <a
        href={href}
        download
        className="group flex min-h-16 items-center justify-between gap-4 py-5 underline-offset-4"
      >
        <span className="text-lg leading-snug font-semibold text-fg group-hover:underline">{label}</span>
        <Download
          className="size-6 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-y-0.5"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}

/** Prequal packet: the two downloads as document rows, licenses + DBPR link, everything else on request via the office. */
export function PrequalDocs({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section id="prequal" tone={tone} labelledBy="prequal-heading" className={ANCHOR_OFFSET}>
      <Container>
        <SplitChapter
          heading={
            <>
              <SectionHeading
                id="prequal-heading"
                overline={COPY.prequal.overline}
                title={COPY.prequal.title}
                subtitle={COPY.prequal.subtitle}
                align="left"
                className="mb-0"
              />
            </>
          }
        >
          <ul className="border-b border-rule">
            <DocumentRow href={CAPABILITY_STATEMENT_PDF} label={COPY.prequal.capabilityPdf} />
            <DocumentRow href={PREQUAL_PACKET_PDF} label={COPY.prequal.prequalPdf} />
          </ul>
          <a href={PREQUAL_REQUEST_HREF} className={cn(textLink, "mt-4")}>
            <Mail className="size-5" aria-hidden="true" /> {COPY.prequal.requestDocuments}
          </a>
        </SplitChapter>

        <ul className="mt-14 border-b border-rule sm:mt-20">
          {PREQUAL_DOCS.map((doc) => (
            <li
              key={doc.id}
              className="grid gap-y-3 border-t border-rule py-6 md:grid-cols-12 md:items-baseline md:gap-x-8"
            >
              <p className="font-semibold text-fg md:col-span-4">{doc.title}</p>
              <p className="max-w-[60ch] text-[0.9375rem] text-body md:col-span-5">{doc.detail}</p>
              <div className="flex items-center gap-4 md:col-span-3 md:justify-end">
                <span
                  className={cn(
                    "label-tech whitespace-nowrap",
                    doc.status === "available" ? "text-success-ink" : "text-muted",
                  )}
                >
                  {PREQUAL_STATUS_LABEL[doc.status]}
                </span>
                {doc.href ? (
                  <a href={doc.href} target="_blank" rel="noopener noreferrer" className={cn(textLink, "text-sm")}>
                    {doc.hrefLabel} <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <a href={PREQUAL_REQUEST_HREF} className={cn(textLink, "text-sm")}>
                    {COPY.prequal.request} <Mail className="size-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[68ch] text-sm text-muted">
          {COPY.prequal.requestsGoTo}{" "}
          <a href={PREQUAL_REQUEST_HREF} className="font-medium text-link underline-offset-[0.2em] hover:underline">
            {BUILDER_DESK.email}
          </a>
          {COPY.prequal.requestsNote}
        </p>
      </Container>
    </Section>
  );
}

/** The builder-facing PM/estimating desk, framed as a team function. */
export function BuilderDesk({ tone = "shell" }: { tone?: Tone }) {
  return (
    <Section tone={tone} labelledBy="desk-heading">
      <Container>
        <SplitChapter
          heading={
            <>
              <SectionHeading
                id="desk-heading"
                overline={COPY.desk.overline}
                title={COPY.desk.title}
                subtitle={COPY.desk.subtitle}
                align="left"
                className="mb-0"
              />
              <p className="mt-8 max-w-[44ch] text-sm text-muted">
                {COPY.desk.bidsAndScheduling} {BUILDER_DESK.contactName}, {BUILDER_DESK.contactRole} ·{" "}
                <a
                  href={`mailto:${BUILDER_DESK.email}`}
                  className="font-medium text-link underline underline-offset-2"
                >
                  {BUILDER_DESK.email}
                </a>{" "}
                ·{" "}
                <a href={BUILDER_DESK.phoneHref} className="font-medium text-link underline underline-offset-2">
                  {BUILDER_DESK.phone}
                </a>
              </p>
            </>
          }
        >
          <ol className="border-b border-rule">
            {BUILDER_DESK.functions.map((f, i) => (
              <Reveal
                as="li"
                index={i}
                key={f.title}
                className="border-t border-rule py-6"
              >
                <div>
                  <h3 className="text-xl leading-snug font-semibold text-fg">{f.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-body">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** The steps after a submission as a short vertical connection line. */
export function AfterSubmitSteps({ as: Heading = "h3" }: { as?: "h2" | "h3" }) {
  return (
    <div>
      <Heading className="label-tech mb-6 flex items-center gap-2.5 text-accent">
        <span className="joint" aria-hidden="true" />
        {AFTER_SUBMIT.title}
      </Heading>
      <Stepper
        orientation="vertical"
        label={AFTER_SUBMIT.title}
        items={AFTER_SUBMIT.steps.map((step) => ({ label: step.title, description: step.description }))}
      />
    </div>
  );
}

/**
 * The bid form (#bid) in a split: what happens after a submission beside the
 * shared BuilderBidForm. `note` goes under the form.
 */
export function BidSplit({
  source,
  heading,
  tone = "white",
  note,
}: {
  source: string;
  heading?: string;
  tone?: Tone;
  note?: ReactNode;
}) {
  return (
    <Section id="bid" tone={tone} className={ANCHOR_OFFSET}>
      <Container>
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <BuilderBidForm source={source} heading={heading} />
            {note}
          </div>
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-8">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <AfterSubmitSteps />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
