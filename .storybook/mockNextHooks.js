/**
 * Mocks for Next.js hooks in Storybook
 *
 * This file mocks Next.js navigation hooks for use in Storybook.
 * It should be imported in preview.js to ensure all stories have
 * access to these mocks.
 */

// Mock hooks from next/navigation
// This file provides mock implementations for Next.js hooks
// that can't be used outside of a Next.js app

/**
 * Mock for the usePathname hook from next/navigation
 * @returns {string} The pathname
 */
export const usePathname = () => {
  if (typeof window !== "undefined") {
    return window.__NEXT_MOCK_PATHNAME || "/dashboard";
  }
  return "/dashboard";
};

/**
 * Mock for the useSearchParams hook from next/navigation
 * @returns {Object} A simple URLSearchParams-like object
 */
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

/**
 * Mock for the useRouter hook from next/navigation
 * @returns {Object} A simple router-like object
 */
export const useRouter = () => {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
};

/**
 * Initialize the mock hooks on the window object
 */
export const setupNextHooksMocks = () => {
  if (typeof window !== "undefined") {
    window.usePathname = usePathname;
    window.useSearchParams = useSearchParams;
    window.useRouter = useRouter;
  }
};

// Add TypeScript declaration
if (typeof window !== "undefined") {
  window.__NEXT_MOCK_PATHNAME = window.__NEXT_MOCK_PATHNAME || "/dashboard";
}
