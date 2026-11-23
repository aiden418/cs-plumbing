import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Section, { type Tone, type SectionSpacing } from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper from "@/components/ui/Stepper";
import { ArrowRight, Download, ExternalLink, Mail } from "@/components/ui/icons";
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
import type { MediaRef } from "@/lib/media-types";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Server-rendered sections shared by /builders and the
// /new-construction-plumbing/[city] pages (version 2, "Bright and clear").
// All copy comes from src/lib/builder-program.ts and src/content/builders.ts.
// Anything not yet confirmed is hidden, never shown as a placeholder.

/** Offset for in-page anchors under the fixed header. */
export const ANCHOR_OFFSET = "scroll-mt-[calc(var(--nav-h)+1rem)]";

/** A text link with an arrow (inline, 44 px tall). */
const textLink =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] hover:underline";

/** Inline link inside a sentence. */
const inlineLink = "font-semibold text-link underline-offset-[0.2em] hover:underline";

/** Heading on the left (5 of 12 columns from lg), content on the right. */
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
    <div className={cn("grid gap-y-8 lg:grid-cols-12 lg:gap-x-12", className)}>
      <div className="lg:col-span-5">{heading}</div>
      <div className="lg:col-span-7">{children}</div>
    </div>
  );
}

/**
 * Three-generation story under the proof headline. `children` (the proof
 * numbers on the hub) sit under the heading on the left.
 */
