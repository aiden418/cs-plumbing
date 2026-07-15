"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Calendar,
  User,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  Siren,
  Building2,
  HardHat,
  Home,
  Shovel,
  CalendarCheck,
  FileText,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import WhatHappensNext from "@/components/ui/WhatHappensNext";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackBooking } from "@/lib/pixel";

const serviceCategories = [
  { id: "residential", label: "Residential", icon: <Home className="w-6 h-6" /> },
  { id: "commercial", label: "Commercial", icon: <Building2 className="w-6 h-6" /> },
  { id: "emergency", label: "Emergency", icon: <Siren className="w-6 h-6" /> },
  { id: "new-construction", label: "New Construction / Remodel", icon: <HardHat className="w-6 h-6" /> },
  { id: "uep-utilities", label: "UEP Utilities", icon: <Shovel className="w-6 h-6" /> },
  { id: "coastal-comeback", label: "Coastal Comeback Plan", icon: <ShieldCheck className="w-6 h-6" /> },
];

const COASTAL_TIER_LABELS: Record<string, string> = {
  comfort: "Coastal Comfort ($349/yr)",
  shield: "Coastal Shield ($549/yr)",
  smart: "Coastal Smart (custom quote)",
  "coastal-comeback": "Coastal Comeback Plan",
};

const budgetRanges = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure",
];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const bookingSteps = [
  { label: "Service", icon: <Wrench className="w-4 h-4" /> },
  { label: "Details", icon: <FileText className="w-4 h-4" /> },
  { label: "Schedule", icon: <Calendar className="w-4 h-4" /> },
  { label: "Info", icon: <User className="w-4 h-4" /> },
];

const estimateSteps = [
  { label: "Service", icon: <Wrench className="w-4 h-4" /> },
  { label: "Details", icon: <FileText className="w-4 h-4" /> },
  { label: "Info", icon: <User className="w-4 h-4" /> },
];

