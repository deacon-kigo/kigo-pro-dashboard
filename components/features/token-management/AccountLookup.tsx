'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Account, SearchType } from './types';
import { sampleAccounts } from './data';
import { formatShortDate } from './utils';

type AccountLookupProps = {
  onSelectAccount: (account: Account) => void;
};

/**
 * Account lookup component for searching and selecting customer accounts
 */
export default function AccountLookup({ onSelectAccount }: AccountLookupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('email');
  
  // Filter accounts based on search query
  const filteredAccounts = sampleAccounts.filter(account => {
    if (!searchQuery.trim()) return false;
    
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case 'email':
        return account.email.toLowerCase().includes(query);
      case 'name':
        return `${account.firstName} ${account.lastName}`.toLowerCase().includes(query);
      case 'phone':
        return account.mobileNumber.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
      case 'id':
        return account.id.toLowerCase().includes(query);
      default:
        return false;
    }
  });
  
  return (
    <Card>
      <div className="p-5">
        <h2 className="text-lg font-semibold mb-4">Customer Account Lookup</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                searchType === 'email' 
                  ? 'bg-[#cc0000] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSearchType('email')}
            >
              Email
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                searchType === 'name' 
                  ? 'bg-[#cc0000] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSearchType('name')}
            >
              Name
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                searchType === 'phone' 
                  ? 'bg-[#cc0000] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSearchType('phone')}
            >
              Phone
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                searchType === 'id' 
                  ? 'bg-[#cc0000] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSearchType('id')}
            >
              Customer ID
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {searchQuery && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Search Results</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {filteredAccounts.length > 0 ? filteredAccounts.map((account) => (
                <div 
                  key={account.id}
                  className="p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => onSelectAccount(account)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{account.firstName} {account.lastName}</span>
                    <span className="text-sm text-gray-500">ID: {account.id}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{account.email}</div>
                  <div className="text-sm text-gray-500 mt-1">{account.mobileNumber}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Account created: {formatShortDate(account.creationDate)}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  No accounts match your search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 