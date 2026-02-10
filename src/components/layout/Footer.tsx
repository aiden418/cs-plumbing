"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { BUSINESS, SERVICES, SERVICE_AREAS } from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Service", href: "/booking" },
  { label: "Emergency", href: "/emergency" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <Image
                src="/images/logos/logo.png"
                alt="C&S Plumbing of Lee County"
                width={160}
                height={120}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 sm:mb-6">
              {BUSINESS.description}
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  {BUSINESS.address}
                  <br />
                  {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — hidden on tiny mobile */}
          <div className="hidden sm:block">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Our Services
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {SERVICES.slice(0, 7).map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Service Areas */}
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Business Hours
            </h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{BUSINESS.hours.weekday}</span>
              </div>
              <div className="ml-6">{BUSINESS.hours.saturday}</div>
              <div className="ml-6">{BUSINESS.hours.sunday}</div>
              <div className="mt-2 text-primary font-semibold">
                {BUSINESS.hours.emergency}
              </div>
            </div>

            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Service Areas
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              {SERVICE_AREAS.slice(0, 8).join(" · ")} & more
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {BUSINESS.fullName}. All rights
            reserved. License #{BUSINESS.license}
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
