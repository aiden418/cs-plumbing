import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 70, 75, 80, 85],
  },
  compress: true,
  async redirects() {
    return [
      // Flat service-city page folded into the builder city hub.
      {
        source: "/new-construction-plumbing-cape-coral",
        destination: "/new-construction-plumbing/cape-coral",
        permanent: true,
      },
      // No index page for the city hub — /builders lists every city.
      { source: "/new-construction-plumbing", destination: "/builders", permanent: false },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;