export function BuilderProofStory({
  tone = "white",
  spacing = "default",
  children,
}: {
  tone?: Tone;
  spacing?: SectionSpacing;
  children?: ReactNode;
}) {
  return (
    <Section tone={tone} spacing={spacing} labelledBy="builder-proof-heading">
      <Container>
        <SplitChapter
          heading={
            <>
              <SectionHeading
                id="builder-proof-heading"
                overline={COPY.proof.overline}
                title={BUILDER_PROOF.headline}
                subtitle={BUILDER_PROOF.subline}
                align="left"
                className="mb-0"
              />
              {children}
            </>
          }
        >
          <ol className="border-b border-rule">
            {BUILDER_PROOF.generations.map((g) => (
              <li key={g.name} className="border-t border-rule py-6 sm:py-7">
                <h3 className="text-xl leading-snug font-semibold text-fg">{g.name}</h3>
                <p className="mt-1 text-[0.9375rem] font-semibold text-accent">
                  {g.generation} {COPY.proof.generationSuffix}
                  <span className="font-medium text-body"> · {g.role}</span>
                </p>
                <p className="mt-2 max-w-[60ch] text-body">{g.body}</p>
              </li>
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

function PhaseList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h4 className="text-[0.9375rem] font-semibold text-fg">{title}</h4>
      <ul className="mt-2 border-b border-rule">
        {items.map((s) => (
          <li key={s} className="border-t border-rule py-2.5 leading-snug text-body">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseDetail({
  phase,
  index,
  media,
}: {
  phase: ConstructionPhase;
  index: number;
  media: MediaRef | null;
}) {
  const header = (
    <>
      <p className="text-[0.9375rem] font-semibold text-accent">
        {COPY.phases.phase} {index + 1}
      </p>
      <h3 className="mt-1 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{phase.name}</h3>
      <p className="mt-2 max-w-[56ch] text-body">{phase.summary}</p>
    </>
  );
  const inspection = <p className="mt-4 max-w-[60ch] font-semibold text-fg lg:mt-3">{phase.inspection}</p>;
  // Closed on phones, open from 64rem (builders.css).
  const lists = (
    <details className={cn("phone-details", media ? "mt-5 lg:mt-0" : "mt-5")}>
      <summary>{COPY.phases.detailsToggle}</summary>
      <div className="grid gap-x-8 gap-y-6 pt-5 sm:grid-cols-2 lg:pt-1">
        <PhaseList title={COPY.phases.weDo} items={phase.scope} />
        <PhaseList title={COPY.phases.weNeed} items={phase.needFromGC} />
      </div>
    </details>
  );

  if (!media) {
    return (
      <>
        {header}
        {lists}
        {inspection}
      </>
    );
  }
  // With a photograph: photo and title on the left (a third), the two lists
  // and the inspection line across the other two thirds from 64rem.
  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
      <div className="lg:col-span-4">
        <Frame
          media={media}
          aspect="16/9"
          sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 36rem, 100vw"
          className="mb-5 sm:max-w-[36rem] lg:max-w-none"
          frameClassName="lg:aspect-[2/1]"
        />
        {header}
      </div>
      <div className="lg:col-span-8">
        {lists}
        {inspection}
      </div>
    </div>
  );
}

/**
 * Phase-by-phase scope and what we need from the GC. The phases are real
 * steps, so they keep a horizontal Stepper linking to each phase below; each
 * phase shows its real photograph where the media map has one (text only
 * otherwise). On phones the two detail lists sit in a closed <details>.
 * No durations — see PHASE_SCHEDULE_NOTE.
 */
export function ConstructionPhases({
  tone = "white",
  spacing = "default",
  className,
}: {
  tone?: Tone;
  spacing?: SectionSpacing;
  className?: string;
}) {
  const phases = CONSTRUCTION_PHASES.map((phase, index) => ({
    phase,
    index,
    media: PHASE_PICTURE[phase.id] ? picture(PHASE_PICTURE[phase.id]) : null,
  }));

  return (
    <Section
      id="phases"
      tone={tone}
      spacing={spacing}
      labelledBy="phases-heading"
      className={cn(ANCHOR_OFFSET, className)}
    >
      <Container>
        <div className="grid gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <SectionHeading
            id="phases-heading"
            overline={COPY.phases.overline}
            title={COPY.phases.title}
            subtitle={COPY.phases.subtitle}
            align="left"
            className="mb-0 lg:col-span-7"
          />
          <p className="max-w-[48ch] text-body lg:col-span-5">{PHASE_SCHEDULE_NOTE}</p>
        </div>

        <Stepper
          label={COPY.phases.stepperLabel}
          className="mt-8 border-y border-rule py-5 sm:mt-10 [&_li]:min-w-[9.5rem] lg:[&_li]:min-w-0"
          items={phases.map(({ phase, index }) => ({
            meta: `${COPY.phases.phase} ${index + 1}`,
            label: phase.name,
            href: `#phase-${phase.id}`,
          }))}
        />

        <ol className="grid lg:grid-cols-2 lg:gap-x-12">
          {phases.map(({ phase, index, media }) => (
            <li
              key={phase.id}
              id={`phase-${phase.id}`}
              className={cn(
                ANCHOR_OFFSET,
                "border-b border-rule py-8",
                media ? "lg:col-span-2" : "last:border-b-0 lg:border-b-0 lg:pb-0",
              )}
            >
              <PhaseDetail phase={phase} index={index} media={media} />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** SWFL-specific conditions: water table, flood zones, UEP, materials. */
export function SwflExpertise({ tone = "shell", spacing = "default" }: { tone?: Tone; spacing?: SectionSpacing }) {
  return (
    <Section tone={tone} spacing={spacing} labelledBy="swfl-heading">
      <Container>
        <SectionHeading
          id="swfl-heading"
          overline={COPY.swfl.overline}
          title={COPY.swfl.title}
          subtitle={COPY.swfl.subtitle}
          align="left"
        />
        <ul className="grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
          {SWFL_EXPERTISE.map((item) => (
            <li key={item.id} className="border-t border-rule py-6">
              <h3 className="text-xl leading-snug font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 max-w-[60ch] text-body">{item.body}</p>
              {"href" in item && item.href && (
                <Link href={item.href} className={cn(textLink, "group mt-2")}>
                  {item.title}{" "}
                  <ArrowRight
                    className="size-5 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Scheduling & coverage. Owner-approved wording; no capacity numbers. */
export function SchedulingPanel({
  tone = "white",
  divider = false,
  spacing = "sm",
  className,
}: {
  tone?: Tone;
  divider?: boolean;
  spacing?: SectionSpacing;
  className?: string;
}) {
  return (
    <Section
      id="scheduling"
      tone={tone}
      divider={divider}
      spacing={spacing}
      labelledBy="scheduling-heading"
      className={cn(ANCHOR_OFFSET, className)}
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
            <div className="border-t border-rule py-5">
              <dt>
                <h3 className="text-lg font-semibold text-fg">{COPY.scheduling.whereWeWork}</h3>
              </dt>
              <dd className="mt-1 text-body">{SERVICE_COVERAGE}.</dd>
            </div>
            <div className="border-t border-rule py-5">
              <dt>
                <h3 className="text-lg font-semibold text-fg">{COPY.scheduling.talkToEstimating}</h3>
              </dt>
              <dd className="mt-1 leading-relaxed text-body">
                <a href={BUILDER_DESK.phoneHref} className={cn(inlineLink, "whitespace-nowrap tabular-nums")}>
                  {BUILDER_DESK.phone}
                </a>{" "}
                ·{" "}
                <a href={`mailto:${BUILDER_DESK.email}`} className={cn(inlineLink, "break-all")}>
                  {BUILDER_DESK.email}
                </a>
                {COPY.scheduling.orSend}
                <a href="#bid" className={inlineLink}>
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
export function Qualifications({ tone = "white", spacing = "default" }: { tone?: Tone; spacing?: SectionSpacing }) {
  return (
    <Section id="qualifications" tone={tone} spacing={spacing} labelledBy="qualifications-heading" className={ANCHOR_OFFSET}>
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
          <ul className="border-b border-rule">
            {QUALIFICATIONS.map((q) => (
              <li key={q.id} className="border-t border-rule py-3.5 text-lg leading-snug font-medium text-fg">
                {q.label}
              </li>
            ))}
          </ul>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** One downloadable document as a card row: the whole row is the download link. */
export function DocumentRow({ href, label }: { href: string; label: string }) {
  // Plain <a>: a PDF isn't a route, so next/link would try a client navigation first.
  return (
    <li>
      <a
        href={href}
        download
        className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-steel-200 bg-white px-5 py-4 underline-offset-4 hover:border-steel-300"
      >
        <span className="text-lg leading-snug font-semibold text-navy group-hover:underline">{label}</span>
        <Download className="size-6 shrink-0 text-primary" aria-hidden="true" />
      </a>
    </li>
  );
}

/** Prequal packet: the two downloads as document rows, licenses + DBPR link, everything else on request via the office. */
export function PrequalDocs({ tone = "white", spacing = "default" }: { tone?: Tone; spacing?: SectionSpacing }) {
  return (
    <Section id="prequal" tone={tone} spacing={spacing} labelledBy="prequal-heading" className={ANCHOR_OFFSET}>
      <Container>
        <SplitChapter
          heading={
            <SectionHeading
              id="prequal-heading"
              overline={COPY.prequal.overline}
              title={COPY.prequal.title}
              subtitle={COPY.prequal.subtitle}
              align="left"
              className="mb-0"
            />
          }
        >
          <ul className="grid gap-3">
            <DocumentRow href={CAPABILITY_STATEMENT_PDF} label={COPY.prequal.capabilityPdf} />
            <DocumentRow href={PREQUAL_PACKET_PDF} label={COPY.prequal.prequalPdf} />
          </ul>
          <a href={PREQUAL_REQUEST_HREF} className={cn(textLink, "mt-3")}>
            <Mail className="size-5" aria-hidden="true" /> {COPY.prequal.requestDocuments}
          </a>

          {/* The full document list: closed on phones, open from 64rem (builders.css). */}
          <details className="phone-details mt-6">
            <summary>{COPY.prequal.showAll(PREQUAL_DOCS.length)}</summary>
            <ul className="border-b border-rule lg:border-t-0">
              {PREQUAL_DOCS.map((doc) => (
                <li key={doc.id} className="border-t border-rule py-4 first:border-t-0 lg:first:border-t">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-semibold text-fg">{doc.title}</p>
                    <span
                      className={cn(
                        "text-[0.9375rem] font-semibold whitespace-nowrap",
                        doc.status === "available" ? "text-success-ink" : "text-body",
                      )}
                    >
                      {PREQUAL_STATUS_LABEL[doc.status]}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[60ch] text-body">{doc.detail}</p>
                  {doc.href ? (
                    <a href={doc.href} target="_blank" rel="noopener noreferrer" className={textLink}>
                      {doc.hrefLabel} <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <a href={PREQUAL_REQUEST_HREF} className={textLink}>
                      {COPY.prequal.request} <Mail className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </details>
          <p className="mt-5 max-w-[68ch] text-[0.9375rem] text-body">
            {COPY.prequal.requestsGoTo}{" "}
            <a href={PREQUAL_REQUEST_HREF} className={cn(inlineLink, "break-all")}>
              {BUILDER_DESK.email}
            </a>
            {COPY.prequal.requestsNote}
          </p>
        </SplitChapter>
      </Container>
    </Section>
  );
}

/** The builder-facing PM/estimating desk, framed as a team function. */
export function BuilderDesk({ tone = "shell", spacing = "default" }: { tone?: Tone; spacing?: SectionSpacing }) {
  return (
    <Section tone={tone} spacing={spacing} labelledBy="desk-heading">
      <Container>
        <SectionHeading
          id="desk-heading"
          overline={COPY.desk.overline}
          title={COPY.desk.title}
          subtitle={COPY.desk.subtitle}
          align="left"
        />
        <ul className="grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {BUILDER_DESK.functions.map((f) => (
            <li key={f.title} className="border-t border-rule py-5">
              <h3 className="text-lg leading-snug font-semibold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-body">{f.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 max-w-[68ch] border-t border-rule pt-5 text-body">
          {COPY.desk.bidsAndScheduling} {BUILDER_DESK.contactName}, {BUILDER_DESK.contactRole} ·{" "}
          <a href={`mailto:${BUILDER_DESK.email}`} className={cn(inlineLink, "break-all")}>
            {BUILDER_DESK.email}
          </a>{" "}
          ·{" "}
          <a href={BUILDER_DESK.phoneHref} className={cn(inlineLink, "whitespace-nowrap")}>
            {BUILDER_DESK.phone}
          </a>
        </p>
      </Container>
    </Section>
  );
}

/** The steps after a submission: real steps, so a short vertical stepper. */
export function AfterSubmitSteps({ as: Heading = "h3" }: { as?: "h2" | "h3" }) {
  return (
    <div>
      <Heading className="mb-5 text-xl leading-snug font-semibold text-fg">{AFTER_SUBMIT.title}</Heading>
      <Stepper
        orientation="vertical"
        label={AFTER_SUBMIT.title}
        className="[&_li]:pb-6 [&_li:last-child]:pb-0"
        items={AFTER_SUBMIT.steps.map((step) => ({ label: step.title, description: step.description }))}
      />
    </div>
  );
}

/**
 * The bid form (#bid) in a split: what happens after a submission beside the
 * shared BuilderBidForm (below it on phones). `note` goes under the form.
 */
export function BidSplit({
  source,
  heading,
  tone = "white",
  spacing = "default",
  note,
}: {
  source: string;
  heading?: string;
  tone?: Tone;
  spacing?: SectionSpacing;
  note?: ReactNode;
}) {
  return (
    <Section id="bid" tone={tone} spacing={spacing} className={ANCHOR_OFFSET}>
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-12">
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
