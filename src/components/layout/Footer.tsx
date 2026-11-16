import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { AREA_LANDINGS, PROFILES } from "@/lib/constants";
import { SERVICE_HUBS } from "@/lib/service-hubs";
import Container from "@/components/ui/Container";
import LogoLockup from "@/components/ui/LogoLockup";
import { ArrowUpRight, Clock, Mail, MapPin, MessageSquareText, Phone } from "@/components/ui/icons";

/**
 * The site footer (chrome-and-opening.md section 6). Server component on ink.
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
  "inline-flex min-h-11 items-center text-[0.9375rem] leading-snug text-body transition-colors duration-150 hover:text-fg hover:underline underline-offset-[0.25em] decoration-brass";

function LinkColumn({
  id,
  title,
  links,
  className,
  listClassName,
}: {
  id: string;
  title: string;
  links: { label: string; href: string }[];
  className?: string;
  listClassName?: string;
}) {
  return (
    <div className={className}>
      <h3 id={id} className="label-tech text-accent">
        {title}
      </h3>
      <ul aria-labelledby={id} className={`mt-4 border-t border-rule ${listClassName ?? ""}`}>
        {links.map((link) => (
          <li key={link.href} className="border-b border-rule">
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const contactRow = "flex min-h-11 items-start gap-3 py-2.5 text-[0.9375rem] leading-snug";
  const icon = "size-5 shrink-0 text-accent";

  return (
    <footer data-tone="ink" className="site-footer bg-canvas text-body">
      <Container className="pt-section-sm">
        {/* Row 1: the lockup and the family line; how to reach the office */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <LogoLockup size="md" />
            <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-body">{BUSINESS.description}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
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
                    <ArrowUpRight className="size-4 text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            <div className="flex flex-col gap-1">
              <p className="mb-3 font-semibold text-fg">{BUSINESS.fullName}</p>
              <div className={contactRow}>
                <MapPin className={icon} />
                <span>
                  {BUSINESS.address}
                  <br />
                  {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                </span>
              </div>
              <a href={BUSINESS.phoneHref} className={`${contactRow} hover:text-fg`}>
                <Phone className={icon} />
                {BUSINESS.phone}
              </a>
              <a href={BUSINESS.smsHref} className={`${contactRow} hover:text-fg`}>
                <MessageSquareText className={icon} />
                Text us anytime
              </a>
              <a href={`mailto:${BUSINESS.email}`} className={`${contactRow} break-all hover:text-fg`}>
                <Mail className={icon} />
                {BUSINESS.email}
              </a>
            </div>
            <div>
              <h3 className="label-tech text-accent">Business Hours</h3>
              <div className={`${contactRow} mt-2`}>
                <Clock className={icon} />
                <div>
                  <div>{BUSINESS.hours.open}</div>
                  <div className="mt-1 font-semibold text-fg">{BUSINESS.hours.emergency}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: the link columns. The phone menu button links here without JavaScript. */}
        <nav id="footer-nav" aria-label="Footer" className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <LinkColumn
            id="footer-explore"
            title="Quick Links"
            links={quickLinks}
            className="lg:col-span-5"
            listClassName="grid grid-cols-2 gap-x-6"
          />
          <LinkColumn
            id="footer-services"
            title="Our Services"
            links={footerServices}
            className="lg:col-span-4"
            listClassName="grid grid-cols-2 gap-x-6 lg:grid-cols-1"
          />
          <div className="lg:col-span-3">
            <LinkColumn
              id="footer-areas"
              title="Service Areas"
              links={footerAreas}
              listClassName="grid grid-cols-2 gap-x-6 lg:grid-cols-1"
            />
            <p className="mt-3 text-[0.9375rem] text-muted">&amp; more</p>
          </div>
        </nav>

        {/* Row 3: license, legal pages, the parent company, copyright */}
        <div className="mt-14 border-t border-rule py-6 text-sm text-muted lg:mt-20">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {BUSINESS.fullName}. All rights reserved.{" "}
              <span className="whitespace-nowrap">
                FL Licensed:{" "}
                <a
                  href={BUSINESS.licenseLookupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-my-3 inline-block py-3 font-semibold text-body underline decoration-brass underline-offset-[0.25em] hover:text-fg"
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
                  <Link href={link.href} className="inline-flex min-h-11 items-center hover:text-fg hover:underline underline-offset-[0.25em]">
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
              className="-my-3 inline-block py-3 hover:text-fg hover:underline underline-offset-[0.25em]"
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
