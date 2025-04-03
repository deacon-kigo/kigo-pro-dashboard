'use client';

import React, { useState } from 'react';
import Card from '@/components/atoms/Card/Card';
import { Token, TokenState } from './types';
import TokenStateBadge from '@/components/molecules/badges/TokenStateBadge';
import { formatShortDate } from './utils';
import { Button } from '@/components/atoms/Button';

/**
 * Props for the TokenList component
 */
interface TokenListProps {
  /** Array of tokens to display */
  tokens: Token[];
  /** Callback function when a token is selected */
  onSelectToken: (token: Token) => void;
  /** ID of the currently selected token, if any */
  selectedTokenId?: string;
  /** Optional title for the token list */
  title?: string;
  /** Maximum height of the token list container */
  maxHeight?: string;
}

/**
 * TokenList Component
 * 
 * Displays a filterable, searchable list of tokens with their relevant details.
 * Users can filter by token state and search by name or description.
 * 
 * @example
 * ```tsx
 * <TokenList 
 *   tokens={customerTokens} 
 *   onSelectToken={handleSelectToken} 
 *   selectedTokenId={selectedToken?.id} 
 * />
 * ```
 */
export default function TokenList({ 
  tokens, 
  onSelectToken, 
  selectedTokenId,
  title = 'Customer Tokens',
  maxHeight = '60vh'
}: TokenListProps) {
  const [tokenFilter, setTokenFilter] = useState<TokenState | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tokens based on filter and search query
  const filteredTokens = tokens.filter(token => {
    const matchesFilter = tokenFilter === 'All' || token.state === tokenFilter;
    const matchesSearch = !searchQuery || 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <Card>
      <div className="p-5">
        {/* Header with search and filter */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          
          <div className="flex space-x-2">
            {/* Search input */}
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tokens"
              />
            </div>
            
            {/* Filter dropdown */}
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value as TokenState | 'All')}
              aria-label="Filter tokens by state"
            >
              <option value="All">All Tokens</option>
              <option value="Active">Active</option>
              <option value="Shared">Shared</option>
              <option value="Used">Used</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
        
        {/* Token list */}
        <div className={`space-y-3 max-h-[${maxHeight}] overflow-y-auto pr-2`}>
          {filteredTokens.length > 0 ? filteredTokens.map((token) => (
            <div 
              key={token.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTokenId === token.id
                  ? 'border-[#cc0000] bg-red-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelectToken(token)}
              role="button"
              aria-pressed={selectedTokenId === token.id}
            >
              <div className="flex justify-between">
                <span className="font-medium">{token.name}</span>
                <TokenStateBadge state={token.state} />
              </div>
              <div className="text-sm text-gray-600 mt-2">{token.description}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {token.state === 'Active' && `Expires: ${formatShortDate(token.expirationDate)}`}
                  {token.state === 'Used' && token.useDate && `Used: ${formatShortDate(token.useDate)}`}
                  {token.state === 'Shared' && token.shareDate && `Shared: ${formatShortDate(token.shareDate)}`}
                  {token.state === 'Expired' && `Expired: ${formatShortDate(token.expirationDate)}`}
                </span>
                {token.merchantName && (
                  <span className="text-xs text-gray-500">{token.merchantName}</span>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No tokens match your filter
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 