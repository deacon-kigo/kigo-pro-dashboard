/**
 * Shim for next/navigation inside Remotion's webpack bundler.
 * Provides no-op implementations of Next.js navigation hooks.
 */

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams() {
  return {};
}

export function useSelectedLayoutSegment() {
  return null;
}

export function useSelectedLayoutSegments() {
  return [];
}

export function redirect() {
  // no-op in Remotion
}

export function notFound() {
  // no-op in Remotion
}
