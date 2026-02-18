"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/layout/PageTransition";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please describe your needs"),
});

type ContactForm = z.infer<typeof contactSchema>;

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
        className={cn(
          "peer w-full bg-surface border rounded-xl px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-white text-sm outline-none transition-all duration-300",
          "focus:border-primary focus:ring-1 focus:ring-primary/20",
          error ? "border-emergency" : "border-white/10"
        )}
      />
      <label className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-[10px] sm:text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-primary">
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-emergency">{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Contact Us
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
              Let&apos;s Talk <span className="text-gradient">Plumbing</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400">
              Have a question, need a quote, or facing an emergency? We&apos;re
              here to help.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
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
                      <p className="text-white font-semibold text-sm sm:text-base">Phone</p>
                      <p className="text-gray-400 text-xs sm:text-sm">
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
                      <p className="text-white font-semibold text-sm sm:text-base">Email</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{BUSINESS.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Office</p>
                      <p className="text-gray-400 text-xs sm:text-sm">
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
                      <p className="text-white font-semibold text-sm sm:text-base">Hours</p>
                      <p className="text-gray-400 text-xs sm:text-sm">
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
                  <div className="bg-surface rounded-2xl border border-white/5 p-8 sm:p-12 text-center">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-success mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">
                      We&apos;ll get back to you within 24 hours. For urgent
                      needs, call us at {BUSINESS.phone}.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5"
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
                        {...register("phone")}
                        error={errors.phone?.message}
                      />
                      <div className="relative">
                        <select
                          {...register("service")}
                          className={cn(
                            "w-full bg-surface border rounded-xl px-3 sm:px-4 py-3.5 sm:py-4 text-sm outline-none transition-all duration-300 appearance-none",
                            "focus:border-primary focus:ring-1 focus:ring-primary/20",
                            errors.service
                              ? "border-emergency text-white"
                              : "border-white/10 text-gray-400"
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
                          <p className="mt-1 text-xs text-emergency">
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
                        className={cn(
                          "peer w-full bg-surface border rounded-xl px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 text-white text-sm outline-none transition-all duration-300 resize-none",
                          "focus:border-primary focus:ring-1 focus:ring-primary/20",
                          errors.message
                            ? "border-emergency"
                            : "border-white/10"
                        )}
                      />
                      <label className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-[10px] sm:text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 sm:peer-focus:top-2 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-primary">
                        Tell us about your project
                      </label>
                      {errors.message && (
                        <p className="mt-1 text-xs text-emergency">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

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
    </PageTransition>
  );
}
