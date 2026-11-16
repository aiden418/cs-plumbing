"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import FileUpload from "@/components/builder-portal/FileUpload";
import { Field, FormattedInput, FormPanel, FormStatus, Honeypot, Input, SubmitRow } from "@/components/forms";
import { PLAN_SET_MAX_BYTES } from "@/lib/plan-upload";
import { trackBuilderLead } from "@/lib/pixel";
import { BUSINESS } from "@/lib/business";

type Errors = Partial<Record<string, string>>;

/** The field labels, without the "*", for the summary line above the submit button. */
const LABELS: Record<string, string> = {
  company: "Builder / company",
  name: "Your name",
  email: "Email",
  phone: "Phone",
  community: "Community / subdivision",
  units: "Number of units",
  startDate: "Target start date",
};

/**
 * The browser's own message for each named field that fails its checks
 * (required, minimum length, email, minimum units): the text its bubble
 * showed before this form drew its errors inline. Same rules, so the same
 * submissions go through.
 */
function nativeErrors(form: HTMLFormElement): Errors {
  const errors: Errors = {};
  for (const element of Array.from(form.elements)) {
    const el = element as HTMLInputElement;
    if (!el.name || !el.willValidate || el.validity.valid || errors[el.name]) continue;
    errors[el.name] = el.validationMessage;
  }
  return errors;
}

/**
 * Short "Submit plans for a bid" form for /builders and the new-construction
 * city pages. Posts to the same /api/builder-portal endpoint as the full
 * Builder Portal wizard and fires builder_lead — never the homeowner Lead.
 */
export default function BuilderBidForm({
  source,
  defaultCommunity = "",
  heading = "Submit plans for a bid",
}: {
  /** Where the form lives, e.g. "builders-hub" or "nc-city:cape-coral". */
  source: string;
  defaultCommunity?: string;
  heading?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const statusRef = useRef<HTMLDivElement>(null);

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = nativeErrors(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Array.from(form.elements).find(
        (el) => (el as HTMLInputElement).name && found[(el as HTMLInputElement).name],
      ) as HTMLInputElement | undefined;
      setError(first ? `${LABELS[first.name] ?? first.name}: ${found[first.name]}` : null);
      first?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    setError(null);
    const body = new FormData(form);
    body.set("source", source);
    files.forEach((f) => body.append("files", f));
    try {
      const res = await fetch("/api/builder-portal", { method: "POST", body });
      // Not every failure is JSON: the platform answers a request body that is
      // too large with a plain-text 413 before the route runs.
      const data: { success?: boolean; eventId?: string; error?: string; code?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.success) {
        throw Object.assign(new Error(data.error ?? "Submission failed"), { code: data.code });
      }
      trackBuilderLead(
        {
          units: String(body.get("units") ?? ""),
          community: String(body.get("community") ?? ""),
          source,
        },
        { eventId: data.eventId, email: String(body.get("email") ?? "") }
      );
      setSubmitted(true);
      focusStatus();
    } catch (err) {
      // Attachment problems are explained by the server in customer-facing words.
      const attachmentIssue = (err as { code?: string }).code === "attachments" && err instanceof Error;
      setError(
        attachmentIssue
          ? err.message
          : `Something went wrong. Please call ${BUSINESS.phone} or email your plans to ${BUSINESS.email}.`
      );
      focusStatus();
    } finally {
      setSubmitting(false);
    }
  }

  /** Editing a field clears its message; the rest stay until the next submit. */
  function clearFieldError(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name;
    if (!name || !errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (submitted) {
    return (
      <FormStatus ref={statusRef} tabIndex={-1} status="success" data-tone="white" title="Plans received">
        A confirmation email is on its way. Our estimating team will review the plans and
        follow up with a written scope and price.
      </FormStatus>
    );
  }

  const fid = (name: string) => `${source}-${name}`;

  return (
    <FormPanel className="border border-steel-200">
      <form
        onSubmit={handleSubmit}
        onChange={clearFieldError}
        noValidate
        className="relative"
        aria-labelledby={`bid-form-${source}`}
      >
        <h3 id={`bid-form-${source}`} className="mb-6 text-display-sm font-semibold text-fg sm:mb-8">
          {heading}
        </h3>

        {/* Honeypot, hidden from real users */}
        <Honeypot />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
          <Field id={fid("company")} label="Builder / company *" required error={errors.company}>
            <FormattedInput name="company" minLength={2} autoComplete="organization" enterKeyHint="next" />
          </Field>
          <Field id={fid("name")} label="Your name *" required error={errors.name}>
            <FormattedInput name="name" preset="name" minLength={2} />
          </Field>
          <Field id={fid("email")} label="Email *" required error={errors.email}>
            <FormattedInput name="email" preset="email" />
          </Field>
          <Field id={fid("phone")} label="Phone *" required error={errors.phone}>
            <FormattedInput name="phone" preset="tel" minLength={7} />
          </Field>
          <Field id={fid("community")} label="Community / subdivision *" required error={errors.community} className="sm:col-span-2">
            <FormattedInput
              name="community"
              minLength={2}
              defaultValue={defaultCommunity}
              placeholder="Community name, or city for scattered lots"
              enterKeyHint="next"
            />
          </Field>
          <Field id={fid("units")} label="Number of units" error={errors.units}>
            <Input name="units" type="number" inputMode="numeric" min={1} enterKeyHint="next" />
          </Field>
          <Field id={fid("start")} label="Target start date" error={errors.startDate}>
            <Input name="startDate" type="date" />
          </Field>
        </div>

        <div className="mt-6">
          <FileUpload
            id={fid("files")}
            label="Plans (PDF, JPG or PNG)"
            files={files}
            onChange={setFiles}
            maxTotalBytes={PLAN_SET_MAX_BYTES}
            largePlanSetEmail={BUSINESS.email}
          />
        </div>

        {error && (
          <FormStatus ref={statusRef} tabIndex={-1} status="error" data-tone="white" title={error} className="mt-6" />
        )}

        <SubmitRow label="Send plans for a bid" loading={submitting} rowClassName="mt-8" />
        <p className="mt-4 text-sm text-muted">
          Need to add scope notes, budget or square footage?{" "}
          <Link href="/builder-portal#upload-plans" className="text-link underline underline-offset-[0.2em]">
            Use the full Builder Portal
          </Link>
          .
        </p>
      </form>
    </FormPanel>
  );
}
