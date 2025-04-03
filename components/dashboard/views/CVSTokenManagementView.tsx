'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Image from 'next/image';
import Card from '@/components/atoms/Card/Card';
import StandardDashboard from '@/components/templates/StandardDashboard';

// Define the token state enum type
type TokenState = 'Active' | 'Shared' | 'Used' | 'Expired';

// Define token type
type Token = {
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

// Define account type
type Account = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  creationDate: string;
  tokens: Token[];
};

// Sample token data
const sampleTokens: Token[] = [
  {
    id: 'TKN-1001',
    name: '$5 ExtraBucks Rewards',
    description: 'Get $5 ExtraBucks Rewards when you spend $20 on select products',
    imageUrl: '/images/extrabucks.png',
    state: 'Active',
    claimDate: '2023-06-10T10:30:00',
    expirationDate: '2023-07-10T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
  {
    id: 'TKN-1002',
    name: '30% Off Vitamins',
    description: 'Save 30% on all vitamins and supplements',
    imageUrl: '/images/vitamins.png',
    state: 'Used',
    claimDate: '2023-05-15T08:15:00',
    useDate: '2023-05-18T14:30:00',
    expirationDate: '2023-06-15T23:59:59',
    merchantName: 'CVS Pharmacy',
    merchantLocation: 'Boston, MA',
  },
  {
    id: 'TKN-1003',
    name: 'BOGO 50% Off Cosmetics',
    description: 'Buy one get one 50% off all cosmetics',
    imageUrl: '/images/cosmetics.png',
    state: 'Shared',
    claimDate: '2023-06-01T15:45:00',
    shareDate: '2023-06-05T09:30:00',
    expirationDate: '2023-06-30T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
  {
    id: 'TKN-1004',
    name: 'Free Greeting Card',
    description: 'Get one free greeting card with any purchase',
    imageUrl: '/images/greeting.png',
    state: 'Expired',
    claimDate: '2023-04-01T12:10:00',
    expirationDate: '2023-05-01T23:59:59',
    merchantName: 'CVS Pharmacy',
    merchantLocation: 'Chicago, IL',
  },
  {
    id: 'TKN-1005',
    name: '$10 Off $50 Purchase',
    description: 'Save $10 on any purchase of $50 or more',
    imageUrl: '/images/discount.png',
    state: 'Active',
    claimDate: '2023-06-12T10:30:00',
    expirationDate: '2023-07-12T23:59:59',
    merchantName: 'CVS Pharmacy',
  },
];

// Sample accounts data
const sampleAccounts: Account[] = [
  {
    id: 'A-1001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    mobileNumber: '(555) 123-4567',
    creationDate: '2022-01-15T10:30:00',
    tokens: [sampleTokens[0], sampleTokens[1], sampleTokens[4]],
  },
  {
    id: 'A-1002',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    mobileNumber: '(555) 987-6543',
    creationDate: '2021-11-20T08:15:00',
    tokens: [sampleTokens[2], sampleTokens[3]],
  },
  {
    id: 'A-1003',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@example.com',
    mobileNumber: '(555) 456-7890',
    creationDate: '2022-03-05T15:45:00',
    tokens: [sampleTokens[0], sampleTokens[2]],
  },
  {
    id: 'A-1004',
    firstName: 'Samantha',
    lastName: 'Lee',
    email: 'samantha.lee@example.com',
    mobileNumber: '(555) 789-0123',
    creationDate: '2021-08-12T12:10:00',
    tokens: [sampleTokens[1], sampleTokens[3], sampleTokens[4]],
  },
];

// Token state badge component
function TokenStateBadge({ state }: { state: TokenState }) {
  const getStateStyles = () => {
    switch(state) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Shared':
        return 'bg-blue-100 text-blue-800';
      case 'Used':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateStyles()}`}>
      {state}
    </span>
  );
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch(status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Customer':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

// Priority indicator component
function PriorityIndicator({ priority }: { priority: string }) {
  const getPriorityStyles = () => {
    switch(priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="flex items-center">
      <span className={`font-medium ${getPriorityStyles()}`}>{priority}</span>
    </div>
  );
}

export default function CVSTokenManagementView() {
  const { userProfile, setThemeMode } = useDemo();
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'name' | 'phone' | 'id'>('email');
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenFilter, setTokenFilter] = useState<TokenState | 'All'>('All');
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');
  const [showTokenSearchModal, setShowTokenSearchModal] = useState(false);
  const [availableTokens, setAvailableTokens] = useState<Token[]>(sampleTokens);
  
  // Set theme to light mode on component mount
  useEffect(() => {
    setThemeMode('light');
    
    // Set current date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    }));
  }, [setThemeMode]);
  
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
  
  // Filter tokens based on token filter and search
  const filteredTokens = selectedAccount?.tokens.filter(token => {
    const matchesFilter = tokenFilter === 'All' || token.state === tokenFilter;
    const matchesSearch = !tokenSearchQuery || 
      token.name.toLowerCase().includes(tokenSearchQuery.toLowerCase()) || 
      token.description.toLowerCase().includes(tokenSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Format date to short readable format
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Token management actions
  const addTokenToAccount = (token: Token) => {
    if (!selectedAccount) return;
    
    const newToken = { ...token, id: `TKN-${Math.floor(1000 + Math.random() * 9000)}`, state: 'Active' as TokenState, claimDate: new Date().toISOString() };
    
    // Update selected account with new token
    const updatedAccount = { 
      ...selectedAccount, 
      tokens: [...selectedAccount.tokens, newToken] 
    };
    
    // Update account in sample data
    const updatedAccounts = sampleAccounts.map(acc => 
      acc.id === selectedAccount.id ? updatedAccount : acc
    );
    
    // Update state
    setSelectedAccount(updatedAccount);
    setShowTokenSearchModal(false);
  };
  
  const removeTokenFromAccount = (tokenId: string) => {
    if (!selectedAccount) return;
    
    // Update selected account by removing token
    const updatedAccount = { 
      ...selectedAccount, 
      tokens: selectedAccount.tokens.filter(t => t.id !== tokenId) 
    };
    
    // Update state
    setSelectedAccount(updatedAccount);
    setSelectedToken(null);
  };
  
  const reissueToken = (oldToken: Token) => {
    if (!selectedAccount) return;
    
    // Create a new token based on the expired/used one
    const newToken = { 
      ...oldToken, 
      id: `TKN-${Math.floor(1000 + Math.random() * 9000)}`, 
      state: 'Active' as TokenState, 
      claimDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 days from now
      useDate: undefined,
      shareDate: undefined
    };
    
    // Update selected account with new token
    const updatedAccount = { 
      ...selectedAccount, 
      tokens: [...selectedAccount.tokens, newToken] 
    };
    
    // Update state
    setSelectedAccount(updatedAccount);
  };
  
  // Create stats section for StandardDashboard
  const statsSection = (
    <>
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-lg mr-4 text-red-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Tokens</p>
            <p className="text-2xl font-bold">{sampleTokens.filter(t => t.state === 'Active').length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4 text-blue-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shared Tokens</p>
            <p className="text-2xl font-bold">{sampleTokens.filter(t => t.state === 'Shared').length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Used Tokens</p>
            <p className="text-2xl font-bold">{sampleTokens.filter(t => t.state === 'Used').length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4 text-yellow-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expired Tokens</p>
            <p className="text-2xl font-bold">{sampleTokens.filter(t => t.state === 'Expired').length}</p>
          </div>
        </div>
      </Card>
    </>
  );
  
  // Custom header content with logo
  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-14 w-24 relative mr-4">
          <Image 
            src="/logos/cvs-logo.svg" 
            alt="CVS Logo" 
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#cc0000]">
            Good morning, {userProfile.firstName}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentDate} • <span className="text-[#cc0000] font-medium">ExtraCare Token Management</span>
          </p>
          <p className="text-sm text-gray-500 italic mt-1">
            Support agent ID: {userProfile.id}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {selectedAccount && (
          <button 
            onClick={() => setShowTokenSearchModal(true)}
            className="inline-flex items-center rounded-md bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a00000]"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Token
          </button>
        )}
      </div>
    </div>
  );
  
  // Create the main content
  const mainContent = (
    <div className="space-y-6">
      {/* Account lookup section */}
      {!selectedAccount ? (
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
                      onClick={() => setSelectedAccount(account)}
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
      ) : (
        <>
          {/* Account details and token management */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account details */}
            <Card>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Account Details</h2>
                  <button 
                    onClick={() => {
                      setSelectedAccount(null);
                      setSelectedToken(null);
                      setSearchQuery('');
                    }}
                    className="text-[#cc0000] hover:text-[#a00000] text-sm font-medium"
                  >
                    Back to Search
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 font-medium">{selectedAccount.firstName} {selectedAccount.lastName}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 font-medium">{selectedAccount.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                    <p className="mt-1 font-medium">{selectedAccount.mobileNumber}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Account ID</h3>
                    <p className="mt-1 font-medium">{selectedAccount.id}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                    <p className="mt-1 font-medium">{formatDate(selectedAccount.creationDate)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Token Summary</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium text-green-600">{selectedAccount.tokens.filter(t => t.state === 'Active').length}</span> Active
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-blue-600">{selectedAccount.tokens.filter(t => t.state === 'Shared').length}</span> Shared
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-600">{selectedAccount.tokens.filter(t => t.state === 'Used').length}</span> Used
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-red-600">{selectedAccount.tokens.filter(t => t.state === 'Expired').length}</span> Expired
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Token list panel */}
            <div className="md:col-span-2">
              <Card>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Customer Tokens</h2>
                    
                    <div className="flex space-x-2">
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
                          value={tokenSearchQuery}
                          onChange={(e) => setTokenSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={tokenFilter}
                        onChange={(e) => setTokenFilter(e.target.value as TokenState | 'All')}
                      >
                        <option value="All">All Tokens</option>
                        <option value="Active">Active</option>
                        <option value="Shared">Shared</option>
                        <option value="Used">Used</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredTokens.length > 0 ? filteredTokens.map((token) => (
                      <div 
                        key={token.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedToken?.id === token.id
                            ? 'border-[#cc0000] bg-red-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedToken(token)}
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
            </div>
          </div>
          
          {/* Token detail panel */}
          {selectedToken && (
            <Card>
              <div className="p-5">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-bold">{selectedToken.name}</h2>
                    <div className="text-sm text-gray-500 mt-1">
                      Token ID: {selectedToken.id}
                    </div>
                  </div>
                  <TokenStateBadge state={selectedToken.state} />
                </div>
                
                <div className="flex mb-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg mr-5 relative overflow-hidden">
                    <Image 
                      src={selectedToken.imageUrl || '/images/token-placeholder.png'}
                      alt={selectedToken.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4">{selectedToken.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Claimed</h3>
                        <p className="mt-1 font-medium">{formatShortDate(selectedToken.claimDate)}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Expires</h3>
                        <p className="mt-1 font-medium">{formatShortDate(selectedToken.expirationDate)}</p>
                      </div>
                      
                      {selectedToken.useDate && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Used</h3>
                          <p className="mt-1 font-medium">{formatShortDate(selectedToken.useDate)}</p>
                        </div>
                      )}
                      
                      {selectedToken.shareDate && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Shared</h3>
                          <p className="mt-1 font-medium">{formatShortDate(selectedToken.shareDate)}</p>
                        </div>
                      )}
                      
                      {selectedToken.merchantName && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Merchant</h3>
                          <p className="mt-1 font-medium">{selectedToken.merchantName}</p>
                        </div>
                      )}
                      
                      {selectedToken.merchantLocation && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Location</h3>
                          <p className="mt-1 font-medium">{selectedToken.merchantLocation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Support Notes</h3>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-3" 
                    rows={3}
                    placeholder="Add notes about this token..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  {(selectedToken.state === 'Expired' || selectedToken.state === 'Used') && (
                    <button 
                      onClick={() => reissueToken(selectedToken)}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      Reissue Token
                    </button>
                  )}
                  
                  <button 
                    onClick={() => removeTokenFromAccount(selectedToken.id)}
                    className="inline-flex items-center rounded-md bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a00000]"
                  >
                    Remove Token
                  </button>
                  
                  <button 
                    onClick={() => setSelectedToken(null)}
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Token search modal */}
          {showTokenSearchModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <div className="p-5 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Token Search</h3>
                    <button 
                      onClick={() => setShowTokenSearchModal(false)}
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
                    {availableTokens
                      .filter(token => token.state === 'Active')
                      .map(token => (
                        <div 
                          key={token.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => addTokenToAccount(token)}
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
                      ))}
                  </div>
                </div>
                
                <div className="p-5 border-t">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowTokenSearchModal(false)}
                      className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
  
  // Custom sidebar
  const sidebarContent = (
    <>
      <div className="bg-red-50 rounded-lg p-5 shadow-sm mb-6">
        <div className="flex items-center">
          <div className="bg-red-100 rounded-full p-3 mr-4 text-[#cc0000]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">ExtraCare Support Tools</h3>
            <p className="text-sm text-gray-600">Manage customer tokens easily</p>
          </div>
        </div>
        <div className="mt-4">
          <ul className="space-y-2">
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-[#cc0000] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Token Management</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-[#cc0000] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">View token usage reports</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ul>
        </div>
      </div>
      
      <Card title="Support Guidelines">
        <div className="p-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800">Looking up accounts</h4>
            <p className="text-sm text-gray-600 mt-1">
              Always verify customer identity using at least two identifiers before making changes.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-800">Adding tokens</h4>
            <p className="text-sm text-gray-600 mt-1">
              Only add tokens that customers were eligible for but did not receive due to system issues.
            </p>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-800">Removing tokens</h4>
            <p className="text-sm text-gray-600 mt-1">
              Token removal should only be done in cases of fraud or system error. Document all removals.
            </p>
          </div>
        </div>
      </Card>
      
      <Card title="Recent System Updates">
        <div className="p-4 space-y-3">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <h4 className="font-medium text-yellow-800">System Update</h4>
            <p className="text-sm text-gray-600 mt-1">
              Token management system will be updated tonight at 2 AM EST. Expect 15 minutes of downtime.
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800">New Token Types</h4>
            <p className="text-sm text-gray-600 mt-1">
              Extra Care Birthday Rewards are now available. See knowledge base for details.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
  
  return (
    <StandardDashboard
      headerContent={headerContent}
      statsSection={statsSection}
      sidebarContent={sidebarContent}
    >
      {mainContent}
    </StandardDashboard>
  );
} 