interface FormData {
  requestType: "booking" | "estimate";
  service: string;
  description: string;
  urgency: string;
  budgetRange: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export default function BookingPage() {
  const [requestType, setRequestType] = useState<"booking" | "estimate">("booking");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    requestType: "booking",
    service: "",
    description: "",
    urgency: "normal",
    budgetRange: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  });

  // Pre-fill from URL params: ?plan=... (Coastal), ?service=..., ?urgency=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const serviceParam = params.get("service");
    const urgencyParam = params.get("urgency");
    const validServices = serviceCategories.map((c) => c.id);
    const validUrgencies = ["normal", "soon", "emergency"];

    setForm((prev) => {
      let next = prev;
      if (plan) {
        const tierLabel = COASTAL_TIER_LABELS[plan] ?? COASTAL_TIER_LABELS["coastal-comeback"];
        next = {
          ...next,
          service: "coastal-comeback",
          description: next.description || `Interested in the ${tierLabel}. Please reach out to enroll me.`,
        };
      }
      if (serviceParam && validServices.includes(serviceParam)) {
        next = { ...next, service: serviceParam };
      }
      if (urgencyParam && validUrgencies.includes(urgencyParam)) {
        next = { ...next, urgency: urgencyParam, requestType: "booking" };
      }
      return next;
    });
    if (urgencyParam === "emergency") setRequestType("booking");
  }, []);

  const isEstimate = requestType === "estimate";
  const steps = isEstimate ? estimateSteps : bookingSteps;
  const totalSteps = steps.length;

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const switchRequestType = (type: "booking" | "estimate") => {
    setRequestType(type);
    setStep(0);
    setSubmitted(false);
    setForm((prev) => ({ ...prev, requestType: type }));
  };

  const canProceed = () => {
    if (isEstimate) {
      switch (step) {
        case 0: return form.service !== "";
        case 1: return form.description.length >= 5;
        case 2:
          return (
            form.name.length >= 2 &&
            /^\S+@\S+\.\S+$/.test(form.email) &&
            form.phone.replace(/\D/g, "").length >= 10 &&
            form.address.length >= 5
          );
        default: return true;
      }
    } else {
      switch (step) {
        case 0: return form.service !== "";
        case 1: return form.description.length >= 5;
        case 2: return form.date !== "" && form.time !== "";
        case 3:
          return (
            form.name.length >= 2 &&
            /^\S+@\S+\.\S+$/.test(form.email) &&
            form.phone.replace(/\D/g, "").length >= 10 &&
            form.address.length >= 5
          );
        default: return true;
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { success?: boolean; confirmationId?: string; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Submission failed");
      }
      if (data.confirmationId) setConfirmationId(data.confirmationId);
      trackBooking();
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step === totalSteps - 1) {
      handleSubmit();
      setStep(totalSteps);
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  });

  // Determine which "real" step to render
  // For booking: step 0=service, 1=details, 2=schedule, 3=info, 4=confirm
  // For estimate: step 0=service, 1=details, 2=info, 3=confirm
  const isConfirmStep = step === totalSteps;
  const isInfoStep = step === totalSteps - 1;
  const isScheduleStep = !isEstimate && step === 2;
  const isDetailsStep = step === 1;
  const isServiceStep = step === 0;

  return (
    <PageTransition>
      <PageHero
        size="sm"
        align="center"
        overline={isEstimate ? "Request an Estimate" : "Book a Service"}
        title={isEstimate ? "Get a Free" : "Schedule Your"}
        accent={isEstimate ? "Estimate" : "Appointment"}
        description={
          isEstimate
            ? "Tell us about your project and we\u2019ll get back to you with a quote."
            : "Book online in under 2 minutes. We\u2019ll confirm your appointment within the hour."
        }
      />
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-16 bg-[#F5F5F7]">
        <Container size="narrow">
          {/* Request Type Toggle */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => switchRequestType("booking")}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  requestType === "booking"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <CalendarCheck className="w-4 h-4" />
                Book a Service
              </button>
              <button
                onClick={() => switchRequestType("estimate")}
                className={cn(
                  "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  requestType === "estimate"
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <DollarSign className="w-4 h-4" />
                Request an Estimate
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {!isConfirmStep && (
            <div className="flex items-center justify-between mb-8 sm:mb-12 max-w-xs sm:max-w-md mx-auto">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                      i <= step
                        ? "bg-primary text-white"
                        : "bg-white text-gray-500 border border-gray-200"
                    )}
                  >
                    {i < step ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-5 sm:w-8 md:w-12 h-0.5 mx-0.5 sm:mx-1 transition-colors duration-300",
                        i < step ? "bg-primary" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pb-16 sm:pb-24 lg:pb-32 -mt-4">
        <Container size="narrow">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 min-h-[350px] sm:min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Step: Select Service */}
              {isServiceStep && (
                <motion.div
                  key="service"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    What do you need help with?
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {serviceCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => update("service", cat.id)}
                        className={cn(
                          "p-3 sm:p-4 rounded-xl border text-center transition-all duration-300",
                          form.service === cat.id
                            ? cat.id === "emergency"
                              ? "border-emergency bg-emergency/10 text-emergency"
                              : "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                        )}
                      >
                        <div className="flex justify-center mb-1.5 sm:mb-2">
                          {cat.icon}
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step: Details */}
              {isDetailsStep && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Tell us more about {isEstimate ? "your project" : "the issue"}
                  </h2>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder={isEstimate ? "Describe your project or what you need a quote for..." : "Describe the plumbing issue or project..."}
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors resize-none"
                  />

                  {isEstimate ? (
                    /* Budget Range for Estimate */
                    <div className="mt-4 sm:mt-6">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">What&apos;s your budget range?</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {budgetRanges.map((range) => (
                          <button
                            key={range}
                            onClick={() => update("budgetRange", range)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300",
                              form.budgetRange === range
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "bg-[#F5F5F7] text-gray-500 border border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Urgency for Booking */
                    <div className="mt-4 sm:mt-6">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">How urgent is this?</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {["normal", "soon", "emergency"].map((u) => (
                          <button
                            key={u}
                            onClick={() => update("urgency", u)}
                            className={cn(
                              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize",
                              form.urgency === u
                                ? u === "emergency"
                                  ? "bg-emergency/20 text-emergency border border-emergency/30"
                                  : "bg-primary/20 text-primary border border-primary/30"
                                : "bg-[#F5F5F7] text-gray-500 border border-gray-200"
                            )}
                          >
                            {u === "soon" ? "Within a week" : u}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step: Schedule (Booking only) */}
              {isScheduleStep && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Pick a date & time
                  </h2>
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Preferred Date</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto">
                      {dates.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => update("date", d.value)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                            form.date === d.value
                              ? "bg-primary text-white"
                              : "bg-[#F5F5F7] text-gray-500 border border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Preferred Time</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => update("time", t)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                            form.time === t
                              ? "bg-primary text-white"
                              : "bg-[#F5F5F7] text-gray-500 border border-gray-200 hover:border-gray-300"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step: Contact Info */}
              {isInfoStep && !isConfirmStep && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Your Information
                  </h2>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="Phone"
                      type="tel"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Service Address (street, city)"
                    aria-required="true"
                    autoComplete="street-address"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[11px] text-gray-400">All fields required so we can dispatch the right tech to you.</p>
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                    name="website"
                  />
                </motion.div>
              )}

              {/* Confirmation */}
              {isConfirmStep && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle className="w-14 h-14 sm:w-20 sm:h-20 text-success mx-auto mb-4 sm:mb-6" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {isEstimate ? "Estimate Request Submitted!" : "Booking Submitted!"}
                  </h2>
                  {confirmationId && (
                    <p className="inline-block bg-primary/10 text-primary text-xs sm:text-sm font-mono px-3 py-1.5 rounded-full mb-3">
                      Confirmation #{confirmationId}
                    </p>
                  )}
                  <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
                    {isEstimate
                      ? "We\u2019ll review your project details and get back to you with a quote within 24 hours. For urgent needs, call us directly."
                      : "We\u2019ll call to confirm your appointment within the hour. A copy was sent to "}
                    {!isEstimate && <span className="font-semibold text-gray-900">{form.email}</span>}
                    {!isEstimate && "."}
                  </p>
                  <Button
                    href={`tel:${BUSINESS.phoneRaw}`}
                    variant="secondary"
                    icon={<Phone className="w-4 h-4" />}
                  >
                    Call {BUSINESS.phone}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {!isConfirmStep && (
              <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    step === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!canProceed() || submitting}
                  className={cn(
                    "flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    canProceed() && !submitting
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-[#F5F5F7] text-gray-400 cursor-not-allowed"
                  )}
                >
                  {submitting
                    ? "Submitting..."
                    : step === totalSteps - 1
                      ? isEstimate ? "Submit Estimate Request" : "Submit Booking"
                      : "Continue"
                  }{" "}
                  {!submitting && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      <WhatHappensNext
        title="What happens after you submit"
        steps={[
          {
            title: "Submit the form",
            description:
              "Pick a service, time window, and add a note if there's anything we should know in advance.",
          },
          {
            title: "We call to confirm",
            description:
              "Expect a call within 1 business day. We confirm the appointment window and answer any quick questions.",
          },
          {
            title: "Tech arrives on time",
            description:
              "Lee County truck shows up inside your window. We diagnose, quote, and only proceed with your sign-off.",
          },
          {
            title: "Clean, code-compliant work",
            description:
              "Licensed under CFC1432485 / CFC057076. Permits handled when required. We leave the worksite spotless.",
          },
        ]}
      />
    </PageTransition>
  );
}
