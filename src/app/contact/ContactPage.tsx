"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WhatHappensNext from "@/components/ui/WhatHappensNext";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackContactForm } from "@/lib/pixel";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "10-digit phone number required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please describe your needs"),
  website: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function FloatingInput({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "peer w-full bg-[#F5F5F7] border rounded-xl px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-gray-900 text-sm outline-none transition-all duration-300",
          "focus:border-primary focus:ring-1 focus:ring-primary/20",
          error ? "border-emergency" : "border-gray-300"
        )}
      />
      <label className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-[10px] sm:text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-primary">
        {label}
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs text-emergency">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });
  const phoneValue = watch("phone") ?? "";

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackContactForm();
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        align="center"
        overline="Contact Us"
        title="Let's Talk"
        accent="Plumbing"
        description="Have a question, need a quote, or facing an emergency? We're here to help."
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-5 sm:space-y-6">
                  <a
                    href={`tel:${BUSINESS.phoneRaw}`}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Phone</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.phone}
                      </p>
                      <p className="text-primary text-[10px] sm:text-xs mt-1">
                        Available 24/7 for emergencies
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Email</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{BUSINESS.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Office</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.address}
                        <br />
                        {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Hours</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.hours.weekday}
                        <br />
                        {BUSINESS.hours.saturday}
                        <br />
                        <span className="text-primary">
                          {BUSINESS.hours.emergency}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                {submitted ? (
                  <div className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-success mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">
                      We&apos;ll get back to you within 24 hours. For urgent
                      needs, call us at {BUSINESS.phone}.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <FloatingInput
                        label="Full Name"
                        {...register("name")}
                        error={errors.name?.message}
                      />
                      <FloatingInput
                        label="Email Address"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <FloatingInput
                        label="Phone Number"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        {...register("phone")}
                        value={phoneValue}
                        onChange={(e) =>
                          setValue("phone", normalizePhone(e.target.value), {
                            shouldValidate: true,
                          })
                        }
                        error={errors.phone?.message}
                      />
                      <div className="relative">
                        <select
                          {...register("service")}
                          className={cn(
                            "w-full bg-[#F5F5F7] border rounded-xl px-3 sm:px-4 py-3.5 sm:py-4 text-sm outline-none transition-all duration-300 appearance-none",
                            "focus:border-primary focus:ring-1 focus:ring-primary/20",
                            errors.service
                              ? "border-emergency text-gray-900"
                              : "border-gray-300 text-gray-500"
                          )}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a Service
                          </option>
                          <option value="emergency">Emergency Plumbing</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="new-construction">
                            New Construction
                          </option>
                          <option value="remodel">Remodeling</option>
                          <option value="water-heater">Water Heater</option>
                          <option value="drain">Drain Cleaning</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.service && (
                          <p role="alert" className="mt-1 text-xs text-emergency">
                            {errors.service.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        {...register("message")}
                        placeholder=" "
                        rows={4}
                        aria-invalid={errors.message ? "true" : undefined}
                        className={cn(
                          "peer w-full bg-[#F5F5F7] border rounded-xl px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-gray-900 text-sm outline-none transition-all duration-300 resize-none",
                          "focus:border-primary focus:ring-1 focus:ring-primary/20",
                          errors.message
                            ? "border-emergency"
                            : "border-gray-300"
                        )}
                      />
                      <label className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-[10px] sm:text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-primary">
                        Tell us about your project
                      </label>
                      {errors.message && (
                        <p role="alert" className="mt-1 text-xs text-emergency">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Honeypot — hidden from real users */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      {...register("website")}
                      className="absolute -left-[9999px] w-px h-px opacity-0"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      icon={<Send className="w-4 h-4" />}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                      We typically respond within a few hours during business
                      hours.
                    </p>
                  </form>
                )}
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      <WhatHappensNext
        steps={[
          {
            title: "Send your message",
            description:
              "Use the form, email, or call. Tell us what you need — we route it to the right person on our team.",
          },
          {
            title: "Reply within 1 business day",
            description:
              "Most messages get a response within a few hours during business hours. Urgent? Call 833-PLUMB-IT.",
          },
          {
            title: "Free site visit if needed",
            description:
              "For quotes that need eyes on the work, we'll set up a no-charge visit at a time that fits your schedule.",
          },
          {
            title: "Written estimate",
            description:
              "Clear scope, fair price, no pressure. You decide if and when to schedule the work.",
          },
        ]}
      />
    </PageTransition>
  );
}
