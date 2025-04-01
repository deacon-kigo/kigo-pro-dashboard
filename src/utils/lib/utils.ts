import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging class names with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a standardized URL for demo pages
 * @param clientId - The client identifier (e.g., 'cvs', 'deacons')
 * @param scenario - The scenario identifier (e.g., 'dashboard', 'token-management')
 * @param version - Optional version identifier (defaults to 'current')
 * @returns Formatted URL string
 */
export function buildDemoUrl(clientId: string, scenario: string, version: string = 'current'): string {
  // Create URL in format /demos/clientId-scenario to match existing folder structure
  const baseUrl = `/demos/${clientId}-${scenario}`;
  
  console.log(`buildDemoUrl: Building URL for clientId=${clientId}, scenario=${scenario} => ${baseUrl}`);
  
  return version !== 'current' ? `${baseUrl}/${version}` : baseUrl;
}

/**
 * Parses a demo URL to extract components
 * @param url - The URL to parse
 * @returns Object containing clientId, scenario, and version, or null if not a valid demo URL
 */
export function parseDemoUrl(url: string): { clientId: string; scenario: string; version: string } | null {
  // Extract clientId-scenario and version from the URL
  const regex = /\/demos\/([^\/]+)-([^\/]+)(?:\/([^\/]+))?/;
  const match = url.match(regex);
  
  if (!match) return null;
  
  return {
    clientId: match[1],
    scenario: match[2],
    version: match[3] || 'current'
  };
}

/**
 * Checks if a given path matches the current pathname (for active link detection)
 * @param pathname - The current pathname from usePathname()
 * @param path - The path to check against
 * @returns Boolean indicating if the path matches
 */
export function isPathActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
} 