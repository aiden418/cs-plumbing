import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { PRIVACY } from "@/content/reading";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${BUSINESS.fullName}. Learn how we collect, use, and protect your personal information.`,
  alternates: { canonical: "/privacy-policy" },
  // A page-level block replaces the site-wide one whole, so the shared
  // fields (type, site name, locale, logo image) are repeated here.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BUSINESS.fullName,
    title: `Privacy Policy | ${BUSINESS.fullName}`,
    description: `Privacy policy for ${BUSINESS.fullName}. Learn how we collect, use, and protect your personal information.`,
    url: "https://www.csplumbinglee.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />
      <PageHero layout="plain" size="sm" overline={PRIVACY.overline} title={PRIVACY.title} />
      <Section tone="white" spacing="none" className="pt-6 pb-14 sm:pt-10 sm:pb-20">
        <Container>
          <div>
            {/* One reading column on phones, two from lg (reading.css). */}
            <div className="rich-text post-body legal-columns">
              <p>
                <strong>Last updated:</strong> November 16, 2026
              </p>

              <p>
                {BUSINESS.fullName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you visit our website or use our
                services.
              </p>

              <h2>
                Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Contact information</strong> you provide through our
                  booking and contact forms, including your name, email address,
                  phone number, and service address.
                </li>
                <li>
                  <strong>Service details</strong> such as your plumbing issue
                  description, preferred appointment times, and property
                  information.
                </li>
                <li>
                  <strong>Usage data</strong> collected automatically, including
                  IP address, browser type, pages visited, and time spent on our
                  site.
                </li>
              </ul>

              <h2>
                How We Use Your Information
              </h2>
              <ul>
                <li>To respond to your service inquiries and schedule appointments.</li>
                <li>To provide, maintain, and improve our plumbing services.</li>
                <li>To send service confirmations and follow-up communications.</li>
                <li>To comply with legal obligations.</li>
              </ul>

              <h2>
                Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third
                parties. We may share information with trusted service providers
                who assist us in operating our website or conducting our
                business, as long as those parties agree to keep this
                information confidential.
              </p>

              <h2>
                Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect your
                personal information. However, no method of electronic
                transmission or storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>

              <h2>
                Cookies
              </h2>
              <p>
                Our website may use cookies and similar technologies to enhance
                your browsing experience and analyze site traffic. You can
                control cookie settings through your browser preferences.
              </p>
              <p>
                We use a first-party cookie for up to 30 days to remember the most
                recent identifiable source of a website visit, including campaign
                tags, advertising click identifiers, the landing page and referring
                website. When you submit an enquiry, these details accompany the
                enquiry sent to our office and may be recorded with your service
                job so we can measure which advertising leads to completed work.
                Direct return visits do not extend this cookie’s lifetime. This
                source-tracking cookie is not set or used when your browser sends
                a Global Privacy Control signal.
              </p>

              <p>
                We also use HighLevel/LeadConnector to display a tracking phone
                number and connect website calls with their visit source. This
                service receives visit information, including page URLs, campaign
                parameters, referring pages and device information, and uses
                browser storage and identifier cookies that may last up to one
                year. When you call a tracking number, call details such as your
                phone number, call time and duration may be linked with this visit
                and your service enquiry. Website call tracking is not loaded
                when your browser sends a Global Privacy Control signal.
              </p>

              <h2>
                Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal information by contacting us at{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                 
                >
                  {BUSINESS.email}
                </a>{" "}
                or calling{" "}
                <a
                  href={BUSINESS.phoneHref}
                 
                >
                  {BUSINESS.phone}
                </a>
                .
              </p>

              <h2>
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated revision date.
              </p>

              <h2>
                Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, contact us at:
              </p>
              <p>
                {BUSINESS.fullName}
                <br />
                {BUSINESS.address}
                <br />
                {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                <br />
                Phone:{" "}
                <a
                  href={BUSINESS.phoneHref}
                 
                >
                  {BUSINESS.phone}
                </a>
                <br />
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                 
                >
                  {BUSINESS.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
