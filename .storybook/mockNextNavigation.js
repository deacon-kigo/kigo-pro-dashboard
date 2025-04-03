// Mock next/navigation for Storybook
// This file should be imported in preview.js

// Create a safe pathname getter
const getPathname = () => {
  if (typeof window !== 'undefined') {
    return window.__NEXT_MOCK_PATHNAME || '/dashboard';
  }
  return '/dashboard';
};

// Mock the usePathname hook
export const usePathname = () => getPathname();

// Mock the useRouter hook
export const useRouter = () => ({
  pathname: getPathname(),
  asPath: getPathname(),
  query: {},
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  back: () => {}
});

// Set up module mocking - this will be used by preview.js
export const setupNextNavigationMocks = () => {
  if (typeof window !== 'undefined') {
    // Create a safe reference
    window.__NEXT_MOCK_PATHNAME = window.__NEXT_MOCK_PATHNAME || '/dashboard';
    
    // Expose our mocks on the window for direct access
    window.usePathname = usePathname;
    window.useRouter = useRouter;
  }
}; 