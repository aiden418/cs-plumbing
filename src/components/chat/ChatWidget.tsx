"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Phone,
  MessageSquareText,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { trackTextClick } from "@/lib/pixel";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;


  return (
    // data-drawer-hide: hidden while the Navbar mobile drawer is open (see globals.css)
    <div
      data-drawer-hide
      className="fixed bottom-20 right-4 sm:right-6 lg:bottom-6 z-40"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 sm:bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-[360px] bg-surface rounded-2xl border border-gray-200 shadow-2xl overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-primary p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    C&S Plumbing
                  </p>
                  <p className="text-white/70 text-[10px] sm:text-xs">
                    Request a call or email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4 flex flex-col max-h-[60dvh] overflow-y-auto">
              <p className="mb-3 text-sm text-gray-600">Leave your details and our office will follow up. For emergencies, call us.</p>
              <ServiceRequestForm compact source="chat" />

                  {/* Quick Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </a>
                    <a
                      href={BUSINESS.smsHref}
                      onClick={trackTextClick}
                      className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:border-primary/30 hover:text-gray-900 transition-all"
                    >
                      <MessageSquareText className="w-3.5 h-3.5" />
                      Text Us
                    </a>
                  </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-100 text-gray-500 rotate-0"
            : "bg-primary text-white hover:bg-primary-dark hover:shadow-[0_0_20px_rgba(0,153,255,0.3)]"
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </motion.button>

      {/* Notification dot */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 4, duration: 0.3 }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emergency rounded-full border-2 border-white"
        />
      )}
    </div>
  );
}
