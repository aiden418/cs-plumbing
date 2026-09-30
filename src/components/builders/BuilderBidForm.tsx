"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Send } from "lucide-react";
import FileUpload from "@/components/builder-portal/FileUpload";
import { trackBuilderLead } from "@/lib/pixel";
import { BUSINESS } from "@/lib/constants";

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const body = new FormData(e.currentTarget);
    body.set("source", source);
    files.forEach((f) => body.append("files", f));
    try {
      const res = await fetch("/api/builder-portal", { method: "POST", body });
      const data: { eventId?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed");
      trackBuilderLead(
        {
          units: String(body.get("units") ?? ""),
          community: String(body.get("community") ?? ""),
          source,
        },
        { eventId: data.eventId, email: String(body.get("email") ?? "") }
      );
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed"
          ? err.message
          : `Something went wrong. Please call ${BUSINESS.phone} or email your plans to ${BUSINESS.email}.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center" role="status">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Plans received</h3>
        <p className="mt-2 text-sm text-gray-500">
          A confirmation email is on its way. Our estimating team will review the plans and
          follow up with a written scope and price.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  const label = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby={`bid-form-${source}`}
    >
      <h3 id={`bid-form-${source}`} className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
        {heading}
      </h3>

      {/* Honeypot, hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${source}-company`}>Builder / company *</label>
          <input id={`${source}-company`} name="company" required minLength={2} className={input} />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-name`}>Your name *</label>
          <input id={`${source}-name`} name="name" required minLength={2} autoComplete="name" className={input} />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-email`}>Email *</label>
          <input id={`${source}-email`} name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-phone`}>Phone *</label>
          <input id={`${source}-phone`} name="phone" type="tel" required minLength={7} autoComplete="tel" className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${source}-community`}>Community / subdivision *</label>
          <input
            id={`${source}-community`}
            name="community"
            required
            minLength={2}
            defaultValue={defaultCommunity}
            placeholder="Community name, or city for scattered lots"
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-units`}>Number of units</label>
          <input id={`${source}-units`} name="units" type="number" inputMode="numeric" min={1} className={input} />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-start`}>Target start date</label>
          <input id={`${source}-start`} name="startDate" type="date" className={input} />
        </div>
      </div>

      <div className="mt-5">
        <span className={label}>Plans (PDF, JPG or PNG)</span>
        <FileUpload files={files} onChange={setFiles} />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Sending…" : "Send plans for a bid"}
      </button>
      <p className="mt-3 text-xs text-gray-500">
        Need to add scope notes, budget or square footage?{" "}
        <Link href="/builder-portal#upload-plans" className="text-primary underline underline-offset-2">
          Use the full Builder Portal
        </Link>
        .
      </p>
    </form>
  );
}
