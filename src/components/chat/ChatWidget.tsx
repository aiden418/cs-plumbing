"use client";

import { useState, useEffect } from "react";
import { Phone, MessageSquareText } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { trackTextClick } from "@/lib/pixel";
import Dialog from "@/components/ui/Dialog";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";

/**
 * Request service (chrome-and-opening.md section 4; v2-bright.md: a small
 * white pill with a border): a labelled button,
 * bottom right (above the phone dock below md), that opens the shared Dialog
 * as a sheet (bottom on phones, right from 48rem) with the compact service
 * request form. It steps aside while the coupon card shows and while the
 * mobile menu is open (chrome.css, data-drawer-hide).
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* data-drawer-hide: hidden while the mobile menu is open (see globals.css) */}
      <div data-drawer-hide className="request-fab enter">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="inline-flex min-h-11 items-center gap-2 rounded-chip border border-steel-300 bg-white px-4 font-sans text-[0.9375rem] font-semibold text-navy shadow-lift transition-[background-color,transform] duration-150 ease-enter hover:bg-steel-50 active:scale-[0.98]"
        >
          <MessageSquareText className="size-5 text-primary-dark" />
          Request service
        </button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="sheet"
        className="request-dialog"
        closeLabel="Close request form"
        title={
          <span className="block">
            <span className="block">{BUSINESS.name}</span>
            <span className="block text-sm font-normal text-muted">Request a call or email</span>
          </span>
        }
      >
        <p className="mb-4 text-[0.9375rem] text-body">
          Leave your details and our office will follow up. For emergencies, call us.
        </p>
        <ServiceRequestForm compact source="chat" />

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-rule pt-5">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-3 text-[0.9375rem] font-semibold text-white transition-[background-color,transform] duration-150 ease-enter hover:bg-primary-dark active:scale-[0.98]"
          >
            <Phone className="size-5" />
            Call Now
          </a>
          <a
            href={BUSINESS.smsHref}
            onClick={trackTextClick}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-fg px-3 text-[0.9375rem] font-semibold text-fg transition-[background-color,transform] duration-150 ease-enter hover:bg-fg/[0.06] active:scale-[0.98]"
          >
            <MessageSquareText className="size-5" />
            Text Us
          </a>
        </div>
      </Dialog>
    </>
  );
}
