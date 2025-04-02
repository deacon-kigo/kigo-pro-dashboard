/**
 * Utility functions for token management
 * Shared functions used across components related to token management
 */

/**
 * Format date to readable format with time
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
         ' at ' + 
         date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

/**
 * Format date to short readable format
 */
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Create a new token ID
 */
export const generateTokenId = (): string => {
  return `TKN-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * Calculate expiration date (30 days from now)
 */
export const calculateExpirationDate = (): string => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
}; 