import type { Metadata } from "next";
import ContactPage from "./ContactPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Us",
  description:
    "Contact C&S Plumbing of Lee for a free estimate. Serving Cape Coral, Fort Myers, North Fort Myers, Naples & all of Southwest Florida. Call 833-PLUMB-IT or fill out our online form.",
  keywords: [
    "contact plumber Cape Coral",
    "plumbing estimate Fort Myers",
    "plumber near me SWFL",
    "plumbing quote Lee County",
    "C&S Plumbing contact",
  ],
  openGraph: {
    title: "Contact C&S Plumbing | Cape Coral & Fort Myers",
    description:
      "Get a free plumbing estimate. Serving Cape Coral, Fort Myers, North Fort Myers & all of SWFL since 1998.",
    url: "https://www.csplumbinglee.com/contact",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <ContactPage />
    </>
  );
}
