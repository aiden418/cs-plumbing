import type { Metadata } from "next";
import BookingPage from "./BookingPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/booking" },
  title: "Book a Service",
  description:
    "Schedule your plumbing appointment online with C&S Plumbing of Lee County. Emergency, residential, commercial & new construction plumbing across Cape Coral, Fort Myers & SWFL.",
  keywords: [
    "book plumber Cape Coral",
    "schedule plumbing Fort Myers",
    "plumbing appointment SWFL",
    "online plumbing booking Lee County",
    "plumber appointment near me",
  ],
  openGraph: {
    title: "Book a Plumber | C&S Plumbing of Lee County",
    description:
      "Book online in under 2 minutes. Emergency, residential & commercial plumbing across Southwest Florida.",
    url: "https://www.csplumbinglee.com/booking",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Book a Service", href: "/booking" }]} />
      <BookingPage />
    </>
  );
}
