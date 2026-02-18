import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BlogIndexPage from "./BlogIndexPage";

export const metadata: Metadata = {
  title: "Plumbing Tips & Blog",
  description:
    "Expert plumbing tips, guides & advice from C&S Plumbing of Lee County. Learn about repiping, water heaters, emergency plumbing, and more for Southwest Florida homes.",
  keywords: [
    "plumbing tips",
    "plumbing blog",
    "plumbing advice Cape Coral",
    "plumbing guide Fort Myers",
    "home plumbing tips SWFL",
  ],
  openGraph: {
    title: "Plumbing Tips & Blog | C&S Plumbing",
    description:
      "Expert plumbing tips and guides for Southwest Florida homeowners.",
    url: "https://www.csplumbinglee.com/blog",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <BlogIndexPage />
    </PageTransition>
  );
}
