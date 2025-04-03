import '../app/globals.css';
import React from 'react';

/**
 * TypeScript type declarations for the window properties
 * 
 * declare global {
 *   interface Window {
 *     __NEXT_MOCK_PATHNAME?: string;
 *   }
 * }
 */

// Register viewports for responsive testing
const customViewports = {
  mobile1: {
    name: 'Small Mobile',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  mobile2: {
    name: 'Large Mobile',
    styles: {
      width: '414px',
      height: '896px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  largeDesktop: {
    name: 'Large Desktop',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
};

// Add a notice if a component uses Redux but doesn't have the proper mocks in Storybook
const ReduxComponentMessage = () => (
  <div
    style={{
      padding: '20px',
      margin: '20px 0',
      borderRadius: '4px',
      backgroundColor: '#FEF6E4',
      border: '1px solid #F7C948',
    }}
  >
    <h3 style={{ margin: '0 0 10px', color: '#8C6D1F' }}>⚠️ Redux Component</h3>
    <p style={{ margin: '0', color: '#8C6D1F' }}>
      This component uses Redux for state management. In Storybook, the component is rendered with mock data for display purposes only.
      Some interactive functionality may not work without proper Redux context.
    </p>
  </div>
);

// Simple mock for next/navigation pathname
if (typeof window !== 'undefined') {
  // Default pathname for Storybook stories
  window.__NEXT_MOCK_PATHNAME = '/';
}

// Global decorator for mocking Redux hooks
const withMockReduxHooks = (Story, context) => {
  // Check if this story has mockData parameter
  const hasMockData = context.parameters.mockData !== undefined;
  
  // Update pathname if provided in story parameters
  if (typeof window !== 'undefined' && context.parameters.pathname) {
    window.__NEXT_MOCK_PATHNAME = context.parameters.pathname;
  }
  
  return (
    <>
      {hasMockData && <ReduxComponentMessage />}
      <Story />
    </>
  );
};

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: { 
      viewports: customViewports,
      defaultViewport: 'desktop' 
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
        {
          name: 'kigo-stone',
          value: '#f6f5f1',
        },
      ],
    },
  },
  // Apply the mock context decorator to all stories
  decorators: [withMockReduxHooks],
};

export default preview;
