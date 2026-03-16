"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  Send,
  Phone,
  CalendarCheck,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type {
  QuoteResult as QuoteResultType,
  ServiceType,
  WaterHeaterSelections,
  RepipeSelections,
  LeadCaptureData,
} from "@/lib/quote-types";

interface QuoteResultProps {
  result: QuoteResultType;
  selections: WaterHeaterSelections | RepipeSelections;
  onReset: () => void;
}

const INCLUDED_ITEMS = {
  "water-heater": [
    "Professional installation by a licensed plumber",
    "Old unit removal & disposal",
    "All required permits & inspections",
    "Post-install cleanup",
    "Warranty coverage as selected",
  ],
  repipe: [
    "All materials & labor",
    "Permit & inspections",
    "Drywall patching & restoration",
    "Post-install cleanup",
    "Pressure testing & inspection",
  ],
};

export default function QuoteResult({
  result,
  selections,
  onReset,
}: QuoteResultProps) {
  const [showForm, setShowForm] = useState(false);
  const [lead, setLead] = useState<LeadCaptureData>({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: result.service,
          selections,
          result,
          lead,
        }),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = lead.name.length >= 2 && lead.email.includes("@") && lead.phone.length >= 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your Estimate
        </h2>
        <p className="text-sm text-gray-500">
          Most homeowners in Lee County pay
        </p>

        {/* Price range */}
        <div className="text-4xl sm:text-5xl font-black text-gray-900 my-4 sm:my-6">
          ${result.total.min.toLocaleString()} – ${result.total.max.toLocaleString()}
        </div>

        {/* Field verification badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Free on-site verification included
        </div>
      </div>

      {/* Line items */}
      <div className="border-t border-gray-100 pt-4 sm:pt-6 mb-4 sm:mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Breakdown</h3>
        <div className="space-y-2">
          {result.lineItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs sm:text-sm"
            >
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">
                {item.range.min === item.range.max
                  ? `$${Math.abs(item.range.min).toLocaleString()}${item.range.min < 0 ? " credit" : ""}`
                  : `$${item.range.min.toLocaleString()} – $${item.range.max.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className="bg-[#F5F5F7] rounded-xl p-4 sm:p-5 mb-4 sm:mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">What&apos;s Included</h3>
        <ul className="space-y-2">
          {INCLUDED_ITEMS[result.service].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      {result.notes.length > 0 && (
        <div className="mb-6 sm:mb-8">
          {result.notes.map((note, i) => (
            <p key={i} className="text-[10px] sm:text-xs text-gray-400 mb-1">
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
          Every home is different. A licensed C&S plumber will confirm your exact price during a{" "}
          <strong>free, no-obligation visit</strong>. This estimate is based on typical installations in Lee County.
        </p>
      </div>

      {/* Lead capture */}
      {!submitted ? (
        <>
          {!showForm ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all duration-300"
              >
                <Send className="w-4 h-4" /> Email Me This Quote
              </button>
              <Button
                href="/booking"
                variant="secondary"
                icon={<CalendarCheck className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Schedule Your Free Visit
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-gray-900">
                We&apos;ll email you this quote — no spam, ever.
              </p>
              <input
                value={lead.name}
                onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={lead.email}
                  onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  type="email"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                />
                <input
                  value={lead.phone}
                  onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone"
                  type="tel"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                  canSubmit && !submitting
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-[#F5F5F7] text-gray-400 cursor-not-allowed"
                )}
              >
                {submitting ? "Sending..." : "Send My Quote"}
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">Quote sent!</p>
          <p className="text-xs text-gray-500 mb-4">
            Check your email. We&apos;ll be in touch shortly.
          </p>
          <Button
            href={`tel:${BUSINESS.phoneRaw}`}
            variant="secondary"
            icon={<Phone className="w-4 h-4" />}
            size="sm"
          >
            Call {BUSINESS.phone}
          </Button>
        </motion.div>
      )}

      {/* Start over */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <button
          onClick={onReset}
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Start Over
        </button>
      </div>
    </motion.div>
  );
}
