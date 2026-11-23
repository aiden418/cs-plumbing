"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { CLAIMS } from "@/lib/claims";
import { serviceRequestSchema } from "@/lib/service-request";
import { trackUtilityEstimate } from "@/lib/pixel";
import { isTestVisit, newSubmissionKey, type AcceptedLead } from "@/lib/lead";
import { Checkbox, Field, FormattedInput, FormPanel, FormStatus, Input, Select, SubmitRow, Textarea } from "@/components/forms";

type Errors = Partial<Record<string, string>>;

const UTILITIES = [
  ["water", "Water service"],
  ["sewer", "Sewer lateral"],
  ["irrigation", "Irrigation"],
  ["septic", "Septic abandonment"],
] as const;

const CONNECTION_STATUS = [
  "Not connected to city utilities yet",
  "Water is connected, sewer is not",
  "Sewer is connected, water is not",
  "Not sure",
] as const;

/**
 * Request for a city utility (UEP) connection estimate: the property address
 * and the date printed on the city's Notice of Availability, so the office
 * can check the parcel and the deadline before anyone drives out. Posts to
 * /api/contact with service "uep"; the server files it as a utility estimate,
 * separate from homeowner service requests and builder bids.
 */
export default function UepEstimateForm({ heading }: { heading?: string }) {
  const id = useId();
  const busy = useRef(false);
  // One key for this filled-in form, repeated on every retry: one request, one Lead ID.
  const submissionKey = useRef<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const utilities = UTILITIES.filter(([value]) => data.get(`utility-${value}`) === "on").map(([, label]) => label);
    const test = isTestVisit();
    const parsed = serviceRequestSchema.safeParse({
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      zip: text("zip"),
      service: "uep",
      message: text("message"),
      address: text("address"),
      noticeDate: text("noticeDate"),
      utilities: utilities.join(", "),
      connectionStatus: text("connectionStatus"),
      website: text("website"),
      source: "uep-estimate",
      sourcePath: window.location.pathname,
      submissionKey: (submissionKey.current ??= newSubmissionKey()),
      ...(test ? { test: true } : {}),
    });
    const found: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !found[key]) found[key] = issue.message;
      }
    }
    if (text("address").length < 5) found.address = "Enter the property address.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setError(Object.values(found)[0] ?? "");
      const first = Array.from(form.elements).find(
        (el) => (el as HTMLInputElement).name && found[(el as HTMLInputElement).name],
      ) as HTMLElement | undefined;
      first?.focus();
      return;
    }
    if (!parsed.success) return;
    busy.current = true;
    setSending(true);
    setError("");
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result: Partial<AcceptedLead> & { error?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error ?? "Submission failed");
      setRequestId(result.leadId ?? "");
      setSent(true);
      focusStatus();
      // Counted only now, with the Lead ID of the request the office received.
      void trackUtilityEstimate({ email: parsed.data.email, eventId: result.eventId, test: result.test });
    } catch {
      setError(`Your request could not be sent. Please try again or call ${BUSINESS.phone}.`);
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
      <FormStatus ref={statusRef} tabIndex={-1} status="success" data-tone="white" title="Estimate request sent">
        <p>
          Our office will check the property and the notice date, then contact you about an on-site estimate.{" "}
          {CLAIMS.bookingConfirmation} Nothing is scheduled until we have spoken with you.
        </p>
        {requestId && (
          <p className="mt-3">
            Request ID: <span className="font-semibold text-fg tabular-nums">{requestId}</span>
          </p>
        )}
        <p className="mt-3">
          Questions in the meantime? Call{" "}
          <a className="font-semibold text-link underline underline-offset-[0.2em]" href={BUSINESS.phoneHref}>
            {BUSINESS.phone}
          </a>
          .
        </p>
      </FormStatus>
    );
  }

  const fid = (name: string) => `${id}-${name}`;

  return (
    <FormPanel className="border border-steel-200">
      <form onSubmit={submit} onChange={clearFieldError} noValidate className="space-y-6" aria-label="Request a connection estimate">
        {heading && <h3 className="text-display-sm text-fg">{heading}</h3>}
        <p className="text-sm text-muted">Fields marked * are required.</p>
        <fieldset disabled={sending} className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6">
          <Field id={fid("address")} label="Property address *" required error={errors.address} className="sm:col-span-2">
            <FormattedInput name="address" preset="street-address" maxLength={300} />
          </Field>
          <Field id={fid("zip")} label="ZIP code *" required error={errors.zip}>
            <FormattedInput name="zip" preset="postal-code" pattern="[0-9]{5}" maxLength={5} />
          </Field>
          <Field
            id={fid("noticeDate")}
            label="Date on your Notice of Availability"
            hint="The date printed on the city's letter. Leave blank if you have not received one."
            error={errors.noticeDate}
          >
            <Input name="noticeDate" type="date" min="2020-01-01" max="2035-12-31" />
          </Field>
          <fieldset className="m-0 min-w-0 border-0 p-0 sm:col-span-2">
            <legend className="text-base font-semibold text-fg">What needs connecting?</legend>
            <div className="mt-1 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {UTILITIES.map(([value, label]) => (
                <Checkbox key={value} id={fid(`utility-${value}`)} name={`utility-${value}`} label={label} />
              ))}
            </div>
          </fieldset>
          <Field id={fid("connectionStatus")} label="Is anything connected already?" error={errors.connectionStatus} className="sm:col-span-2">
            <Select name="connectionStatus" defaultValue={CONNECTION_STATUS[0]}>
              {CONNECTION_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>
          <Field id={fid("name")} label="Name *" required error={errors.name}>
            <FormattedInput name="name" preset="name" minLength={2} maxLength={100} />
          </Field>
          <Field id={fid("phone")} label="Phone number *" required error={errors.phone}>
            <FormattedInput name="phone" preset="tel" minLength={10} maxLength={30} />
          </Field>
          <Field id={fid("email")} label="Email *" required error={errors.email} className="sm:col-span-2">
            <FormattedInput name="email" preset="email" maxLength={200} />
          </Field>
          <Field id={fid("message")} label="Anything we should know (optional)" error={errors.message} className="sm:col-span-2">
            <Textarea name="message" rows={2} maxLength={5000} />
          </Field>
          {/* Honeypot: hidden from people, filled by bots. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
        </fieldset>
        {error ? <FormStatus ref={statusRef} tabIndex={-1} status="error" data-tone="white" title={error} /> : null}
        <SubmitRow label="Request a connection estimate" loading={sending} className="w-full sm:w-auto" />
        <p className="text-sm text-muted">
          We&apos;ll call or email you about this request.{" "}
          <Link className="text-link underline underline-offset-[0.2em]" href="/privacy-policy">
            Privacy policy
          </Link>
        </p>
      </form>
    </FormPanel>
  );
}
