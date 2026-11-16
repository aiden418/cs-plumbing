import Link from "next/link";
import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/business";
import { AREA_LANDINGS, PROFILES } from "@/lib/constants";
import { SERVICE_HUBS } from "@/lib/service-hubs";
import Container from "@/components/ui/Container";
import LogoLockup from "@/components/ui/LogoLockup";
import { ArrowUpRight, Clock, Mail, MapPin, MessageSquareText, Minus, Phone, Plus } from "@/components/ui/icons";

/**
 * The site footer (chrome-and-opening.md section 6; v2-bright.md: light,
 * `shell`, navy text, compact, contact first, the three link groups closed
 * accordions on phones). Server component.
 *
 * Its links are the one set of navigation in the HTML of every page, and the
 * phone menu button falls back to #footer-nav without JavaScript, so every
 * href here stays: tests/footer-coverage.test.ts compares them with the
 * footer of the site before the redesign.
 */

export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Awards", href: "/awards" },
  { label: "Services", href: "/services" },
  { label: "Builders", href: "/builders" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Service", href: "/booking" },
  { label: "Emergency", href: "/emergency" },
  { label: "Coastal Comeback Plan", href: "/coastal-comeback-plan" },
  { label: "Instant Quote", href: "/quote-builder" },
  { label: "Service Map", href: "/service-map" },
  { label: "Builder Portal", href: "/builder-portal" },
  { label: "FAQ", href: "/faq" },
  { label: "Recommended Companies", href: "/partners" },
];

// Every service hub, not SERVICES.slice(0, 7): the footer is the one set of
// links in the HTML on every page.
export const footerServices = [
  { label: "Residential Plumbing", href: "/services/residential" },
  ...SERVICE_HUBS.map((hub) => ({ label: hub.title, href: hub.href })),
  // Spoke page (not a hub) that still needs a sitewide HTML link.
  { label: "Tankless Water Heaters", href: "/services/tankless-water-heaters" },
];

// All 11 area hubs. Matching SERVICE_AREAS by name left Fort Myers Beach with
// two inbound links site-wide.
export const footerAreas = AREA_LANDINGS.map((area) => ({ label: area.city, href: `/areas/${area.slug}` }));

export const footerProfiles = PROFILES.filter((p) => p.footer);

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const PARENT_COMPANY = { label: "Part of Draft Construction", href: "https://draftconstructionswfl.com" };

const linkClass =
  "inline-flex min-h-11 items-center text-base leading-snug text-steel-800 transition-colors duration-150 hover:text-primary-dark hover:underline decoration-2 underline-offset-[0.25em] md:min-h-9";

/**
 * One link group. On phones a closed native <details> accordion, so the
 * footer stays short; from md an open column (chrome.css, where browsers
 * that can style ::details-content show it open and the summary becomes a
 * plain heading). Older browsers keep the working accordion.
 */
