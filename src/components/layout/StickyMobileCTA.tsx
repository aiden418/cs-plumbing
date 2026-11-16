"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, MessageSquareText } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { trackTextClick } from "@/lib/pixel";

const HIDDEN_PATHS = ["/booking", "/contact", "/quote-builder"];

const target =
  "flex min-h-12 items-center justify-center gap-2 rounded-control text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 ease-enter active:scale-[0.98]";
const outline = `${target} border border-white/70 text-white hover:bg-white/10`;

/**
 * The phone dock (chrome-and-opening.md section 3): Call, Text and Book, fixed
 * to the bottom below md. The footer reserves its height (--dock-h), and the
 * page's scroll-padding keeps focused elements clear of it.
 *
 * Call tracking: the tel: link has no handler of its own (one document-level
 * listener counts every call tap); the Text link calls trackTextClick.
 */
export default function StickyMobileCTA() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <div
      // data-drawer-hide: hidden while the mobile menu is open (see globals.css)
      data-drawer-hide
      data-dock
      data-tone="ink"
      className="fixed inset-x-0 bottom-0 z-40 h-(--dock-h) border-t border-white/14 bg-ink pt-2 pr-[calc(0.75rem+env(safe-area-inset-right,0px))] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pl-[calc(0.75rem+env(safe-area-inset-left,0px))] md:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="grid h-full grid-cols-3 gap-2">
        <a
          href={BUSINESS.phoneHref}
          className={`${target} bg-primary text-white hover:bg-primary-dark`}
          aria-label={`Call ${BUSINESS.phoneDigits} (${BUSINESS.phone})`}
        >
          <Phone className="size-5" />
          Call
        </a>
        <a href={BUSINESS.smsHref} onClick={trackTextClick} className={outline} aria-label="Text us">
          <MessageSquareText className="size-5" />
          Text
        </a>
        <Link href="/booking" className={outline}>
          <Calendar className="size-5" />
          Book
        </Link>
      </div>
    </div>
  );
}
