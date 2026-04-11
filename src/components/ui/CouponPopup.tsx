"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "cs-coupon-seen";

export default function CouponPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Tag className="w-7 h-7 text-primary" />
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                $50 OFF
              </h2>
              <p className="text-lg sm:text-xl font-bold text-primary mb-3">
                Your First Service
              </p>

              {/* Coupon code */}
              <div className="bg-[#F5F5F7] border border-dashed border-primary/40 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Your coupon code</p>
                <p className="text-xl font-mono font-bold text-gray-900 tracking-widest">
                  WELCOME50
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 mb-5">
                New customers only. Present this coupon at completion of service.
                Cannot be combined with other offers.
              </p>

              {/* CTA */}
              <Link
                href="/booking"
                onClick={dismiss}
                className="inline-flex items-center justify-center w-full gap-2 font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg"
              >
                Book Now &amp; Save $50
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
