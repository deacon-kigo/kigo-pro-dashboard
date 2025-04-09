// Configuration for Storybook
const config = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async (config) => {
    // Add any custom webpack configurations here
    
    // Add CSS and PostCSS support
    const cssRule = config.module.rules.find(
      rule => rule.test && rule.test.toString().includes('css')
    );
    
    if (cssRule) {
      // Ensure we have the postcss-loader configured
      const hasPostCSSLoader = cssRule.use.some(
        use => use.loader && use.loader.includes('postcss-loader')
      );
      
      if (!hasPostCSSLoader) {
        cssRule.use.push({
          loader: 'postcss-loader',
          options: {
            implementation: 'postcss',
          },
        });
      }
    }
    
    // Alias next/navigation to our mock implementation
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config.resolve.alias['next/navigation'] = require.resolve('./mockNextNavigation.js');
    
    return config;
  }
};

module.exports = config;
