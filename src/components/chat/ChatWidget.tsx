"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Phone,
  MessageSquareText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { trackPhoneClick, trackTextClick, trackContactForm } from "@/lib/pixel";

type FormState = "idle" | "sending" | "sent" | "error";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [textBack, setTextBack] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (formState === "sending") return;
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service: "Chat Widget Lead",
          message: `${issue}\n\nPreferred reply: ${textBack ? "text message" : "phone call"}`,
          source: "chat",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setFormState("sent");
      trackContactForm();
    } catch {
      setFormState("error");
    }
  }

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

            {/* Body */}
            <div className="p-3 sm:p-4 flex flex-col">
              {formState === "sent" ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Got it, {name.split(" ")[0] || "neighbor"}!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Our dispatcher will {textBack ? "text" : "call"} you back
                    shortly. For emergencies, always call{" "}
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="text-primary font-semibold"
                    >
                      {BUSINESS.phone}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <>
                  {/* Bot Message */}
                  <div className="flex gap-2 mb-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[9px] sm:text-[10px] font-bold">
                        C&S
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-md p-2.5 sm:p-3 max-w-[85%]">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Hi there! Tell us what&apos;s going on and a real
                        dispatcher will get right back to you.
                      </p>
                    </div>
                  </div>

                  {/* Lead form */}
                  <form onSubmit={submit} className="space-y-2">
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="tel"
                      required
                      minLength={7}
                      maxLength={30}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/50"
                    />
                    <textarea
                      required
                      minLength={5}
                      maxLength={2000}
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      placeholder="What's the plumbing issue?"
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/50 resize-none"
                    />
                    <label className="flex items-center gap-2 text-xs text-gray-500 px-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={textBack}
                        onChange={(e) => setTextBack(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Text me back (instead of calling)
                    </label>
                    {formState === "error" && (
                      <p className="text-xs text-red-500 px-1">
                        Something went wrong — please call or text us instead.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="flex items-center justify-center gap-2 w-full p-2.5 sm:p-3 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                    >
                      {formState === "sending" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                      {formState === "sending" ? "Sending…" : "Send to Dispatch"}
                    </button>
                  </form>

                  {/* Quick Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      onClick={trackPhoneClick}
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
                </>
              )}
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
