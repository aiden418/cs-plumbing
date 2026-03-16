import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${BUSINESS.fullName}. Review the terms and conditions governing use of our website and plumbing services.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <PageTransition>
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>
            <div className="prose prose-gray max-w-none text-sm sm:text-base text-gray-600 space-y-6">
              <p>
                <strong>Last updated:</strong> March 10, 2026
              </p>

              <p>
                These Terms of Service govern your use of the {BUSINESS.fullName}{" "}
                website and our plumbing services. By using our website or
                requesting our services, you agree to these terms.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Services
              </h2>
              <p>
                {BUSINESS.fullName} provides residential and commercial plumbing
                services across Southwest Florida. All work is performed by
                licensed and insured plumbers under Florida Certified Plumbing
                Contractor License #{BUSINESS.license}.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Estimates & Pricing
              </h2>
              <p>
                We provide free estimates for most plumbing services. Estimates
                are based on the information available at the time of assessment
                and may be adjusted if additional work is discovered during the
                project. We will communicate any changes in scope or pricing
                before proceeding.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Scheduling & Cancellation
              </h2>
              <p>
                Appointments can be scheduled through our website, by phone, or
                via email. We ask for at least 24 hours&apos; notice for
                cancellations. Emergency service is available 24/7 and may be
                subject to after-hours rates.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Warranties & Guarantees
              </h2>
              <p>
                We stand behind our work with a satisfaction guarantee. Specific
                warranty terms vary by service type and will be provided at the
                time of service. Manufacturer warranties on parts and equipment
                are separate from our workmanship guarantee.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Liability
              </h2>
              <p>
                {BUSINESS.fullName} carries full liability insurance and
                workers&apos; compensation coverage. Our liability is limited to
                the scope of work agreed upon. We are not responsible for
                pre-existing conditions not identified during our assessment.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Website Use
              </h2>
              <p>
                The content on our website is provided for informational
                purposes. While we strive for accuracy, plumbing situations vary
                and online information should not be considered a substitute for
                professional assessment. Do not attempt plumbing repairs beyond
                your skill level based on general information.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Intellectual Property
              </h2>
              <p>
                All content on this website, including text, images, logos, and
                design, is the property of {BUSINESS.fullName} and is protected
                by copyright law. You may not reproduce, distribute, or use our
                content without written permission.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Changes to Terms
              </h2>
              <p>
                We reserve the right to update these Terms of Service at any
                time. Changes take effect immediately upon posting to our
                website.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
                Contact Us
              </h2>
              <p>
                For questions about these terms, contact us at:
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
