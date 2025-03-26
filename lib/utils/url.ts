/**
 * URL utilities for the application
 */

/**
 * Builds a URL for a demo scenario
 * @param clientId The client ID (e.g., 'cvs', 'deacons', etc.)
 * @param scenario The scenario name (e.g., 'dashboard', 'token-management', etc.)
 * @returns The URL for the demo scenario
 */
export const buildDemoUrl = (clientId: string, scenario: string): string => {
  return `/demos/${clientId}-${scenario}`;
}; 