"use client";

import Link from "next/link";
import { CLAIMS } from "@/lib/claims";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { serviceRequestSchema, SERVICE_REQUEST_OPTIONS } from "@/lib/service-request";
import { trackContactForm } from "@/lib/pixel";
import { isTestVisit, newSubmissionKey, type AcceptedLead } from "@/lib/lead";
import FileUpload from "@/components/builder-portal/FileUpload";
import { Field, FormattedInput, FormPanel, FormStatus, Select, SubmitRow, Textarea } from "@/components/forms";
import { cn } from "@/lib/utils";
import { PHOTO_UPLOAD, photoTotalError } from "@/lib/photo-upload";
import { compressAll } from "@/lib/compress-image";

type Errors = Partial<Record<string, string>>;

/**
 * The first problem with each named field: the shared schema's message when
 * it has one, otherwise the browser's own (the same text its bubble showed
 * when the browser validated this form). The form is valid only when both the
 * browser's checks and the schema pass, exactly as before.
 */
function fieldErrors(form: HTMLFormElement, schemaIssues: { path: PropertyKey[]; message: string }[]): Errors {
  const errors: Errors = {};
  for (const issue of schemaIssues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  for (const element of Array.from(form.elements)) {
    const el = element as HTMLInputElement;
    if (!el.name || !el.willValidate || el.validity.valid || errors[el.name]) continue;
    errors[el.name] = el.validationMessage;
  }
  return errors;
}

export default function ServiceRequestForm({
  defaultService = "",
  source = "form",
  compact = false,
}: {
  defaultService?: string;
  source?: string;
  compact?: boolean;
}) {
  const id = useId();
  const busy = useRef(false);
  // One key for this filled-in form, repeated on every retry, so the office
  // gets one request and one Lead ID however many times Send is pressed.
  const submissionKey = useRef<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [photoError, setPhotoError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    const test = isTestVisit();
    const parsed = serviceRequestSchema.safeParse({
      ...fields,
      source,
      sourcePath: window.location.pathname,
      submissionKey: (submissionKey.current ??= newSubmissionKey()),
      ...(test ? { test: true } : {}),
    });
    const found = fieldErrors(form, parsed.success ? [] : parsed.error.issues);
    if (!parsed.success || Object.keys(found).length > 0) {
      setErrors(found);
      setError(parsed.success ? Object.values(found)[0] ?? "" : parsed.error.issues[0].message);
      const first = Array.from(form.elements).find(
        (el) => (el as HTMLInputElement).name && found[(el as HTMLInputElement).name],
      ) as HTMLElement | undefined;
      first?.focus();
      return;
    }
    const sizeError = photoTotalError(photos);
    if (sizeError) {
      setErrors({});
      setPhotoError(sizeError);
      setError(sizeError);
      return;
    }
    busy.current = true;
    setSending(true);
    setError("");
    setErrors({});
    setPhotoError("");
    try {
      // Photos ride along as multipart; without them the payload stays JSON.
      let response: Response;
      if (photos.length > 0) {
        const body = new FormData();
        for (const [key, value] of Object.entries(parsed.data)) {
          if (value !== undefined && value !== null) body.append(key, String(value));
        }
        photos.forEach((file) => body.append(PHOTO_UPLOAD.field, file));
        response = await fetch("/api/contact", { method: "POST", body });
      } else {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
      }
      const result: Partial<AcceptedLead> & { error?: string; code?: string } = await response
        .json()
        .catch(() => ({}));
      if (!response.ok || !result.success) {
        throw Object.assign(new Error(result.error ?? "Submission failed"), { code: result.code });
      }
      setRequestId(result.leadId ?? "");
      setSent(true);
      focusStatus();
      // Counted only now, with the Lead ID of the request the office received.
      void trackContactForm({
        email: parsed.data.email,
        eventId: result.eventId,
        leadType: result.leadType,
        test: result.test,
      });
    } catch (err) {
      // Attachment problems are explained by the server in customer-facing words.
      const attachmentIssue = (err as { code?: string }).code === "attachments" && err instanceof Error;
      setError(
        attachmentIssue
          ? err.message
          : `Your request could not be sent. Please try again or call ${BUSINESS.phone}.`
      );
      focusStatus();
    } finally {
      busy.current = false;
      setSending(false);
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

  if (sent) {
    return (
      <FormStatus
        ref={statusRef}
        tabIndex={-1}
        status="success"
        data-tone="white"
        title="Request sent!"
      >
        <p>Our office will contact you using the details you provided. {CLAIMS.bookingConfirmation} Your appointment is confirmed only after we contact you.</p>
        {requestId && (
          <p className="mt-3">
            Request ID: <span className="font-semibold text-fg tabular-nums">{requestId}</span>
          </p>
        )}
        <p className="mt-3">For urgent service, call <a className="font-semibold text-link underline underline-offset-[0.2em]" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.</p>
      </FormStatus>
    );
  }

  const fid = (name: string) => `${id}-${name}`;
  const wide = compact ? undefined : "sm:col-span-2";

  const form = (
    <form
      onSubmit={submit}
      onChange={clearFieldError}
      noValidate
      className={compact ? "space-y-4" : "space-y-6"}
      aria-label="Request plumbing service"
    >
      <p className="text-sm text-muted">Fields marked * are required.</p>
      <fieldset disabled={sending} className={cn("grid min-w-0 gap-5", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 sm:gap-x-6")}>
        <Field id={fid("name")} label="Name *" required error={errors.name}>
          <FormattedInput name="name" preset="name" minLength={2} maxLength={100} />
        </Field>
        <Field id={fid("phone")} label="Phone number *" required error={errors.phone}>
          <FormattedInput name="phone" preset="tel" minLength={10} maxLength={30} />
        </Field>
        <Field id={fid("email")} label="Email *" required error={errors.email}>
          <FormattedInput name="email" preset="email" maxLength={200} />
        </Field>
        <Field id={fid("zip")} label="Service ZIP code *" required error={errors.zip}>
          <FormattedInput name="zip" preset="postal-code" pattern="[0-9]{5}" maxLength={5} />
        </Field>
        <Field id={fid("service")} label="Service needed *" required error={errors.service} className={wide}>
          <Select name="service" defaultValue={defaultService}>
            <option value="" disabled>Select a service</option>
            {SERVICE_REQUEST_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field id={fid("message")} label="Brief description (optional)" error={errors.message} className={wide}>
          <Textarea name="message" rows={2} maxLength={5000} />
        </Field>
        <div className={cn("min-w-0", wide)}>
          <FileUpload
            id={fid("photos")}
            label={`Photos of the problem (optional, up to ${PHOTO_UPLOAD.maxFiles})`}
            files={photos}
            onChange={(next) => {
              setPhotoError("");
              // Downscale phone photos as they are picked so the upload stays small.
              void compressAll(next).then(setPhotos);
            }}
            maxFiles={PHOTO_UPLOAD.maxFiles}
            maxSizeMb={PHOTO_UPLOAD.maxBytesEach / 1024 / 1024}
            error={photoError || undefined}
            compact
          />
        </div>
        {/* The kit's Honeypot markup, written out: tests/forms-kit.test.ts reads it from this file. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      </fieldset>
      {error ? (
        <FormStatus ref={statusRef} tabIndex={-1} status="error" data-tone="white" title={error} />
      ) : null}
      <SubmitRow
        label="Request Service"
        loading={sending}
        className="w-full sm:w-auto"
        rowClassName={compact ? "sm:flex-col sm:items-stretch" : undefined}
      />
      <p className="text-sm text-muted">We&apos;ll call or email you about this request. <Link className="text-link underline underline-offset-[0.2em]" href="/privacy-policy">Privacy policy</Link></p>
    </form>
  );

  return compact ? form : <FormPanel className="border border-steel-200">{form}</FormPanel>;
}
