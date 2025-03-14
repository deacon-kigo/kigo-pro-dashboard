import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'export', // This is important for Netlify static deployment
  distDir: 'out', // Use an explicit 'out' directory
  images: {
    unoptimized: true, // For static export
  },
};

export default nextConfig;
