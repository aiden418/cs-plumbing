import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.csplumbinglee.com"),
  title: {
    default: "C&S Plumbing of Lee County | Southwest Florida's Most Trusted Plumber",
    template: "%s | C&S Plumbing of Lee County",
  },
  description:
    "Family-owned since 1997. 8,500+ homes built. 24/7 emergency service. Residential, commercial & new construction plumbing across Cape Coral, Fort Myers, North Fort Myers, Naples & all of SWFL.",
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
    siteName: "C&S Plumbing of Lee County",
    title: "C&S Plumbing of Lee County | Southwest Florida's Most Trusted Plumber",
    description:
      "Family-owned since 1997. 8,500+ homes built. 24/7 emergency service across Cape Coral, Fort Myers & SWFL.",
    images: [
      {
        url: "/images/logos/logo.png",
        width: 755,
        height: 577,
        alt: "C&S Plumbing of Lee County Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C&S Plumbing of Lee County | Southwest Florida's Most Trusted Plumber",
    description:
      "Family-owned since 1997. 8,500+ homes built. 24/7 emergency service across SWFL.",
    images: ["/images/logos/logo.png"],
  },
  alternates: {
    canonical: "https://www.csplumbinglee.com",
  },
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
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
