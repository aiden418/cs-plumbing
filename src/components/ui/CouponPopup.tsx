"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/pixel";

const STORAGE_KEY = "cs-coupon-seen";
const REARM_DAYS = 30;

// Never interrupt someone with a burst pipe or someone already converting.
const SUPPRESSED_PATHS = ["/emergency", "/booking", "/contact", "/quote-builder"];

function wasRecentlyDismissed(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  // Legacy "1" value or unparseable → treat as dismissed forever-ago, re-arm
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < REARM_DAYS * 24 * 60 * 60 * 1000;
}

export default function CouponPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const open = useCallback(() => {
    setShow((prev) => {
      if (!prev) trackEvent("ViewContent", { content_name: "Coupon Popup" });
      return true;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || suppressed) return;
    if (wasRecentlyDismissed()) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      open();
      cleanup();
    };

    // Desktop: exit intent — cursor leaves through the top of the viewport.
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    // Mobile (no reliable exit intent): 50% scroll depth shows real
    // engagement without ambushing the hero.
    const onScroll = () => {
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (depth >= 0.5) fire();
    };

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const cleanup = () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
    if (isCoarse) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }
    return cleanup;
  }, [suppressed, open]);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  if (suppressed) return null;

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
                onClick={() => {
                  trackEvent("Lead", { content_name: "Coupon Popup CTA" });
                  dismiss();
                }}
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
