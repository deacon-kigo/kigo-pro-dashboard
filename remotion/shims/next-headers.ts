/**
 * Shim for next/headers inside Remotion's webpack bundler.
 */

export function cookies() {
  return {
    get: () => undefined,
    getAll: () => [],
    has: () => false,
    set: () => {},
    delete: () => {},
  };
}

export function headers() {
  return new Headers();
}
