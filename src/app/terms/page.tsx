import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import TermsDocument from "@/components/terms/TermsDocument";
import { BUSINESS } from "@/lib/constants";
import { TERMS_PATH, TERMS_URL } from "@/lib/terms-meta";

const TITLE = "Terms & Conditions";
const DESCRIPTION = `Terms and conditions for estimates, proposals, invoices and plumbing work by ${BUSINESS.fullName}: pricing, change orders, payment and warranty.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: TERMS_PATH },
  openGraph: { siteName: "C&S Plumbing of Lee", title: TITLE, description: DESCRIPTION, url: TERMS_URL, type: "website" },
};

const BREADCRUMB = [
  { name: "Home", href: "/" },
  { name: TITLE, href: TERMS_PATH },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={BREADCRUMB} />
      <PageHero
        size="sm"
        overline="Legal"
        title={TITLE}
        description={`The terms that govern every estimate, proposal, and invoice from ${BUSINESS.fullName}.`}
        breadcrumb={BREADCRUMB}
      />
      <section className="pt-10 sm:pt-14 pb-16 sm:pb-24">
        <Container>
          <TermsDocument />
        </Container>
      </section>
    </>
  );
}
