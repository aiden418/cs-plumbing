"use client";

import { useState } from "react";
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
  Waves,
  Flame,
  Building2,
  HardHat,
  Droplets,
  PaintBucket,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/layout/PageTransition";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const serviceCategories = [
  { id: "emergency", label: "Emergency Repair", icon: <Siren className="w-6 h-6" />, color: "text-emergency" },
  { id: "drain", label: "Drain Cleaning", icon: <Waves className="w-6 h-6" />, color: "text-primary" },
  { id: "water-heater", label: "Water Heater", icon: <Flame className="w-6 h-6" />, color: "text-primary" },
  { id: "repiping", label: "Repiping", icon: <Wrench className="w-6 h-6" />, color: "text-primary" },
  { id: "commercial", label: "Commercial", icon: <Building2 className="w-6 h-6" />, color: "text-primary" },
  { id: "new-construction", label: "New Construction", icon: <HardHat className="w-6 h-6" />, color: "text-primary" },
  { id: "water-quality", label: "Water Quality", icon: <Droplets className="w-6 h-6" />, color: "text-primary" },
  { id: "remodel", label: "Remodeling", icon: <PaintBucket className="w-6 h-6" />, color: "text-primary" },
];

const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const steps = [
  { label: "Service", icon: <Wrench className="w-4 h-4" /> },
  { label: "Details", icon: <Wrench className="w-4 h-4" /> },
  { label: "Schedule", icon: <Calendar className="w-4 h-4" /> },
  { label: "Info", icon: <User className="w-4 h-4" /> },
  { label: "Confirm", icon: <CheckCircle className="w-4 h-4" /> },
];

interface FormData {
  service: string;
  description: string;
  urgency: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    service: "",
    description: "",
    urgency: "normal",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    switch (step) {
      case 0: return form.service !== "";
      case 1: return form.description.length >= 5;
      case 2: return form.date !== "" && form.time !== "";
      case 3: return form.name !== "" && form.email !== "" && form.phone !== "";
      default: return true;
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please call us directly.");
    }
  };

  const next = () => {
    if (step === 3) {
      handleSubmit();
      setStep(4);
    } else {
      setStep((s) => Math.min(s + 1, 4));
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

  return (
    <PageTransition>
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container size="narrow">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Book a Service
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Schedule Your <span className="text-gradient">Appointment</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400">
              Book online in under 2 minutes. We&apos;ll confirm your
              appointment within the hour.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8 sm:mb-12 max-w-xs sm:max-w-md mx-auto">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                    i <= step
                      ? "bg-primary text-white"
                      : "bg-surface-light text-gray-500 border border-white/10"
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
                      i < step ? "bg-primary" : "bg-white/10"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24 lg:pb-32 -mt-4">
        <Container size="narrow">
          <div className="bg-surface rounded-2xl border border-white/5 p-4 sm:p-6 lg:p-8 min-h-[350px] sm:min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Step 0: Select Service */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                    What do you need help with?
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {serviceCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => update("service", cat.id)}
                        className={cn(
                          "p-3 sm:p-4 rounded-xl border text-center transition-all duration-300",
                          form.service === cat.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
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

              {/* Step 1: Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                    Tell us more about the issue
                  </h2>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the plumbing issue or project..."
                    rows={4}
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                  <div className="mt-4 sm:mt-6">
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">How urgent is this?</p>
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
                              : "bg-surface-light text-gray-400 border border-white/10"
                          )}
                        >
                          {u === "soon" ? "Within a week" : u}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                    Pick a date & time
                  </h2>
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Preferred Date</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto">
                      {dates.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => update("date", d.value)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                            form.date === d.value
                              ? "bg-primary text-white"
                              : "bg-surface-light text-gray-400 border border-white/10 hover:border-white/20"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Preferred Time</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          onClick={() => update("time", t)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                            form.time === t
                              ? "bg-primary text-white"
                              : "bg-surface-light text-gray-400 border border-white/10 hover:border-white/20"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                    Your Information
                  </h2>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm outline-none focus:border-primary transition-colors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm outline-none focus:border-primary transition-colors"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="Phone"
                      type="tel"
                      className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Service Address"
                    className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm outline-none focus:border-primary transition-colors"
                  />
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-14 h-14 sm:w-20 sm:h-20 text-success mx-auto mb-4 sm:mb-6" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    Booking Submitted!
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto">
                    We&apos;ll confirm your appointment within the hour. For
                    urgent needs, call us directly.
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
            {step < 4 && (
              <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors",
                    step === 0
                      ? "text-gray-700 cursor-not-allowed"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!canProceed()}
                  className={cn(
                    "flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    canProceed()
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-surface-light text-gray-600 cursor-not-allowed"
                  )}
                >
                  {step === 3 ? "Submit Booking" : "Continue"}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
