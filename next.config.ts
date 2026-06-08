import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8085",
        pathname: "/api/v1/files/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;