"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "@/components/ui/icons";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { trackEvent } from "@/lib/pixel";
import { GIVEAWAY, isGiveawayOpen } from "@/lib/giveaway";

const STORAGE_KEY = "cs-coupon-seen";
const REARM_DAYS = 30;
// While the giveaway is open the card announces it instead of the coupon. It
// has its own key, so a visitor who closed the coupon last week still hears
// about the giveaway, and it comes back after a week, not a month.
const GIVEAWAY_STORAGE_KEY = "cs-giveaway-seen";
const GIVEAWAY_REARM_DAYS = 7;
/** The giveaway card does not wait for exit intent or half a page of scroll. */
const GIVEAWAY_DELAY_MS = 5000;

// Never interrupt someone with a burst pipe or someone already converting.
const SUPPRESSED_PATHS = ["/emergency", "/booking", "/contact", "/quote-builder", "/water-heater-giveaway"];

function wasRecentlyDismissed(key: string, days: number): boolean {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    // Storage blocked: treat as seen rather than show it on every page.
    return true;
  }
  if (!raw) return false;
  const ts = Number(raw);
  // Legacy "1" value or unparseable → treat as dismissed forever-ago, re-arm
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < days * 24 * 60 * 60 * 1000;
}

function remember(key: string) {
  try {
    localStorage.setItem(key, String(Date.now()));
  } catch {
    // Storage blocked: nothing to record.
  }
}

/**
 * The coupon card (chrome-and-opening.md section 5): a non-modal card, top
 * right under the header on fine pointers, above the phone dock on touch. It
 * never takes focus, never dims the page and never blocks scrolling. The
 * 30-day key is recorded when the card is first shown. While it shows,
 * body[data-coupon-open] tells the request button to step aside and moves
 * the page's scroll padding clear of it (chrome.css).
 *
 * Until the giveaway's end date (src/lib/giveaway.ts) the same card carries
 * the giveaway instead, shown a few seconds after the page loads. After that
 * date it is the coupon again with no deploy.
 */
export default function CouponPopup() {
  const [show, setShow] = useState(false);
  // Read once on mount (client only): which offer this visit gets.
  const [giveaway] = useState(() => isGiveawayOpen());
  const storageKey = giveaway ? GIVEAWAY_STORAGE_KEY : STORAGE_KEY;
  const rearmDays = giveaway ? GIVEAWAY_REARM_DAYS : REARM_DAYS;
  const popupName = giveaway ? "Giveaway Popup" : "Coupon Popup";
  const cardRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const open = useCallback(() => {
    remember(storageKey);
    setShow((prev) => {
      if (!prev) trackEvent("ViewContent", { content_name: popupName });
      return true;
    });
  }, [storageKey, popupName]);

  // Publish the card's state and height to the page (attributes only, no
  // React state outside this component).
  const visible = show && !suppressed;
  useEffect(() => {
    if (!visible) return;
    const body = document.body;
    const root = document.documentElement;
    body.setAttribute("data-coupon-open", "");
    const card = cardRef.current;
    const measure = () => {
      if (card) root.style.setProperty("--coupon-h", `${card.offsetHeight}px`);
    };
    measure();
    const observer = typeof ResizeObserver === "function" && card ? new ResizeObserver(measure) : null;
    if (observer && card) observer.observe(card);
    return () => {
      observer?.disconnect();
      body.removeAttribute("data-coupon-open");
      root.style.removeProperty("--coupon-h");
    };
  }, [visible]);

  useEffect(() => {
    if (typeof window === "undefined" || suppressed) return;
    if (wasRecentlyDismissed(storageKey, rearmDays)) return;

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
    const timer = giveaway ? window.setTimeout(fire, GIVEAWAY_DELAY_MS) : undefined;
    const cleanup = () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      if (timer !== undefined) window.clearTimeout(timer);
    };
    if (isCoarse) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }
    return cleanup;
  }, [suppressed, open, giveaway, storageKey, rearmDays]);

  function dismiss() {
    setShow(false);
    remember(storageKey);
  }

  if (!visible) return null;

  return (
    <aside
      ref={cardRef}
      data-tone="white"
      aria-label={giveaway ? "Oldest water heater giveaway" : "Coupon for your first service"}
      className="coupon-card enter overflow-hidden rounded-2xl border border-steel-200 bg-canvas text-body shadow-lift"
    >
            {/* Close button */}
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-1 right-1 inline-flex size-11 items-center justify-center rounded-control text-fg transition-colors duration-150 hover:bg-fg/[0.06] active:scale-[0.96]"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {giveaway ? (
            <div className="p-5">
              <p className="eyebrow pr-10 text-accent">Anniversary giveaway</p>
              <h2 className="mt-2 text-display-sm text-fg">
                Got an old water heater?
              </h2>
              <p className="mt-2 text-body">
                We&apos;re looking for the oldest working water heater in {GIVEAWAY.cities.slice(0, -1).join(", ")} and{" "}
                {GIVEAWAY.cities[GIVEAWAY.cities.length - 1]}. The oldest one wins a new one, installed free.
              </p>
              <p className="mt-3 mb-4 text-sm leading-snug text-muted">
                Enter yours, or one you know of, by {GIVEAWAY.endsLabelShort}. No purchase necessary.
              </p>
              <Link
                href={GIVEAWAY.path}
                onClick={() => {
                  trackEvent("ViewContent", { content_name: "Giveaway Popup CTA" });
                  dismiss();
                }}
                className={buttonClasses({ variant: "primary", size: "md", fullWidth: true })}
              >
                Enter the giveaway
              </Link>
            </div>
            ) : (
            <div className="p-5">
              {/* Headline */}
              <h2 className="pr-10 text-display-sm display-wide text-fg">
                $50 OFF
              </h2>
              <p className="mt-1 text-lead font-semibold text-fg">
                Your First Service
              </p>

              {/* Coupon code */}
              <div className="mt-4 rounded-control border border-dashed border-steel-300 bg-shell px-4 py-3">
                <p className="text-[0.875rem] font-semibold text-accent">Your coupon code</p>
                <p className="mt-1.5 font-mono text-xl font-bold tracking-widest text-fg tabular-nums">
                  WELCOME50
                </p>
              </div>

              {/* Terms */}
              <p className="mt-3 mb-4 text-sm leading-snug text-muted">
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
                className={buttonClasses({ variant: "primary", size: "md", fullWidth: true })}
              >
                Book Now &amp; Save $50
              </Link>
            </div>
            )}
    </aside>
  );
}
