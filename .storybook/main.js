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
    '@storybook/addon-styling-webpack',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1 }
              },
              {
                loader: 'postcss-loader',
                options: {
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  implementation: require('postcss'),
                },
              },
            ],
          },
        ],
      },
    },
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
    
    // Alias next/navigation to our mock implementation
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config.resolve.alias['next/navigation'] = require.resolve('./mockNextNavigation.js');
    
    return config;
  }
};

export default config;
