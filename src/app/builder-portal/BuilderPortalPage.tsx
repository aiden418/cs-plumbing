"use client";

import { useRef, useState, type ReactNode } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import Stepper from "@/components/ui/Stepper";
import WizardProgress from "@/components/ui/WizardProgress";
import { ChevronLeft, ChevronRight, FileText, Phone } from "@/components/ui/icons";
import {
  Field,
  FormPanel,
  FormStatus,
  Honeypot,
  Input,
  OptionCard,
  OptionGroup,
  Select,
  Textarea,
} from "@/components/forms";
import FileUpload from "@/components/builder-portal/FileUpload";
import BuilderPortalIntro from "@/components/builder-portal/BuilderPortalIntro";
import { AFTER_SUBMIT, BUILDER_PORTAL } from "@/content/builders";
import { BUSINESS } from "@/lib/business";
import { trackBuilderLead } from "@/lib/pixel";
import { PLAN_SET_MAX_BYTES } from "@/lib/plan-upload";

const COPY = BUILDER_PORTAL.wizard;
const steps = COPY.steps.map((label) => ({ label }));

const projectTypes = [
  "Residential New Construction",
  "Commercial New Construction",
  "Commercial Tenant Buildout",
  "Remodel",
  "Other",
];

const budgetRanges = [
  "Under $25K",
  "$25K – $50K",
  "$50K – $100K",
  "$100K – $250K",
  "$250K+",
  "Not Sure",
];

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  community: string;
  projectType: string;
  units: string;
  sqft: string;
  startDate: string;
  budget: string;
  description: string;
  /** Honeypot: a person never sees it, so it stays empty. */
  website: string;
}

