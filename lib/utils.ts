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
 * Check if a path is active by comparing it with the current pathname
 * Works for exact matches or parent routes
 */
export function isPathActive(pathname: string, path: string) {
  // For root paths like '/' match exactly
  if (path === '/') {
    return pathname === path;
  }
  
  // For other paths, check if the current path starts with the given path
  return pathname && pathname.startsWith(path);
}
