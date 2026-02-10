"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 sm:bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-[360px] bg-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-2"
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
                    We typically reply in minutes
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

            {/* Chat Body */}
            <div className="p-3 sm:p-4 min-h-[240px] sm:min-h-[280px] flex flex-col">
              {/* Bot Message */}
              <div className="flex gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-[9px] sm:text-[10px] font-bold">
                    C&S
                  </span>
                </div>
                <div className="bg-surface-light rounded-2xl rounded-tl-md p-2.5 sm:p-3 max-w-[80%]">
                  <p className="text-xs sm:text-sm text-gray-300">
                    Hi there! Thanks for reaching out to C&S Plumbing. How
                    can we help you today?
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-[9px] sm:text-[10px] font-bold">
                    C&S
                  </span>
                </div>
                <div className="bg-surface-light rounded-2xl rounded-tl-md p-2.5 sm:p-3 max-w-[80%]">
                  <p className="text-xs sm:text-sm text-gray-300">
                    For the fastest response, give us a call or book online:
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-auto space-y-1.5 sm:space-y-2">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-2 w-full p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary text-xs sm:text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Call {BUSINESS.phone}
                </a>
                <a
                  href="/booking"
                  className="flex items-center gap-2 w-full p-2.5 sm:p-3 rounded-xl border border-white/10 text-gray-300 text-xs sm:text-sm font-medium hover:border-primary/30 hover:text-white transition-all"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Book Online
                </a>
                <a
                  href="/contact"
                  className="flex items-center gap-2 w-full p-2.5 sm:p-3 rounded-xl border border-white/10 text-gray-300 text-xs sm:text-sm font-medium hover:border-primary/30 hover:text-white transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Send a Message
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
            ? "bg-surface-light text-gray-400 rotate-0"
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
          className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emergency rounded-full border-2 border-background"
        />
      )}
    </div>
  );
}
