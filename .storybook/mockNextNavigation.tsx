/**
 * Mock Next.js Navigation for Storybook
 * 
 * This file provides utilities for mocking Next.js navigation hooks in Storybook stories.
 */
import React, { createContext, useContext } from 'react';

// Create context for mocked navigation
export const NavigationContext = createContext<{
  pathname: string;
}>({
  pathname: '/'
});

// Create custom hook to use the mocked pathname
export const usePathname = () => {
  const context = useContext(NavigationContext);
  return context.pathname;
};

// Export the hook to be used globally
if (typeof window !== 'undefined') {
  window.usePathname = usePathname;
}

// Navigation provider component
export const MockNavigationProvider: React.FC<{
  children: React.ReactNode;
  pathname?: string;
}> = ({ children, pathname = '/' }) => {
  // Make the pathname available globally for components that directly import usePathname
  if (typeof window !== 'undefined') {
    window.__NEXT_MOCK_PATHNAME = pathname;
  }
  
  return (
    <NavigationContext.Provider value={{ pathname }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Function to create a decorator for Storybook stories
export const withMockNavigation = (pathname = '/') => (Story: React.ComponentType) => (
  <MockNavigationProvider pathname={pathname}>
    <Story />
  </MockNavigationProvider>
);

// Add TypeScript declaration
declare global {
  interface Window {
    __NEXT_MOCK_PATHNAME?: string;
    usePathname?: () => string;
  }
}

export default MockNavigationProvider; 