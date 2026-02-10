"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronRight, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { ESTIMATOR_SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CostEstimator() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const service = ESTIMATOR_SERVICES.find((s) => s.id === selectedService);

  const calculateRange = () => {
    if (!service || !selectedFactor) return { min: 0, max: 0 };
    const factorIndex = service.factors.indexOf(selectedFactor);
    const multiplier = 0.5 + (factorIndex / (service.factors.length - 1)) * 1;
    return {
      min: Math.round(service.baseMin * multiplier / 50) * 50,
      max: Math.round(service.baseMax * multiplier / 50) * 50,
    };
  };

  const reset = () => {
    setSelectedService(null);
    setSelectedFactor(null);
    setShowResult(false);
  };

  const range = calculateRange();

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Cost Estimator</h3>
          <p className="text-[10px] sm:text-xs text-gray-500">Get a rough estimate in seconds</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Service */}
        {!selectedService && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">What service do you need?</p>
            <div className="grid grid-cols-2 gap-2">
              {ESTIMATOR_SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className="p-2.5 sm:p-3 rounded-xl border border-white/10 text-left text-xs sm:text-sm text-gray-300 hover:border-primary/30 hover:text-white transition-all duration-300 group"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {s.label}
                  </span>
                  <ChevronRight className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Factor */}
        {selectedService && !showResult && service && (
          <motion.div
            key="factors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              What type of {service.label.toLowerCase()}?
            </p>
            <div className="space-y-2">
              {service.factors.map((factor) => (
                <button
                  key={factor}
                  onClick={() => {
                    setSelectedFactor(factor);
                    setShowResult(true);
                  }}
                  className={cn(
                    "w-full p-2.5 sm:p-3 rounded-xl border text-left text-xs sm:text-sm transition-all duration-300",
                    selectedFactor === factor
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-gray-300 hover:border-primary/30 hover:text-white"
                  )}
                >
                  {factor}
                </button>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-3 sm:mt-4 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Start over
            </button>
          </motion.div>
        )}

        {/* Result */}
        {showResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              {service?.label} — {selectedFactor}
            </p>
            <div className="text-3xl sm:text-4xl font-black text-white my-3 sm:my-4">
              ${range.min.toLocaleString()} – ${range.max.toLocaleString()}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6">
              *Estimate only. Actual cost depends on specific conditions.
              <br />
              Contact us for a free, accurate quote.
            </p>
            <div className="flex flex-col gap-2">
              <Button href="/booking" size="sm" className="w-full">
                Book This Service
              </Button>
              <button
                onClick={reset}
                className="text-xs sm:text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors py-2"
              >
                <RotateCcw className="w-3 h-3" /> Try another service
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
