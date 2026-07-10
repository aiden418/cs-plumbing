import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "C&S Plumbing of Lee",
    short_name: "C&S Plumbing",
    description:
      "Family-owned plumbing contractor serving Southwest Florida since 1998. New construction, remodel & 24/7 emergency service.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#1B2B4B",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }],
  };
}
