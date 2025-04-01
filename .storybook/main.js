// Placeholder for Storybook main config
const config = {
  stories: [
    // Temporarily commenting out src paths to avoid duplicate story IDs
    // '../src/**/*.mdx',
    // '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.mdx'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      fastRefresh: true,
      strictMode: false
    },
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};

export default config;
