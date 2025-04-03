const config = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../app/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-styling",
      options: {},
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // Find the CSS rule
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes("css")
    );

    // If we find a CSS rule, ensure it's not expecting modules
    if (cssRule) {
      cssRule.exclude = /\.module\.css$/;
    }

    // Explicitly add the rule for CSS Modules
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
        "postcss-loader",
      ],
    });

    return config;
  },
};

export default config;
