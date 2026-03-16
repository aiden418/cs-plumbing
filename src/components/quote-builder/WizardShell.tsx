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
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div
                className={cn(
                  "w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-sm font-bold transition-all duration-300",
                  i <= currentStep
                    ? "bg-primary text-white"
                    : "bg-white text-gray-400 border border-gray-200"
                )}
              >
                {i < currentStep ? (
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-3 sm:w-6 md:w-10 h-0.5 transition-colors duration-300",
                    i < currentStep ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step label */}
      <p className="text-[10px] sm:text-xs text-primary font-semibold text-center mb-1 tracking-wide uppercase">
        Step {currentStep + 1}: {steps[currentStep].label}
      </p>

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
