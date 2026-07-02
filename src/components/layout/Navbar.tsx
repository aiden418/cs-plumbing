"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Calculator, Clock, Award, ShieldCheck, MessageSquareText } from "lucide-react";
import { NAV_LINKS, BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    // rAF-throttled; only commits state when the boolean actually flips so
    // scrolling doesn't re-render the fixed nav every frame
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        setIsScrolled((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setMobileDropdown(null);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow,translate] duration-300",
          isScrolled && "lg:-translate-y-9",
          isScrolled || !isHomepage
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-gradient-to-b from-black/40 via-black/20 to-transparent"
        )}
      >
        {/* Utility strip — trust signals + quick contact. Hidden by sliding
            the whole nav up (transform) instead of collapsing max-height,
            which forced layout on a fixed full-width element mid-scroll. */}
        <div
          className={cn(
            "hidden lg:block border-b transition-opacity duration-300",
            isScrolled && "opacity-0 pointer-events-none",
            isScrolled || !isHomepage
              ? "bg-primary text-white border-primary-dark/30"
              : "bg-black/30 text-white border-white/10"
          )}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-9 text-xs font-medium">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Mon–Fri 7:30 AM – 4:30 PM · 24/7 Emergency
                </span>
                <span className="hidden xl:flex items-center gap-1.5 opacity-80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Licensed CFC1432485
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="hidden xl:flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Best of Cape Coral 2025
                </span>
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center gap-1.5 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logos/logo-new.png"
                alt="C&S Plumbing of Lee"
                width={200}
                height={200}
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setOpenDropdown(link.label)
                  }
                  onMouseLeave={() => {
                    if (link.children) {
                      // Small delay so the mouse can travel across the
                      // tiny gap into the dropdown without it closing.
                      setTimeout(() => {
                        setOpenDropdown((current) =>
                          current === link.label ? null : current,
                        );
                      }, 120);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1",
                      pathname === link.href
                        ? "text-primary"
                        : isScrolled || !isHomepage
                          ? "text-gray-600 hover:text-gray-900"
                          : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label === "Service Areas" ? "Areas" : link.label}
                    {link.children && (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        className="absolute top-full left-0 pt-2 w-56 z-50"
                      >
                        <div className="py-2 rounded-xl glass shadow-lg">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-4 py-2.5 text-sm transition-colors duration-200",
                                pathname === child.href
                                  ? "text-primary bg-primary/5"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  isScrolled || !isHomepage
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
                aria-label={`Call ${BUSINESS.phone}`}
              >
                <Phone className="w-4 h-4" />
                {BUSINESS.phone}
              </a>
              <Link
                href="/quote-builder"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2.5 border text-sm font-semibold rounded-lg transition-all duration-300",
                  isScrolled || !isHomepage
                    ? "border-primary text-primary hover:bg-primary/5"
                    : "border-white/30 text-white hover:bg-white/10"
                )}
              >
                <Calculator className="w-3.5 h-3.5" />
                Quote
              </Link>
              <Link
                href="/booking"
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-md"
              >
                Book a Service
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                "lg:hidden p-3 -mr-1 transition-colors",
                isScrolled || !isHomepage ? "text-gray-900" : "text-white"
              )}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pt-24 px-6 flex flex-col overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    {link.children ? (
                      <>
                        <button
                          onClick={() =>
                            setMobileDropdown(
                              mobileDropdown === link.label
                                ? null
                                : link.label
                            )
                          }
                          className={cn(
                            "flex items-center justify-between w-full py-3 text-2xl font-bold transition-colors",
                            pathname.startsWith(link.href)
                              ? "text-primary"
                              : "text-gray-900"
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-300",
                              mobileDropdown === link.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 flex flex-col gap-0.5 pb-2">
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "py-2 text-base font-semibold transition-colors",
                                    pathname === link.href
                                      ? "text-primary"
                                      : "text-gray-700 active:text-primary"
                                  )}
                                >
                                  {link.label === "More" ? "All Pages" : `All ${link.label}`}
                                </Link>
                                {link.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      "py-2 text-base transition-colors",
                                      pathname === child.href
                                        ? "text-primary font-semibold"
                                        : "text-gray-500 active:text-gray-900"
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          "block py-3 text-2xl font-bold transition-colors",
                          pathname === link.href
                            ? "text-primary"
                            : "text-gray-900"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto py-8 flex flex-col gap-3 shrink-0">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="flex items-center justify-center gap-2 py-4 text-xl font-bold text-gray-900"
                >
                  <Phone className="w-5 h-5" />
                  {BUSINESS.phone}
                </a>
                <a
                  href={BUSINESS.smsHref}
                  className="flex items-center justify-center gap-2 py-4 border-2 border-gray-200 text-gray-900 text-lg font-bold rounded-xl"
                >
                  <MessageSquareText className="w-5 h-5" />
                  Text Us
                </a>
                <Link
                  href="/quote-builder"
                  className="flex items-center justify-center gap-2 py-4 border-2 border-primary text-primary text-lg font-bold rounded-xl"
                >
                  <Calculator className="w-5 h-5" />
                  Get Instant Quote
                </Link>
                <Link
                  href="/booking"
                  className="block text-center py-4 bg-primary text-white text-lg font-bold rounded-xl"
                >
                  Book a Service
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
