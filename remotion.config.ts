import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";
import path from "path";

Config.overrideWebpackConfig((config) => {
  config = enableTailwind(config);

  const projectRoot = process.cwd();

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      // Match Next.js tsconfig path alias (@/* -> ./*)
      "@": projectRoot,
      // Next.js shims for Remotion's webpack bundler
      "next/image": path.resolve(projectRoot, "remotion/shims/next-image.tsx"),
      "next/link": path.resolve(projectRoot, "remotion/shims/next-link.tsx"),
      "next/navigation": path.resolve(
        projectRoot,
        "remotion/shims/next-navigation.ts"
      ),
      "next/headers": path.resolve(
        projectRoot,
        "remotion/shims/next-headers.ts"
      ),
    },
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ...(config.resolve?.extensions || []),
    ],
  };

  // Patch css-loader: disable url() resolution to prevent
  // Tailwind bg-[url(...)] from breaking the build when referencing
  // Next.js public/ assets that css-loader can't resolve
  const rules = config.module?.rules as any[];
  for (const rule of rules) {
    if (!rule?.test?.toString().includes("css")) continue;
    if (!Array.isArray(rule.use)) continue;
    for (let i = 0; i < rule.use.length; i++) {
      const loader = rule.use[i];
      const loaderPath = typeof loader === "string" ? loader : loader?.loader;
      if (
        typeof loaderPath === "string" &&
        loaderPath.includes("css-loader") &&
        !loaderPath.includes("postcss")
      ) {
        // Replace the string loader with an object that has url:false
        rule.use[i] = {
          loader: loaderPath,
          options: { url: false },
        };
      }
    }
  }

  return config;
});

Config.setChromiumOpenGlRenderer("angle");
