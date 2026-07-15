import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${BUSINESS.fullName}. Learn how we collect, use, and protect your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <PageHero size="sm" overline="Legal" title="Privacy Policy" />
      <section className="pt-10 sm:pt-14 pb-16 sm:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-600 space-y-6">
              <p>
                <strong>Last updated:</strong> March 10, 2026
              </p>

              <p>
                {BUSINESS.fullName} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you visit our website or use our
                services.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
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

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your service inquiries and schedule appointments.</li>
                <li>To provide, maintain, and improve our plumbing services.</li>
                <li>To send service confirmations and follow-up communications.</li>
                <li>To comply with legal obligations.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third
                parties. We may share information with trusted service providers
                who assist us in operating our website or conducting our
                business, as long as those parties agree to keep this
                information confidential.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect your
                personal information. However, no method of electronic
                transmission or storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Cookies
              </h2>
              <p>
                Our website may use cookies and similar technologies to enhance
                your browsing experience and analyze site traffic. You can
                control cookie settings through your browser preferences.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal information by contacting us at{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.email}
                </a>{" "}
                or calling{" "}
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.phone}
                </a>
                .
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated revision date.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
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
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.phone}
                </a>
                <br />
                Email:{" "}
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-primary hover:underline"
                >
                  {BUSINESS.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
