import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact C&S Plumbing of Lee County for a free estimate. Serving Cape Coral, Fort Myers, North Fort Myers, Naples & all of Southwest Florida. Call 833-PLUMB-IT or fill out our online form.",
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
      "Get a free plumbing estimate. Serving Cape Coral, Fort Myers, North Fort Myers & all of SWFL since 1997.",
    url: "https://www.csplumbinglee.com/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
