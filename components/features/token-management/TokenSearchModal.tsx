'use client';

import React from 'react';
import { Token } from './types';
import TokenStateBadge from './TokenStateBadge';
import { formatShortDate } from './utils';

type TokenSearchModalProps = {
  tokens: Token[];
  onAddToken: (token: Token) => void;
  onClose: () => void;
};

/**
 * Modal component for searching and adding tokens to a customer account
 */
export default function TokenSearchModal({ tokens, onAddToken, onClose }: TokenSearchModalProps) {
  // Only show active tokens for adding to customer accounts
  const availableTokens = tokens.filter(token => token.state === 'Active');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Token Search</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            {availableTokens.length > 0 ? (
              availableTokens.map(token => (
                <div 
                  key={token.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onAddToken(token)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{token.name}</span>
                    <TokenStateBadge state={token.state} />
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{token.description}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Expires: {formatShortDate(token.expirationDate)}
                    </span>
                    {token.merchantName && (
                      <span className="text-xs text-gray-500">{token.merchantName}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tokens available to add
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 border-t">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 