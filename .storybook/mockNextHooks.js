/**
 * Mocks for Next.js hooks in Storybook
 * 
 * This file mocks Next.js navigation hooks for use in Storybook.
 * It should be imported in preview.js to ensure all stories have
 * access to these mocks.
 */

// Mock the navigation hooks from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
})); 