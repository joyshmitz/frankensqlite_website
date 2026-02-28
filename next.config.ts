import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  turbopack: {
    root: projectRoot,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

const config = process.env.ANALYZE === "true"
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
