import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "C&S Plumbing of Lee County | Southwest Florida's Most Trusted Plumber",
    template: "%s | C&S Plumbing of Lee County",
  },
  description:
    "Family-owned since 1997. 8,500+ homes built. 24/7 emergency service. Residential, commercial & new construction plumbing across Cape Coral, Fort Myers, Naples & all of SWFL.",
  keywords: [
    "plumber",
    "plumbing",
    "Cape Coral plumber",
    "Fort Myers plumber",
    "SWFL plumber",
    "emergency plumbing",
    "new construction plumbing",
    "C&S Plumbing",
    "Lee County plumber",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://csplumbinglee.com",
    siteName: "C&S Plumbing of Lee County",
    title: "C&S Plumbing of Lee County | Southwest Florida's Most Trusted Plumber",
    description:
      "Family-owned since 1997. 8,500+ homes built. 24/7 emergency service across SWFL.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
