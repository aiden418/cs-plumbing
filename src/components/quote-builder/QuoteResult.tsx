"use client";

import { useRef, useState, type FormEvent } from "react";
import { CLAIMS } from "@/lib/claims";
import { Check, ShieldCheck, RotateCcw, Send, Phone, CalendarCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, FormStatus, FormattedInput } from "@/components/forms";
import { BUSINESS } from "@/lib/business";
import { trackQuoteBuilder } from "@/lib/pixel";
import { QUOTE } from "@/content/conversion";
import type {
  QuoteResult as QuoteResultType,
  WaterHeaterSelections,
  RepipeSelections,
  LeadCaptureData,
} from "@/lib/quote-types";

interface QuoteResultProps {
  result: QuoteResultType;
  selections: WaterHeaterSelections | RepipeSelections;
  onReset: () => void;
}

type LeadErrors = Partial<Record<keyof LeadCaptureData, string>>;

const T = QUOTE.result;

export default function QuoteResult({ result, selections, onReset }: QuoteResultProps) {
  const [showForm, setShowForm] = useState(false);
  const [lead, setLead] = useState<LeadCaptureData>({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [website, setWebsite] = useState(""); // honeypot
  const statusRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: result.service,
          selections,
          result,
          lead,
          sourcePath: window.location.pathname,
          website,
        }),
      });
      const data: { success?: boolean; eventId?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.success) throw new Error("Submission failed");
      void trackQuoteBuilder({ email: lead.email, eventId: data.eventId });
      setSubmitted(true);
    } catch {
      setSubmitError(T.error);
    } finally {
      setSubmitting(false);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  // The same rules as before; now each one is explained beside its field.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const found: LeadErrors = {};
    if (lead.name.length < 2) found.name = T.errors.name;
    if (!lead.email.includes("@")) found.email = T.errors.email;
    if (lead.phone.length < 7) found.phone = T.errors.phone;
    setErrors(found);
    const first = (Object.keys(found) as (keyof LeadCaptureData)[])[0];
    if (first) {
      document.getElementById(`quote-lead-${first}`)?.focus();
      return;
    }
    void handleSubmit();
  };

  const setField = (key: keyof LeadCaptureData, value: string) => {
    setLead((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const money = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div
      data-tone="white"
      className="cv-step-panel grid grid-cols-1 gap-y-10 rounded-frame border border-rule bg-white p-5 text-body sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:p-10"
    >
      {/* The estimate */}
      <div className="min-w-0 lg:col-span-7">
        <h2 className="text-display-sm text-fg">{T.heading}</h2>
        <p className="mt-4 text-muted">{T.lead}</p>
        <p className="mt-1 font-display text-display-md font-bold text-fg tabular-nums">
          {money(result.total.min)} – {money(result.total.max)}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success-ink">
          <ShieldCheck aria-hidden="true" className="size-5" />
          {T.verification}
        </p>

        <h3 className="label-tech mt-10 text-accent">{T.breakdown}</h3>
        <dl className="mt-3 border-b border-rule">
          {result.lineItems.map((item, i) => (
            <div key={i} className="flex items-baseline justify-between gap-6 border-t border-rule py-3 text-[0.9375rem]">
              <dt className="text-body">{item.label}</dt>
              <dd className="shrink-0 font-semibold text-fg tabular-nums">
                {item.range.min === item.range.max
                  ? `${money(Math.abs(item.range.min))}${item.range.min < 0 ? T.credit : ""}`
                  : `${money(item.range.min)} – ${money(item.range.max)}`}
              </dd>
            </div>
          ))}
        </dl>

        {/* Notes */}
        {result.notes.length > 0 && (
          <div className="mt-5 space-y-1">
            {result.notes.map((note, i) => (
              <p key={i} className="text-sm text-muted">
                {note}
              </p>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-6 border-l-2 border-primary pl-4 text-[0.9375rem] leading-relaxed text-body">
          {CLAIMS.estimateDisclaimer}
        </p>
      </div>

      {/* What's included + next step */}
      <div className="min-w-0 lg:col-span-5">
        <h3 className="label-tech text-accent">{T.included}</h3>
        <ul className="mt-3 border-b border-rule">
          {QUOTE.included[result.service].map((item, i) => (
            <li key={i} className="flex items-start gap-3 border-t border-rule py-3 text-[0.9375rem] leading-snug text-body">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-ink" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {submitted ? (
            <FormStatus
              ref={statusRef}
              tabIndex={-1}
              status="success"
              title={T.sentTitle}
              actions={
                <Button href={BUSINESS.phoneHref} variant="secondary" icon={<Phone className="size-5" />} size="sm">
                  Call {BUSINESS.phone}
                </Button>
              }
            >
              {T.sentBody}
            </FormStatus>
          ) : !showForm ? (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setShowForm(true);
                  requestAnimationFrame(() => firstFieldRef.current?.focus());
                }}
                icon={<Send aria-hidden="true" className="size-5" />}
                fullWidth
              >
                {T.emailQuote}
              </Button>
              <Button href="/booking" variant="secondary" icon={<CalendarCheck className="size-5" />} fullWidth>
                {T.schedule}
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="space-y-4">
              <p className="font-semibold text-fg">{T.formIntro}</p>
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />
              <Field id="quote-lead-name" label={T.nameLabel} required error={errors.name}>
                <FormattedInput
                  ref={firstFieldRef}
                  preset="name"
                  value={lead.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </Field>
              <Field id="quote-lead-email" label={T.emailLabel} required error={errors.email}>
                <FormattedInput
                  preset="email"
                  value={lead.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </Field>
              <Field id="quote-lead-phone" label={T.phoneLabel} required error={errors.phone}>
                <FormattedInput
                  preset="tel"
                  enterKeyHint="send"
                  value={lead.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </Field>
              {submitError && <FormStatus ref={statusRef} tabIndex={-1} status="error" title={submitError} />}
              <Button type="submit" loading={submitting} icon={<Send aria-hidden="true" className="size-5" />} fullWidth>
                {submitting ? T.sending : T.send}
              </Button>
            </form>
          )}
        </div>

        {/* Start over */}
        <div className="mt-8 border-t border-rule pt-4">
          <Button variant="ghost" onClick={onReset} icon={<RotateCcw aria-hidden="true" className="size-4" />} iconRight={<></>}>
            {T.startOver}
          </Button>
        </div>
      </div>
    </div>
  );
}
