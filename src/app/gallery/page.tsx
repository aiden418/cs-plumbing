import type { Metadata } from "next";
import GalleryPage from "./GalleryPage";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Browse C&S Plumbing's portfolio of residential, commercial & new construction plumbing projects across Cape Coral, Fort Myers & Southwest Florida. 8,500+ homes completed.",
  keywords: [
    "plumbing projects Cape Coral",
    "plumber portfolio Fort Myers",
    "new construction plumbing SWFL",
    "bathroom remodel plumbing",
    "plumbing gallery Lee County",
  ],
  openGraph: {
    title: "Our Work | C&S Plumbing Project Gallery",
    description:
      "See our residential, commercial & new construction plumbing work across Southwest Florida.",
    url: "https://www.csplumbinglee.com/gallery",
  },
};

export default function Page() {
  return <GalleryPage />;
}
