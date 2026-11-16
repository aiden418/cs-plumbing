import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import DeferredWidgets from "@/components/layout/DeferredWidgets";
import JsonLd from "@/components/seo/JsonLd";
import MetaPixel from "@/components/analytics/MetaPixel";
import OpenAIPixel from "@/components/analytics/OpenAIPixel";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import RevealObserver from "@/components/ui/RevealObserver";

// Font budget: at most 100 KB of fonts preloaded. Archivo (the display face,
// with its width axis) is the one preloaded file. Its fallback metrics are
// hand-tuned in globals.css ("Archivo Fallback", measured by
// scripts/fonts/measure-fallback.mjs), so Next's automatic fallback is off.
// Turbopack in Next 16.4 ignores `adjustFontFallback: false` for Google fonts
// and still writes its own "Archivo Fallback"; naming our family in `fallback`
// is what actually stops it, and puts the family right after Archivo.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  fallback: ["Archivo Fallback"],
  adjustFontFallback: false,
});

// Reading face. Not preloaded: Next's metric-matched "Inter Fallback" holds
// the layout until it arrives.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Only the printed builder documents and the Terms still use Montserrat
// (.print-doc / .terms-doc in globals.css). Not preloaded, so no other page
// downloads it.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  // 800 dropped — nothing uses extrabold; one fewer font file on first load
  weight: ["700", "900"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0A1730",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.csplumbinglee.com"),
  title: {
    default: "C&S Plumbing of Lee | Southwest Florida's Most Trusted Plumber",
    template: "%s | C&S Plumbing of Lee",
  },
  description:
    "Family owned and operated since 1998, 9,500+ homes plumbed. New construction plumbing for builders and GCs, plus residential and commercial service across Cape Coral, Fort Myers, North Fort Myers, Naples & all of SWFL.",
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
      "Family owned and operated since 1998, 9,500+ homes plumbed. New construction for builders; service, repipes and remodels for homeowners across Cape Coral, Fort Myers & SWFL.",
    images: [
      {
        url: "/images/logos/logo-512.png",
        width: 512,
        height: 512,
        alt: "C&S Plumbing of Lee Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C&S Plumbing of Lee | Southwest Florida's Most Trusted Plumber",
    description:
      "Family owned and operated since 1998, 9,500+ homes plumbed. New construction for builders; service for homeowners across SWFL.",
    images: ["/images/logos/logo-512.png"],
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
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${montserrat.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to content
        </a>
        <Navbar />
        <SmoothScrollProvider>
          <main id="main" className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <StickyMobileCTA />
        <RevealObserver />
        <DeferredWidgets />
        <MetaPixel />
        <OpenAIPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
