import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.unrealengine.com",
      },
      {
        protocol: "https",
        hostname: "www.fortnite.com",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.unrealengine.com",
      },
      {
        protocol: "https",
        hostname: "shared.fastly.steamstatic.com",
      },
    ],
  },
};

export default nextConfig;
