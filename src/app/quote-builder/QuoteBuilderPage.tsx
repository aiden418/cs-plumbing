"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Flame } from "lucide-react";
import Container from "@/components/ui/Container";
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
  const [service, setService] = useState<ServiceType | null>(null);
  const [result, setResult] = useState<QuoteResultType | null>(null);
  const [selections, setSelections] = useState<WaterHeaterSelections | RepipeSelections | null>(null);

  useEffect(() => {
    const param = searchParams.get("service");
    if (param === "water-heater" || param === "repipe") {
      setService(param);
    }
  }, [searchParams]);

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

  return (
    <>
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 bg-[#F5F5F7]">
        <Container size="narrow">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Instant Quote Builder
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Build Your <span className="text-gradient">Project Estimate</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
              Answer a few questions and get an instant price range. No commitment — just a starting point for your project.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24 lg:pb-32 -mt-2">
        <Container size="narrow">
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
        </Container>
      </section>
    </>
  );
}