function LinkGroup({
  id,
  title,
  links,
  className,
  listClassName,
  after,
}: {
  id: string;
  title: string;
  links: { label: string; href: string }[];
  className?: string;
  listClassName?: string;
  after?: ReactNode;
}) {
  return (
    <details className={`footer-group group ${className ?? ""}`}>
      <summary className="footer-summary">
        <h3 id={id} className="text-[1.0625rem] font-semibold text-navy">
          {title}
        </h3>
        <Plus className="footer-summary-icon size-5 group-open:hidden" />
        <Minus className="footer-summary-icon hidden size-5 group-open:block" />
      </summary>
      <ul aria-labelledby={id} className={`pb-4 md:pb-0 ${listClassName ?? ""}`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {after}
    </details>
  );
}

export default function Footer() {
  const contactRow =
    "flex min-h-11 items-start gap-3 py-2 text-base leading-snug text-steel-800";
  const icon = "mt-0.5 size-5 shrink-0 text-primary-dark";

  return (
    <footer data-tone="shell" className="site-footer border-t border-steel-200 bg-canvas text-body">
      <Container className="pt-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-10">
          {/* Contact first: the lockup, the family line, how to reach the office */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-10 lg:col-span-4 lg:grid-cols-1">
            <div>
              <LogoLockup size="md" surface="light" />
              <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-steel-800">{BUSINESS.description}</p>
              <ul className="mt-3 flex flex-wrap gap-x-5">
                {footerProfiles.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`C&S Plumbing on ${p.label}`}
                      className={`${linkClass} gap-1`}
                    >
                      {p.label}
                      <ArrowUpRight className="size-4 text-primary-dark" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <p className="mb-1 font-semibold text-navy">{BUSINESS.fullName}</p>
              <a
                href={BUSINESS.phoneHref}
                className="flex min-h-11 items-center gap-3 py-1 text-[1.25rem] font-bold text-primary-dark hover:underline decoration-2 underline-offset-[0.25em]"
              >
                <Phone className="size-5 shrink-0" />
                {BUSINESS.phone}
              </a>
              <a href={BUSINESS.smsHref} className={`${contactRow} hover:text-primary-dark`}>
                <MessageSquareText className={icon} />
                Text us anytime
              </a>
              <a href={`mailto:${BUSINESS.email}`} className={`${contactRow} break-all hover:text-primary-dark`}>
                <Mail className={icon} />
                {BUSINESS.email}
              </a>
              <div className={contactRow}>
                <MapPin className={icon} />
                <span>
                  {BUSINESS.address}
                  <br />
                  {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                </span>
              </div>
              <h3 className="sr-only">Business Hours</h3>
              <div className={contactRow}>
                <Clock className={icon} />
                <div>
                  <div>{BUSINESS.hours.open}</div>
                  <div className="mt-0.5 font-semibold text-primary-dark">{BUSINESS.hours.emergency}</div>
                </div>
              </div>
            </div>
          </div>

          {/* The link groups. The phone menu button links here without JavaScript. */}
          <nav
            id="footer-nav"
            aria-label="Footer"
            className="border-t border-steel-200 md:grid md:grid-cols-[1.35fr_1fr_0.8fr] md:gap-x-8 md:border-t-0 lg:col-span-8"
          >
            <LinkGroup
              id="footer-explore"
              title="Quick Links"
              links={quickLinks}
              listClassName="grid grid-cols-2 gap-x-6"
            />
            <LinkGroup
              id="footer-services"
              title="Our Services"
              links={footerServices}
              listClassName="grid grid-cols-2 gap-x-6 md:grid-cols-1"
            />
            <LinkGroup
              id="footer-areas"
              title="Service Areas"
              links={footerAreas}
              listClassName="grid grid-cols-2 gap-x-6 md:grid-cols-1"
              after={<p className="-mt-2 pb-4 text-base text-steel-600 md:mt-1 md:pb-0">&amp; more</p>}
            />
          </nav>
        </div>

        {/* License, legal pages, the parent company, copyright */}
        <div className="mt-4 py-5 text-[0.9375rem] text-steel-600 md:mt-12 md:border-t md:border-steel-200">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS.fullName}. All rights reserved.{" "}
              <span className="whitespace-nowrap">
                FL Licensed:{" "}
                <a
                  href={BUSINESS.licenseLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-my-3 inline-block py-3 font-semibold text-navy underline decoration-steel-300 underline-offset-[0.25em] hover:text-primary-dark hover:decoration-primary-dark"
                  title="Verify on MyFloridaLicense.com"
                  aria-label={`Verify license ${BUSINESS.license} on MyFloridaLicense.com`}
                >
                  #{BUSINESS.license}
                </a>
                <span className="ml-1.5">(verify)</span>
              </span>
            </p>
            <ul className="flex flex-wrap gap-x-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-steel-800 hover:text-primary-dark hover:underline underline-offset-[0.25em]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p>
            <a
              href={PARENT_COMPANY.href}
              target="_blank"
              rel="noopener noreferrer"
              className="-my-3 inline-block py-3 text-steel-800 hover:text-primary-dark hover:underline underline-offset-[0.25em]"
            >
              {PARENT_COMPANY.label}
            </a>
            {" · "}Designed &amp; managed by ASP LLC
          </p>
        </div>
      </Container>
    </footer>
  );
}
