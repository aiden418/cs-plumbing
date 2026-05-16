import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="max-w-md text-center">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
          404 — Page Not Found
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
          Oops, wrong pipe.
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            Book a Service
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors w-full sm:w-auto"
          >
            View Services
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Go Home
          </Link>
          <span className="hidden sm:inline text-gray-300">·</span>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Call {BUSINESS.phone}
          </a>
          <span className="hidden sm:inline text-gray-300">·</span>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
