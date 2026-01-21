import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // pdfjs-dist用の設定のみ残す
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
