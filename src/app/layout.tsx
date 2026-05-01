import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import DeferredWidgets from "@/components/layout/DeferredWidgets";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.csplumbinglee.com"),
  title: {
    default: "C&S Plumbing of Lee | Southwest Florida's Most Trusted Plumber",
    template: "%s | C&S Plumbing of Lee",
  },
  description:
    "Family-owned since 1998. 8,500+ homes built. 24/7 emergency service. Residential, commercial & new construction plumbing across Cape Coral, Fort Myers, North Fort Myers, Naples & all of SWFL.",
  keywords: [
    "plumber",
    "plumbing",
    "Cape Coral plumber",
    "Fort Myers plumber",
    "North Fort Myers plumber",
    "SWFL plumber",
    "emergency plumbing",
    "emergency plumber Cape Coral",
    "24/7 plumber Fort Myers",
    "new construction plumbing",
    "C&S Plumbing",
    "Lee County plumber",
    "plumber near me",
    "Bonita Springs plumber",
    "Naples plumber",
    "Lehigh Acres plumber",
    "drain cleaning Cape Coral",
    "water heater Fort Myers",
    "repiping Cape Coral",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.csplumbinglee.com",
    siteName: "C&S Plumbing of Lee",
    title: "C&S Plumbing of Lee | Southwest Florida's Most Trusted Plumber",
    description:
      "Family-owned since 1998. 8,500+ homes built. 24/7 emergency service across Cape Coral, Fort Myers & SWFL.",
    images: [
      {
        url: "/images/logos/logo-new.png",
        width: 755,
        height: 577,
        alt: "C&S Plumbing of Lee Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C&S Plumbing of Lee | Southwest Florida's Most Trusted Plumber",
    description:
      "Family-owned since 1998. 8,500+ homes built. 24/7 emergency service across SWFL.",
    images: ["/images/logos/logo-new.png"],
  },
  alternates: {},
  verification: {
    google: "Tkfv2F8qi0w2tmYdz3YBu9WI6QaR9NeDnMmIukJjjiI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="min-h-screen">{children}</main>
        <Footer />
        <StickyMobileCTA />
        <DeferredWidgets />
      </body>
    </html>
  );
}
