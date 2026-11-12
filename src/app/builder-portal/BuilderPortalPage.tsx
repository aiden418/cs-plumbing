"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  FileText,
  ClipboardList,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/layout/PageTransition";
import FileUpload, { type FileUploadStatus } from "@/components/builder-portal/FileUpload";
import BuilderPortalIntro from "@/components/builder-portal/BuilderPortalIntro";
import WhatHappensNext from "@/components/ui/WhatHappensNext";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackBuilderLead } from "@/lib/pixel";
import {
  formatBytes,
  PLAN_SIZE_MB,
  PLAN_TOTAL_MB,
  PLAN_UPLOAD,
  planTotalError,
  type PlanFileRef,
} from "@/lib/plan-upload";
import { PlanUploadError, uploadPlanFiles } from "@/lib/upload-plans";

const steps = [
  { label: "Contact", icon: <User className="w-4 h-4" /> },
  { label: "Project", icon: <Building2 className="w-4 h-4" /> },
  { label: "Plans", icon: <Upload className="w-4 h-4" /> },
  { label: "Review", icon: <ClipboardList className="w-4 h-4" /> },
];

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
}

export default function BuilderPortalPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"idle" | "uploading" | "sending">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<Map<File, FileUploadStatus>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [uploadsUnavailable, setUploadsUnavailable] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  const submitting = phase !== "idle";
  const uploadedCount = files.filter((f) => statuses.get(f)?.done).length;
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
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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

  // Plan files upload straight to Vercel Blob first (src/lib/upload-plans.ts);
  // the submission itself is a small JSON body with the blob URLs.
  const handleSubmit = async (planFiles: File[] = files) => {
    if (submitting) return;
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
      if (planFiles.length > 0) {
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
        body: JSON.stringify({ ...form, files: refs }),
        signal: controller.signal,
      });
      const data: { eventId?: string; error?: string; code?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.error ?? "Failed"), { code: data.code });
      trackBuilderLead(
        { units: form.units, community: form.community, source: "builder-portal" },
        { eventId: data.eventId, email: form.email }
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
            : `Something went wrong. Please call us directly at ${BUSINESS.phone}, or email your plans to ${BUSINESS.email}.`
        );
      }
    } finally {
      if (!controller.signal.aborted) setPhase("idle");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  // ── Success screen ──
  if (submitted) {
    return (
      <PageTransition>
        <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 min-h-screen">
          <Container>
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Quote Request Submitted
              </h1>
              <p className="text-gray-500 text-lg mb-2">
                Thank you, {form.name}! We&apos;ve received your project details
                {files.length > 0 && ` and ${files.length} file${files.length !== 1 ? "s" : ""}`}.
              </p>
              <p className="text-gray-500 mb-8">
                Our team will review your plans and follow up with a detailed scope and quote.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/" variant="secondary">
                  Back to Home
                </Button>
                <Button href={`tel:${BUSINESS.phoneRaw}`} icon={<Phone className="w-4 h-4" />}>
                  Call {BUSINESS.phone}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <BuilderPortalIntro />

      <section
        id="upload-plans"
        className="pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 bg-white scroll-mt-24"
      >
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
                Submit your plans
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                Send us your project
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
                Four short steps — contact info, project details, plans, then
                review. We&apos;ll get back to you with a detailed scope and
                quote.
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-8 sm:mb-12">
              {steps.map((s, i) => (
                <div key={s.label} className="flex-1 flex items-center gap-1">
                  <button
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    // The label is `hidden sm:inline`, so on mobile the button
                    // is icon-only and has no accessible name without this.
                    aria-label={s.label}
                    aria-current={i === step ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors w-full justify-center",
                      i === step
                        ? "bg-primary text-white"
                        : i < step
                          ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                          : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── Step 0: Contact Info ── */}
                {step === 0 && (
                  <div className="space-y-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                      Your Contact Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="John Smith"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Company Name *</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => update("company", e.target.value)}
                          placeholder="Smith Builders LLC"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="john@smithbuilders.com"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="(239) 555-0123"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 1: Project Details ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                      Project Details
                    </h2>
                    <div>
                      <label className={labelClass}>Project Address *</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="123 Main St, Cape Coral, FL 33904"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Community / Subdivision</label>
                      <input
                        type="text"
                        value={form.community}
                        onChange={(e) => update("community", e.target.value)}
                        placeholder="e.g. Cape Coral Unit 42, or scattered lots"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Project Type *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => update("projectType", type)}
                            className={cn(
                              "px-4 py-3 border rounded-xl text-sm font-medium text-left transition-all",
                              form.projectType === type
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-gray-200 text-gray-700 hover:border-gray-300"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Number of Units</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={form.units}
                          onChange={(e) => update("units", e.target.value)}
                          placeholder="e.g. 12"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Approx. Square Footage</label>
                        <input
                          type="text"
                          value={form.sqft}
                          onChange={(e) => update("sqft", e.target.value)}
                          placeholder="e.g. 2,500"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Target Start Date</label>
                        <input
                          type="date"
                          value={form.startDate}
                          onChange={(e) => update("startDate", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Budget Range</label>
                        <select
                          value={form.budget}
                          onChange={(e) => update("budget", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Select...</option>
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Project Description *</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Describe the scope of work, number of fixtures, any special requirements..."
                        rows={4}
                        className={inputClass}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Minimum 10 characters
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Step 2: File Upload ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Upload Plans &amp; Documents
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Upload blueprints, site plans, floor plans, or photos of existing
                      conditions. This helps us provide a more accurate quote.
                    </p>
                    <FileUpload
                      files={files}
                      onChange={setFiles}
                      maxFiles={PLAN_UPLOAD.maxFiles}
                      maxSizeMb={PLAN_SIZE_MB}
                      maxTotalMb={PLAN_TOTAL_MB}
                      disabled={submitting}
                      fileStatus={(file) => statuses.get(file)}
                    />
                    <p className="text-xs text-gray-500">
                      Plan sets over {PLAN_SIZE_MB} MB per file? Email them to{" "}
                      <a href={`mailto:${BUSINESS.email}`} className="text-primary underline underline-offset-2">
                        {BUSINESS.email}
                      </a>
                      , or paste a shared-drive link in the project description.
                    </p>
                  </div>
                )}

                {/* ── Step 3: Review ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                      Review Your Submission
                    </h2>

                    {/* Contact */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Contact Info
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-500">Name</span>
                        <span className="text-gray-900 font-medium">{form.name}</span>
                        <span className="text-gray-500">Company</span>
                        <span className="text-gray-900 font-medium">{form.company}</span>
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-900 font-medium">{form.email}</span>
                        <span className="text-gray-500">Phone</span>
                        <span className="text-gray-900 font-medium">{form.phone}</span>
                      </div>
                    </div>

                    {/* Project */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Project Details
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-500">Address</span>
                        <span className="text-gray-900 font-medium">{form.address}</span>
                        {form.community && (
                          <>
                            <span className="text-gray-500">Community</span>
                            <span className="text-gray-900 font-medium">{form.community}</span>
                          </>
                        )}
                        <span className="text-gray-500">Type</span>
                        <span className="text-gray-900 font-medium">{form.projectType}</span>
                        {form.units && (
                          <>
                            <span className="text-gray-500">Units</span>
                            <span className="text-gray-900 font-medium">{form.units}</span>
                          </>
                        )}
                        {form.sqft && (
                          <>
                            <span className="text-gray-500">Sq Ft</span>
                            <span className="text-gray-900 font-medium">{form.sqft}</span>
                          </>
                        )}
                        {form.startDate && (
                          <>
                            <span className="text-gray-500">Start Date</span>
                            <span className="text-gray-900 font-medium">{form.startDate}</span>
                          </>
                        )}
                        {form.budget && (
                          <>
                            <span className="text-gray-500">Budget</span>
                            <span className="text-gray-900 font-medium">{form.budget}</span>
                          </>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">Description</span>
                        <p className="text-sm text-gray-900 mt-1">{form.description}</p>
                      </div>
                    </div>

                    {/* Files */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Uploaded Files
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      {files.length > 0 ? (
                        <ul className="space-y-1.5 text-sm">
                          {files.map((f, i) => {
                            const status = statuses.get(f);
                            return (
                              <li key={i} className="text-gray-700">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="truncate">{f.name}</span>
                                  <span className="text-gray-400 text-xs">
                                    ({formatBytes(f.size)})
                                  </span>
                                  {status?.done && (
                                    <span className="text-xs text-green-700">Uploaded</span>
                                  )}
                                </div>
                                {status?.error ? (
                                  <p className="mt-1 text-xs text-red-600">{status.error}</p>
                                ) : typeof status?.progress === "number" && !status.done ? (
                                  <div
                                    className="mt-1 h-1 w-full rounded bg-gray-200"
                                    role="progressbar"
                                    aria-label={`Uploading ${f.name}`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.round(status.progress)}
                                  >
                                    <div
                                      className="h-1 rounded bg-primary transition-[width] duration-200"
                                      style={{ width: `${Math.max(2, Math.min(100, status.progress))}%` }}
                                    />
                                  </div>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No files uploaded
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3" role="alert">
                <p className="text-sm text-red-700">{error}</p>
                {uploadsUnavailable && files.length > 0 && !submitting && (
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      void handleSubmit([]);
                    }}
                    className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                  >
                    Send request without plans
                  </button>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 sm:mt-10 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  step === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                    canProceed()
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {phase === "uploading"
                        ? `Uploading plans (${Math.min(uploadedCount + 1, files.length)} of ${files.length})…`
                        : "Submitting..."}
                    </>
                  ) : (
                    <>
                      Submit Quote Request
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      <WhatHappensNext
        title="What happens after you submit"
        steps={[
          {
            title: "Plans received",
            description:
              "You'll get a confirmation email immediately, and our office picks it up from there.",
          },
          {
            title: "Takeoff & questions",
            description:
              "We work through the plumbing scope and reach out with any clarifying questions on fixtures, materials, or scheduling.",
          },
          {
            title: "Written proposal",
            description:
              "Detailed written proposal — scope, materials, schedule, price, and warranty terms.",
          },
          {
            title: "Kickoff scheduled",
            description:
              "Once approved, we lock in rough-in dates and coordinate with your other trades to keep the build on track.",
          },
        ]}
      />
    </PageTransition>
  );
}
