import '../app/globals.css';
import React from 'react';

// Create a mock provider context for stories
export const MockDemoContext = React.createContext({
  role: 'merchant',
  clientId: 'deacons',
  clientName: 'Deacon\'s Pizza',
  userProfile: {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Store Manager',
    email: 'john@example.com',
  },
  themeMode: 'light',
  version: 'current',
});

// Mock utility functions for use in stories
export const mockUtils = {
  getMockAvatarUrl: () => 'https://i.pravatar.cc/150?img=3',
  buildDemoUrl: (clientId, page) => `/${clientId}/${page}`
};

// Create a decorator that provides these contexts to all stories
const withMockProviders = (Story) => (
  <MockDemoContext.Provider value={{
    role: 'merchant',
    clientId: 'deacons',
    clientName: 'Deacon\'s Pizza',
    userProfile: {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Store Manager',
      email: 'john@example.com',
    },
    themeMode: 'light',
    version: 'current',
  }}>
    <Story />
  </MockDemoContext.Provider>
);

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: ['Kigo UI', ['Introduction', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages']],
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
  // Apply the mock providers decorator to all stories
  decorators: [withMockProviders],
};

export default preview;
