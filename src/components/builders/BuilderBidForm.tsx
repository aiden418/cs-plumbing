"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Send } from "lucide-react";
import FileUpload, { type FileUploadStatus } from "@/components/builder-portal/FileUpload";
import { trackBuilderLead } from "@/lib/pixel";
import { BUSINESS } from "@/lib/constants";
import {
  PLAN_SIZE_MB,
  PLAN_TOTAL_MB,
  PLAN_UPLOAD,
  planTotalError,
  type PlanFileRef,
} from "@/lib/plan-upload";
import { PlanUploadError, uploadPlanFiles } from "@/lib/upload-plans";

type Phase = "idle" | "uploading" | "sending";

/**
 * Short "Submit plans for a bid" form for /builders and the new-construction
 * city pages. Posts to the same /api/builder-portal endpoint as the full
 * Builder Portal wizard and fires builder_lead — never the homeowner Lead.
 *
 * Plan files upload straight to Vercel Blob first (src/lib/upload-plans.ts);
 * the submission itself is a small JSON body with the blob URLs.
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
  const formRef = useRef<HTMLFormElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<Map<File, FileUploadStatus>>(new Map());
  const [phase, setPhase] = useState<Phase>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadsUnavailable, setUploadsUnavailable] = useState(false);

  useEffect(() => () => abort.current?.abort(), []);

  const busy = phase !== "idle";
  const uploadedCount = files.filter((f) => statuses.get(f)?.done).length;

  function collectFields(form: HTMLFormElement | null): Record<string, string> {
    const fields: Record<string, string> = {};
    if (form) {
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") fields[key] = value;
      });
    }
    fields.source = source;
    return fields;
  }

  async function send(fields: Record<string, string>, planFiles: File[]) {
    if (busy) return;
    setError(null);
    const sizeError = planTotalError(planFiles, BUSINESS.email);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    const controller = new AbortController();
    abort.current = controller;
    try {
      let refs: PlanFileRef[] = [];
      // A filled honeypot is a bot: do not spend storage on its files.
      if (planFiles.length > 0 && !fields.website?.trim()) {
        setPhase("uploading");
        refs = await uploadPlanFiles(planFiles, {
          officeEmail: BUSINESS.email,
          signal: controller.signal,
          onStatus: (file, status) => setStatuses((prev) => new Map(prev).set(file, status)),
        });
      }
      setPhase("sending");
      const res = await fetch("/api/builder-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, files: refs }),
        signal: controller.signal,
      });
      const data: { eventId?: string; error?: string; code?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.error ?? "Failed"), { code: data.code });
      trackBuilderLead(
        { units: fields.units ?? "", community: fields.community ?? "", source },
        { eventId: data.eventId, email: fields.email ?? "" }
      );
      setSubmitted(true);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err instanceof PlanUploadError) {
        setError(err.message);
        if (err.code === "uploads-unavailable") setUploadsUnavailable(true);
      } else {
        // File problems are explained by the server in builder-facing words
        // (code set); anything else gets the generic message.
        const code = (err as { code?: string }).code;
        setError(
          code && err instanceof Error
            ? err.message
            : `Something went wrong. Please call ${BUSINESS.phone} or email your plans to ${BUSINESS.email}.`
        );
      }
    } finally {
      if (!controller.signal.aborted) setPhase("idle");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await send(collectFields(e.currentTarget), files);
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

  const buttonText =
    phase === "uploading"
      ? `Uploading plans (${Math.min(uploadedCount + 1, files.length)} of ${files.length})…`
      : phase === "sending"
        ? "Sending…"
        : "Send plans for a bid";

  return (
    <form
      ref={formRef}
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
        <FileUpload
          files={files}
          onChange={setFiles}
          maxFiles={PLAN_UPLOAD.maxFiles}
          maxSizeMb={PLAN_SIZE_MB}
          maxTotalMb={PLAN_TOTAL_MB}
          disabled={busy}
          fileStatus={(file) => statuses.get(file)}
        />
        <p className="mt-2 text-xs text-gray-500">
          Plan sets over {PLAN_SIZE_MB} MB per file? Email them to{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-primary underline underline-offset-2">
            {BUSINESS.email}
          </a>
          , or share a drive link through the full Builder Portal.
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
        >
          <Send className="h-4 w-4" />
          {buttonText}
        </button>
        {uploadsUnavailable && files.length > 0 && !busy && (
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              void send(collectFields(formRef.current), []);
            }}
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Send request without plans
          </button>
        )}
      </div>
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
