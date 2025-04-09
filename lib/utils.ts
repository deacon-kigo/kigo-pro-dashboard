import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a demo URL based on client and page
 */
export function buildDemoUrl(client: string, page: string): string {
  return `/demos/${client}/${page}`;
}

/**
 * Checks if a given path is active based on the current pathname
 */
export function isPathActive(pathname: string | null, path: string): boolean {
  if (!pathname) return false;

  // Handle root path
  if (path === "/" && pathname === "/") return true;

  // Handle exact match
  if (pathname === path) return true;

  // Handle subpaths
  if (path !== "/" && pathname.startsWith(path)) {
    // Check if it's truly a subpath and not just a string prefix match
    const nextChar = pathname.charAt(path.length);
    if (nextChar === "" || nextChar === "/") {
      return true;
    }
  }

  return false;
}
