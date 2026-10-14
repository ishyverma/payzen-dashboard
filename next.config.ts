import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons", "motion", "recharts"],
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
