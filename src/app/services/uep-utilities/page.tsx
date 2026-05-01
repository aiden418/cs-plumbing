import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import UEPServicePage from "./UEPServicePage";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { SERVICE_LANDINGS } from "@/lib/constants";

const landing = SERVICE_LANDINGS.find((s) => s.slug === "uep-utilities")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
  alternates: { canonical: "/services/uep-utilities" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/uep-utilities",
    type: "website",
    siteName: "C&S Plumbing of Lee",
    images: [
      {
        url: "/images/services/uep-utilities/photo-1.jpg",
        width: 1200,
        height: 900,
        alt: "UEP utilities hookup — irrigation and water service line installation in Cape Coral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: landing.metaTitle,
    description: landing.metaDescription,
    images: ["/images/services/uep-utilities/photo-1.jpg"],
  },
};

function ServiceJsonLd() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "UEP Utilities Hookup",
    description: landing.description,
    url: "https://www.csplumbinglee.com/services/uep-utilities",
    provider: {
      "@type": "Plumber",
      "@id": "https://www.csplumbinglee.com/#organization",
      name: "C&S Plumbing of Lee",
      telephone: "+18337562648",
    },
    areaServed: {
      "@type": "City",
      name: "Cape Coral",
      containedInPlace: { "@type": "State", name: "Florida" },
    },
    serviceType: "UEP Utilities Connection",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "UEP Utilities Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Water Service Line Installation",
            description:
              "Install water service line from city meter to home, including trenching, connection, and pressure testing.",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "13-15",
            priceCurrency: "USD",
            unitText: "per foot",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Irrigation Line Installation",
            description:
              "Separate irrigation meter connection with proper backflow prevention.",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "9-10",
            priceCurrency: "USD",
            unitText: "per foot",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sewer Lateral Installation",
            description:
              "Connect home to city sewer main with proper grade, cleanouts, and full inspection.",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "25-33",
            priceCurrency: "USD",
            unitText: "per foot",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Septic Tank Abandonment & Pump-Out",
            description:
              "Full septic pump-out, tank collapse or fill, permitted abandonment with city inspection.",
          },
          price: "2500",
          priceCurrency: "USD",
        },
      ],
    },
    image: "https://www.csplumbinglee.com/images/services/uep-utilities/photo-1.jpg",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

export default function Page() {
  return (
    <PageTransition>
      <ServiceJsonLd />
      <FaqJsonLd faqs={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: landing.title, href: `/services/${landing.slug}` },
        ]}
      />
      <UEPServicePage landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
