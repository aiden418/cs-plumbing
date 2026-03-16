"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStep {
  label: string;
}

interface WizardShellProps {
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  children: React.ReactNode;
  nextLabel?: string;
}

export default function WizardShell({
  steps,
  currentStep,
  onNext,
  onPrev,
  canProceed,
  children,
  nextLabel,
}: WizardShellProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300",
                i <= currentStep
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              )}
            >
              {i < currentStep ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-5 sm:w-8 md:w-12 h-0.5 mx-0.5 sm:mx-1 transition-colors duration-300",
                  i < currentStep ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Reassurance text */}
      <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-6 sm:mb-8">
        This helps us understand your project. Your final price is confirmed with a free on-site visit — no obligation.
      </p>

      {/* Step content */}
      <div className="min-h-[280px] sm:min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors",
            currentStep === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
            canProceed
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-[#F5F5F7] text-gray-400 cursor-not-allowed"
          )}
        >
          {nextLabel ?? "Continue"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
