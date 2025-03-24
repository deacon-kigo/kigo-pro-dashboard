/**
 * Type definitions for Token Management feature
 */

// Token state types
export type TokenState = 'Active' | 'Shared' | 'Used' | 'Expired';

// Token type definition
export type Token = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  state: TokenState;
  claimDate: string;
  useDate?: string; // Optional - only for used tokens
  shareDate?: string; // Optional - only for shared tokens
  expirationDate: string;
  merchantName?: string;
  merchantLocation?: string;
};

// Account type definition
export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  creationDate: string;
  tokens: Token[];
};

// Search types
export type SearchType = 'email' | 'name' | 'phone' | 'id'; 