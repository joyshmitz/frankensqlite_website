import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

const config = process.env.ANALYZE === "true"
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