export default function BuilderPortalPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    community: "",
    projectType: "",
    units: "",
    sqft: "",
    startDate: "",
    budget: "",
    description: "",
    website: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Moving between steps puts focus on the new step's heading, so keyboard and
  // screen-reader users land at the top of what just appeared.
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => stepHeadingRef.current?.focus({ preventScroll: false }));
  };

  // Changing step (Back, Edit, the progress bar) clears a submit error, so it
  // is not still on screen while the builder fixes the cause. It is keyed to
  // the change, not to the step on screen: Back and Edit stay usable while a
  // submit is in flight, and a failure that comes back after the builder has
  // already left the review step must still be shown.
  // Adjusted during render rather than in an effect, as Navbar does.
  const [lastStep, setLastStep] = useState(step);
  if (step !== lastStep) {
    setLastStep(step);
    setSubmitError(null);
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.name !== "" && form.company !== "" && form.email !== "" && form.phone !== "";
      case 1:
        return form.address !== "" && form.projectType !== "" && form.description.length >= 10;
      case 2:
        return true; // files optional
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body = new FormData();
      // Text fields, including the `website` honeypot
      Object.entries(form).forEach(([key, val]) => body.append(key, val));
      // Files
      files.forEach((file) => body.append("files", file));

      const res = await fetch("/api/builder-portal", {
        method: "POST",
        body,
      });

      // Not every failure is JSON: the platform answers a request body that is
      // too large with a plain-text 413 before the route runs.
      const result: {
        success?: boolean;
        eventId?: string;
        error?: string;
        code?: string;
      } = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        throw Object.assign(new Error(result.error ?? "Submission failed"), { code: result.code });
      }
      trackBuilderLead(
        { units: form.units, community: form.community, source: "builder-portal" },
        { eventId: result.eventId, email: form.email }
      );
      setSubmitted(true);
      // The success screen replaces the page: start it at the top, focused.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
        successRef.current?.focus({ preventScroll: true });
      });
    } catch (err) {
      // Attachment problems are explained by the server in customer-facing words.
      const attachmentIssue = (err as { code?: string }).code === "attachments" && err instanceof Error;
      setSubmitError(
        attachmentIssue
          ? err.message
          : `Something went wrong. Please call us directly at ${BUSINESS.phone}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fid = (name: string) => `portal-${name}`;
  const R = COPY.review;

  // ── Success screen ──
  if (submitted) {
    const done = BUILDER_PORTAL.success;
    return (
      <div ref={successRef} tabIndex={-1} className="outline-none">
        <PageHero
          layout="compact"
          title={done.title}
          description={
            <>
              <p>{done.thanks(form.name, files.length)}</p>
              <p className="mt-3">{done.next}</p>
            </>
          }
          actions={
            <>
              <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
                Call {BUSINESS.phone}
              </Button>
              <Button href="/" variant="secondary" size="lg">
                {done.home}
              </Button>
            </>
          }
        />
      </div>
    );
  }

  const editButton = (target: number) => (
    <button
      type="button"
      onClick={() => goTo(target)}
      className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-link underline-offset-[0.2em] hover:underline"
    >
      {R.edit}
    </button>
  );

  const reviewRow = (term: string, value: ReactNode) => (
    <div className="grid grid-cols-[7rem_1fr] gap-x-4 border-t border-rule py-2.5 text-[0.9375rem] sm:grid-cols-[9rem_1fr]">
      <dt className="text-muted">{term}</dt>
      <dd className="min-w-0 font-medium break-words text-fg">{value}</dd>
    </div>
  );

  const reviewGroup = (title: string, target: number, children: ReactNode) => (
    <section className="border-t border-fg/80 pt-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="label-tech text-fg">{title}</h3>
        {editButton(target)}
      </div>
      {children}
    </section>
  );

  const headingClass = "text-display-sm font-semibold text-fg outline-none";

  return (
    <>
      <BuilderPortalIntro />

      <Section
        id="upload-plans"
        tone="white"
        labelledBy="upload-plans-heading"
        className="scroll-mt-[calc(var(--nav-h)+1rem)]"
      >
        <Container>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-y-12 lg:grid-cols-12 lg:gap-x-8">
            {/* Header and what happens next */}
            <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
              <Eyebrow className="mb-4">{COPY.overline}</Eyebrow>
              <h2 id="upload-plans-heading" className="text-display-md text-fg">
                {COPY.title}
              </h2>
              <p className="mt-5 max-w-[48ch] text-lead text-body">{COPY.intro}</p>
            </div>

            {/* What happens next: under the header beside the form on desktop, after the form on phones */}
            <div className="order-3 border-t border-rule pt-10 lg:order-none lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:border-t-0 lg:pt-0">
              <h2 className="label-tech mb-6 flex items-center gap-2.5 text-accent">
                <span className="joint" aria-hidden="true" />
                {AFTER_SUBMIT.title}
              </h2>
              <Stepper
                orientation="vertical"
                label={AFTER_SUBMIT.title}
                items={AFTER_SUBMIT.steps.map((s) => ({ label: s.title, description: s.description }))}
              />
            </div>

            {/* The wizard */}
            <div className="relative order-2 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-start">
              <FormPanel className="border border-steel-200 bg-white">
                <WizardProgress
                  steps={COPY.steps as unknown as string[]}
                  current={step}
                  label={COPY.progressLabel}
                  onStepClick={goTo}
                  className="mb-8 border-b border-steel-200 pb-6 sm:mb-10"
                />

                {/* Honeypot — hidden from real users. It sits outside the steps
                    so it is in the page on every one of them. */}
                <Honeypot value={form.website} onChange={(e) => update("website", e.target.value)} />

                <div key={step} className="portal-step">
                  {/* ── Step 0: Contact Info ── */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <h2 ref={stepHeadingRef} tabIndex={-1} className={headingClass}>
                        {COPY.contact.title}
                      </h2>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
                        <Field id={fid("name")} label={COPY.contact.name.label}>
                          <Input
                            preset="name"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder={COPY.contact.name.placeholder}
                          />
                        </Field>
                        <Field id={fid("company")} label={COPY.contact.company.label}>
                          <Input
                            autoComplete="organization"
                            value={form.company}
                            onChange={(e) => update("company", e.target.value)}
                            placeholder={COPY.contact.company.placeholder}
                          />
                        </Field>
                        <Field id={fid("email")} label={COPY.contact.email.label}>
                          <Input
                            preset="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder={COPY.contact.email.placeholder}
                          />
                        </Field>
                        <Field id={fid("phone")} label={COPY.contact.phone.label}>
                          <Input
                            preset="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder={COPY.contact.phone.placeholder}
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* ── Step 1: Project Details ── */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h2 ref={stepHeadingRef} tabIndex={-1} className={headingClass}>
                        {COPY.project.title}
                      </h2>
                      <Field id={fid("address")} label={COPY.project.address.label}>
                        <Input
                          autoComplete="street-address"
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder={COPY.project.address.placeholder}
                        />
                      </Field>
                      <Field id={fid("community")} label={COPY.project.community.label}>
                        <Input
                          value={form.community}
                          onChange={(e) => update("community", e.target.value)}
                          placeholder={COPY.project.community.placeholder}
                        />
                      </Field>
                      <OptionGroup id={fid("type")} legend={COPY.project.projectType} columns={2}>
                        {projectTypes.map((type, i) => (
                          <OptionCard
                            key={type}
                            id={fid(`type-${i}`)}
                            name="projectType"
                            value={type}
                            title={type}
                            checked={form.projectType === type}
                            onChange={() => update("projectType", type)}
                          />
                        ))}
                      </OptionGroup>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
                        <Field id={fid("units")} label={COPY.project.units.label}>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={form.units}
                            onChange={(e) => update("units", e.target.value)}
                            placeholder={COPY.project.units.placeholder}
                          />
                        </Field>
                        <Field id={fid("sqft")} label={COPY.project.sqft.label}>
                          <Input
                            inputMode="numeric"
                            value={form.sqft}
                            onChange={(e) => update("sqft", e.target.value)}
                            placeholder={COPY.project.sqft.placeholder}
                          />
                        </Field>
                        <Field id={fid("start")} label={COPY.project.startDate}>
                          <Input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => update("startDate", e.target.value)}
                          />
                        </Field>
                        <Field id={fid("budget")} label={COPY.project.budget.label}>
                          <Select value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                            <option value="">{COPY.project.budget.placeholder}</option>
                            {budgetRanges.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      </div>
                      <Field
                        id={fid("description")}
                        label={COPY.project.description.label}
                        hint={COPY.project.description.hint}
                      >
                        <Textarea
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          placeholder={COPY.project.description.placeholder}
                          rows={4}
                        />
                      </Field>
                    </div>
                  )}

                  {/* ── Step 2: File Upload ── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h2 ref={stepHeadingRef} tabIndex={-1} className={headingClass}>
                        {COPY.plans.title}
                      </h2>
                      <p className="max-w-[60ch] text-body">{COPY.plans.intro}</p>
                      <FileUpload
                        files={files}
                        onChange={setFiles}
                        maxTotalBytes={PLAN_SET_MAX_BYTES}
                        largePlanSetEmail={BUSINESS.email}
                      />
                    </div>
                  )}

                  {/* ── Step 3: Review ── */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <h2 ref={stepHeadingRef} tabIndex={-1} className={headingClass}>
                        {R.title}
                      </h2>

                      {reviewGroup(
                        R.contact,
                        0,
                        <dl className="mt-2">
                          {reviewRow(R.name, form.name)}
                          {reviewRow(R.company, form.company)}
                          {reviewRow(R.email, form.email)}
                          {reviewRow(R.phone, form.phone)}
                        </dl>,
                      )}

                      {reviewGroup(
                        R.project,
                        1,
                        <dl className="mt-2">
                          {reviewRow(R.address, form.address)}
                          {form.community && reviewRow(R.community, form.community)}
                          {reviewRow(R.type, form.projectType)}
                          {form.units && reviewRow(R.units, form.units)}
                          {form.sqft && reviewRow(R.sqft, form.sqft)}
                          {form.startDate && reviewRow(R.startDate, form.startDate)}
                          {form.budget && reviewRow(R.budget, form.budget)}
                          <div className="border-t border-rule py-2.5 text-[0.9375rem]">
                            <dt className="text-muted">{R.description}</dt>
                            <dd className="mt-1 break-words text-fg">{form.description}</dd>
                          </div>
                        </dl>,
                      )}

                      {reviewGroup(
                        R.files,
                        2,
                        files.length > 0 ? (
                          <ul className="mt-2">
                            {files.map((f, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 border-t border-rule py-2.5 text-[0.9375rem] text-fg"
                              >
                                <FileText className="size-4 shrink-0 text-muted" aria-hidden="true" />
                                <span className="min-w-0 truncate">{f.name}</span>
                                <span className="shrink-0 text-sm text-muted tabular-nums">({formatSize(f.size)})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 border-t border-rule py-2.5 text-[0.9375rem] text-muted">{R.noFiles}</p>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* Submit error — raised from the review step, cleared on a step change */}
                {submitError && <FormStatus status="error" title={submitError} className="mt-6" />}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-steel-200 pt-6 sm:mt-10">
                  <Button
                    variant="secondary"
                    onClick={() => goTo(Math.max(0, step - 1))}
                    disabled={step === 0}
                    icon={<ChevronLeft className="size-5" />}
                  >
                    {COPY.back}
                  </Button>

                  {step < steps.length - 1 ? (
                    <Button
                      onClick={() => goTo(step + 1)}
                      disabled={!canProceed()}
                      iconRight={<ChevronRight className="size-5" />}
                    >
                      {COPY.next}
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} loading={submitting}>
                      {submitting ? COPY.submitting : COPY.submit}
                    </Button>
                  )}
                </div>
              </FormPanel>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
