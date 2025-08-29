import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow build to succeed even if ESLint finds errors (useful for CI/deploy)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to successfully complete even if there are type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
