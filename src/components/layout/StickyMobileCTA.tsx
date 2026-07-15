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
    <>
      {/* Reserves the bar's height at the page bottom (this component renders
          after Footer in layout.tsx) so the fixed bar never covers content.
          The HIDDEN_PATHS early-return removes bar and spacer together. */}
      <div
        aria-hidden
        className="lg:hidden h-16 pb-[env(safe-area-inset-bottom)]"
      />
      <div
        // data-drawer-hide: hidden while the Navbar mobile drawer is open (see globals.css)
        data-drawer-hide
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        role="region"
        aria-label="Quick contact"
      >
      <div className="grid grid-cols-3 gap-2 p-2">
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          onClick={trackPhoneClick}
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-sm active:bg-primary-dark active:scale-[0.97] transition-transform"
          aria-label={`Call ${BUSINESS.phone}`}
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href={BUSINESS.smsHref}
          onClick={trackTextClick}
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl border border-primary text-primary text-sm font-bold bg-white active:bg-primary/5 active:scale-[0.97] transition-transform"
          aria-label="Text us"
        >
          <MessageSquareText className="w-4 h-4" />
          Text
        </a>
        <Link
          href="/booking"
          className="flex items-center justify-center gap-1.5 h-12 rounded-xl border border-primary text-primary text-sm font-bold bg-white active:bg-primary/5 active:scale-[0.97] transition-transform"
        >
          <Calendar className="w-4 h-4" />
          Book
        </Link>
      </div>
      </div>
    </>
  );
}
