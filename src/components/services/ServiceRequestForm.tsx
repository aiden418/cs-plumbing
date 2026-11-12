"use client";

import Link from "next/link";
import { CLAIMS } from "@/lib/claims";
import { useId, useRef, useState } from "react";
import { BUSINESS } from "@/lib/constants";
import { serviceRequestSchema, SERVICE_REQUEST_OPTIONS } from "@/lib/service-request";
import { trackContactForm } from "@/lib/pixel";

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
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const inputClass = "mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-gray-700";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = serviceRequestSchema.safeParse({
      ...fields,
      source,
      sourcePath: window.location.pathname,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    busy.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");
      setSent(true);
      void trackContactForm({ email: parsed.data.email, eventId: result.eventId });
    } catch {
      setError(`Your request could not be sent. Please try again or call ${BUSINESS.phone}.`);
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900">Request sent!</h3>
        <p className="mt-2 text-sm text-gray-600">Our office will contact you using the details you provided. {CLAIMS.bookingConfirmation} Your appointment is confirmed only after we contact you.</p>
        <p className="mt-3 text-sm text-gray-600">For urgent service, call <a className="font-semibold text-primary underline" href={`tel:${BUSINESS.phoneRaw}`}>{BUSINESS.phone}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "rounded-2xl border border-gray-200 bg-[#F5F5F7] p-5 sm:p-8 space-y-4"} aria-label="Request plumbing service">
      <p className="text-xs text-gray-500">Fields marked * are required.</p>
      <fieldset disabled={sending} className={`grid gap-3 sm:gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div>
          <label className={labelClass} htmlFor={`${id}-name`}>Name *</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-phone`}>Phone number *</label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={30} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-email`}>Email *</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${id}-zip`}>Service ZIP code *</label>
          <input id={`${id}-zip`} name="zip" inputMode="numeric" autoComplete="postal-code" required pattern="[0-9]{5}" maxLength={5} className={inputClass} />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor={`${id}-service`}>Service needed *</label>
          <select id={`${id}-service`} name="service" defaultValue={defaultService} required className={inputClass}>
            <option value="" disabled>Select a service</option>
            {SERVICE_REQUEST_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className={labelClass} htmlFor={`${id}-message`}>Brief description (optional)</label>
          <textarea id={`${id}-message`} name="message" rows={2} maxLength={5000} className={inputClass} />
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={sending} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60">{sending ? "Sending…" : "Request Service"}</button>
      <p className="text-xs text-gray-500">We&apos;ll call or email you about this request. <Link className="underline" href="/privacy-policy">Privacy policy</Link></p>
    </form>
  );
}
