"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Flame } from "lucide-react";
import WaterHeaterQuiz from "@/components/quote-builder/WaterHeaterQuiz";
import RepipeQuiz from "@/components/quote-builder/RepipeQuiz";
import QuoteResult from "@/components/quote-builder/QuoteResult";
import { cn } from "@/lib/utils";
import type {
  ServiceType,
  WaterHeaterSelections,
  RepipeSelections,
  QuoteResult as QuoteResultType,
} from "@/lib/quote-types";

export default function QuoteBuilderPage() {
  const searchParams = useSearchParams();
  const param = searchParams.get("service");
  const paramService: ServiceType | null =
    param === "water-heater" || param === "repipe" ? param : null;

  // Seeded straight from ?service= instead of via an effect. The parent wraps
  // this in <Suspense>, so it never renders during prerender and there's no
  // server HTML to mismatch.
  const [service, setService] = useState<ServiceType | null>(paramService);
  const [result, setResult] = useState<QuoteResultType | null>(null);
  const [selections, setSelections] = useState<WaterHeaterSelections | RepipeSelections | null>(null);

  // Re-sync when the URL changes under us (a client-side nav into the other
  // quiz). Like the effect it replaces, a missing param leaves the choice alone
  // rather than clearing it.
  const [lastParamService, setLastParamService] = useState(paramService);
  if (paramService !== lastParamService) {
    setLastParamService(paramService);
    if (paramService) setService(paramService);
  }

  const handleComplete = (
    sel: WaterHeaterSelections | RepipeSelections,
    res: QuoteResultType
  ) => {
    setSelections(sel);
    setResult(res);
  };

  const handleReset = () => {
    setService(null);
    setResult(null);
    setSelections(null);
  };

  const switchService = (s: ServiceType) => {
    setService(s);
    setResult(null);
    setSelections(null);
  };

  // The page hero is rendered by the server page (page.tsx) above this
  // Suspense boundary so the H1 and copy reach crawlers; this component is
  // only the interactive quiz.
  return (
    <>
      <section className="pb-16 sm:pb-24 lg:pb-32 -mt-4 sm:-mt-6">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Service selector */}
            {!service && !result && (
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  What project are you planning?
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Choose a service to get started with your custom estimate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => switchService("water-heater")}
                    className="group flex items-center gap-4 p-5 sm:p-6 rounded-xl border border-gray-200 text-left hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block">
                        Water Heater Install
                      </span>
                      <span className="text-xs text-gray-500">
                        Tank, tankless, or hybrid
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => switchService("repipe")}
                    className="group flex items-center gap-4 p-5 sm:p-6 rounded-xl border border-gray-200 text-left hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-gray-900 block">
                        Whole-Home Repipe
                      </span>
                      <span className="text-xs text-gray-500">
                        PEX or copper repiping
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Active quiz */}
            {service && !result && (
              <motion.div
                key={`quiz-${service}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Service toggle */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1">
                    <button
                      onClick={() => switchService("water-heater")}
                      className={cn(
                        "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                        service === "water-heater"
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      <Flame className="w-4 h-4" />
                      Water Heater
                    </button>
                    <button
                      onClick={() => switchService("repipe")}
                      className={cn(
                        "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                        service === "repipe"
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      <Droplets className="w-4 h-4" />
                      Repipe
                    </button>
                  </div>
                </div>

                {service === "water-heater" ? (
                  <WaterHeaterQuiz onComplete={handleComplete} />
                ) : (
                  <RepipeQuiz onComplete={handleComplete} />
                )}
              </motion.div>
            )}

            {/* Result */}
            {result && selections && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuoteResult
                  result={result}
                  selections={selections}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
