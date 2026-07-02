"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, MessageSquareText } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { trackPhoneClick, trackTextClick } from "@/lib/pixel";

const HIDDEN_PATHS = ["/booking", "/contact", "/quote-builder"];

export default function StickyMobileCTA() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="Quick contact"
    >
      <div className="grid grid-cols-3 gap-2 p-2">
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          onClick={trackPhoneClick}
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-sm active:bg-primary-dark"
          aria-label={`Call ${BUSINESS.phone}`}
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a
          href={BUSINESS.smsHref}
          onClick={trackTextClick}
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl border border-primary text-primary text-sm font-bold bg-white active:bg-primary/5"
          aria-label="Text us"
        >
          <MessageSquareText className="w-4 h-4" />
          Text
        </a>
        <Link
          href="/booking"
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl border border-primary text-primary text-sm font-bold bg-white active:bg-primary/5"
        >
          <Calendar className="w-4 h-4" />
          Book
        </Link>
      </div>
    </div>
  );
}
