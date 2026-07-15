import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Find plumbing services, booking, and contact info for C&S Plumbing of Lee.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy px-6">
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
      <div className="relative max-w-md text-center">
        <p className="text-gold text-sm font-bold tracking-[0.2em] uppercase mb-4">
          404 — Page Not Found
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Oops, <span className="text-gold-gradient">wrong pipe.</span>
        </h1>
        <p className="text-white/70 text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold-dark transition-colors active:scale-[0.98] w-full sm:w-auto"
          >
            Book a Service
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors active:scale-[0.98] w-full sm:w-auto"
          >
            View Services
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 text-sm">
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors"
          >
            Go Home
          </Link>
          <span className="hidden sm:inline text-white/30">·</span>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="text-white/60 hover:text-white transition-colors"
          >
            Call {BUSINESS.phone}
          </a>
          <span className="hidden sm:inline text-white/30">·</span>
          <Link
            href="/contact"
            className="text-white/60 hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
