// Mock next/navigation for Storybook
// This file should be imported in preview.js

// Create a safe pathname getter
const getPathname = () => {
  if (typeof window !== "undefined") {
    return window.__NEXT_MOCK_PATHNAME || "/dashboard";
  }
  return "/dashboard";
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
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
});

// Mock the useSearchParams hook
export const useSearchParams = () => {
  return {
    get: (key) => null,
    getAll: (key) => [],
    has: (key) => false,
    forEach: () => {},
    entries: () => [],
    keys: () => [],
    values: () => [],
    toString: () => "",
    size: 0,
    [Symbol.iterator]: function () {
      let done = false;
      return {
        next: () => {
          if (!done) {
            done = true;
            return { done: false, value: ["", ""] };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
};

// Mock additional hooks
export const useParams = () => ({});
export const redirect = () => {};
export const notFound = () => {};

// Set up module mocking - this will be used by preview.js
export const setupNextNavigationMocks = () => {
  if (typeof window !== "undefined") {
    // Create a safe reference
    window.__NEXT_MOCK_PATHNAME = window.__NEXT_MOCK_PATHNAME || "/dashboard";

    // Expose our mocks on the window for direct access
    window.usePathname = usePathname;
    window.useRouter = useRouter;
    window.useSearchParams = useSearchParams;
    window.useParams = useParams;
  }
};
