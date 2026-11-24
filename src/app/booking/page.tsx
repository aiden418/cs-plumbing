import type { Metadata } from "next";
import BookingPage from "./BookingPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { BOOKING } from "@/content/conversion";
import NextSteps from "../contact/_parts/NextSteps";

export const metadata: Metadata = {
  alternates: { canonical: "/booking" },
  title: "Request Service",
  description:
    "Request plumbing service online and ask for a preferred time. Our office calls to confirm. Homes and businesses in Cape Coral, Fort Myers & SWFL.",
  keywords: [
    "book plumber Cape Coral",
    "schedule plumbing Fort Myers",
    "plumbing appointment SWFL",
    "online plumbing booking Lee County",
    "plumber appointment near me",
  ],
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "Request Plumbing Service | C&S Plumbing of Lee",
    description:
      "Request service online in under 2 minutes; our office calls to confirm. Residential & commercial plumbing across Southwest Florida.",
    url: "https://www.csplumbinglee.com/booking",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Request Service", href: "/booking" }]} />
      <BookingPage />
      <NextSteps id="booking-next" heading={BOOKING.nextHeading} steps={BOOKING.nextSteps} tone="white" />
    </>
  );
}
