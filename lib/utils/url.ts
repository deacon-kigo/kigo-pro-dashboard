/**
 * URL utilities for the application
 */

/**
 * Build a URL for a demo page with client and scenario parameters
 */
export const buildDemoUrl = (client: string, scenario: string, additionalParams?: Record<string, string>): string => {
  // Start with the base path for the demo
  const basePath = `/demos/${client}-${scenario}`;
  
  // If there are no additional params, return just the path
  if (!additionalParams || Object.keys(additionalParams).length === 0) {
    return basePath;
  }
  
  // Build the query string with additional parameters
  const queryParams = new URLSearchParams();
  
  Object.entries(additionalParams).forEach(([key, value]) => {
    queryParams.append(key, value);
  });
  
  return `${basePath}?${queryParams.toString()}`;
}; 