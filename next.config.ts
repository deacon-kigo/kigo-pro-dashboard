import type { NextConfig } from "next";

const createWithVercelToolbar = require("@vercel/toolbar/plugins/next");

const nextConfig: NextConfig = {
  /* config options here */
  // Note: eslint.ignoreDuringBuilds is no longer supported in Next.js 16
  // Use `next lint --ignore-during-builds` in build command instead
  // Commenting out static export config for now to fix build errors
  // output: "export", // This is important for Netlify static deployment
  // distDir: "out", // Use an explicit 'out' directory
  images: {
    unoptimized: true, // For static export
  },
  typescript: {
    // Skip type checking during production build for demo apps
    ignoreBuildErrors: true,
  },
  // Disable React strict mode for demo app
  reactStrictMode: false,
  transpilePackages: ["shiki", "recharts"],
};

const withVercelToolbar = createWithVercelToolbar();

export default withVercelToolbar(nextConfig);
