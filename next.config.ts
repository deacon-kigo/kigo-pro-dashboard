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
  // Mark CopilotKit and pino as external packages (server-only, don't bundle)
  serverExternalPackages: [
    "@copilotkit/runtime",
    "pino",
    "pino-pretty",
    "thread-stream",
    "pino-abstract-transport",
  ],
  // Webpack configuration for client-side fallbacks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent Node.js modules from being bundled in client-side code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        worker_threads: false,
        pino: false,
        "pino-pretty": false,
        "thread-stream": false,
      };
    }
    return config;
  },
  // Turbopack configuration - empty object to acknowledge Turbopack usage
  turbopack: {},
};

const withVercelToolbar = createWithVercelToolbar();

export default withVercelToolbar(nextConfig);
