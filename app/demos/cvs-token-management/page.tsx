'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/contexts/DemoContext';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  TicketIcon, 
  ChevronDownIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

// Types for the token management interface
interface TokenInfo {
  id: string;
  name: string;
  description: string;
  type: 'Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning';
  state: 'Active' | 'Shared' | 'Used' | 'Expired';
  claimDate: string;
  useDate?: string;
  shareDate?: string;
  expirationDate: string;
  merchantName?: string;
  merchantLocation?: string;
  value: string;
}

interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extraCareId: string;
  accountCreated: string;
  tokens: TokenInfo[];
}

// Mock customer data
const mockCustomers: CustomerInfo[] = [
  {
    id: 'cust001',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    phone: '(555) 123-4567',
    extraCareId: '4872913650',
    accountCreated: '2021-06-15',
    tokens: [
      {
        id: 'tok001',
        name: '$5 ExtraBucks Rewards',
        description: 'Earn $5 ExtraBucks Rewards when you spend $20 on beauty products',
        type: 'ExtraBucks',
        state: 'Active',
        claimDate: '2023-05-10',
        expirationDate: '2023-06-10',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Downtown',
        value: '$5.00'
      },
      {
        id: 'tok002',
        name: '20% Off Vitamins',
        description: '20% off your purchase of vitamins and supplements',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-04-01',
        expirationDate: '2023-05-01',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Westside Mall',
        value: '20%'
      }
    ]
  },
  {
    id: 'cust002',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael.williams@example.com',
    phone: '(555) 987-6543',
    extraCareId: '7391265480',
    accountCreated: '2020-11-22',
    tokens: [
      {
        id: 'tok003',
        name: '30% Off Contact Lenses',
        description: '30% off any contact lens purchase',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-05-15',
        useDate: '2023-05-20',
        expirationDate: '2023-06-15',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'North Avenue',
        value: '30%'
      }
    ]
  },
  {
    id: 'cust003',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@example.com',
    phone: '(555) 234-5678',
    extraCareId: '6129385740',
    accountCreated: '2022-01-07',
    tokens: []
  }
];

// Mock token catalog for adding to customers
const tokenCatalog: TokenInfo[] = [
  {
    id: 'cat001',
    name: '$10 ExtraBucks Rewards',
    description: '$10 ExtraBucks Rewards for ExtraCare members',
    type: 'ExtraBucks',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: '$10.00'
  },
  {
    id: 'cat002',
    name: '40% Off Photo',
    description: '40% off photo prints and gifts',
    type: 'Coupon',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: '40%'
  },
  {
    id: 'cat003',
    name: 'FREE Hand Sanitizer',
    description: 'Free CVS Health Hand Sanitizer with any purchase of $10 or more',
    type: 'Reward',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: 'FREE'
  },
  {
    id: 'cat004',
    name: 'Lightning: $3 ExtraBucks',
    description: 'Limited time $3 ExtraBucks offer - Today only!',
    type: 'Lightning',
    state: 'Active',
    claimDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    merchantName: 'CVS Pharmacy',
    value: '$3.00'
  }
];

export default function CVSTokenManagement() {
  const { userProfile, theme, themeMode } = useDemo();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<'email' | 'name' | 'phone' | 'extraCareId'>('email');
  const [customerResults, setCustomerResults] = useState<CustomerInfo[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [showTokenCatalog, setShowTokenCatalog] = useState(false);
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [caseNotes, setCaseNotes] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  // CVS ExtraCare branding colors
  const cvsRed = '#CC0000';
  const cvsDarkBlue = '#0077C8';
  const cvsLightBlue = '#009FDA';
  const kigoBlue = '#2563EB';

  const isDarkMode = themeMode === 'dark';

  // Ensure we're using the correct demo context
  useEffect(() => {
    // Check if we already have the correct context
    if (userProfile?.role === 'CVS ExtraCare Support Specialist') return;

    // If not, redirect to the page with the proper URL parameters
    router.replace('/demos/cvs-token-management?role=support&client=cvs&scenario=support-flow&theme=light');
  }, [userProfile, router]);

  // Search customers based on query and field
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setCustomerResults([]);
      return;
    }

    const filteredCustomers = customers.filter(customer => {
      const query = searchQuery.toLowerCase();
      switch (searchField) {
        case 'email':
          return customer.email.toLowerCase().includes(query);
        case 'name':
          return `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query);
        case 'phone':
          return customer.phone.includes(query);
        case 'extraCareId':
          return customer.extraCareId.includes(query);
        default:
          return false;
      }
    });

    setCustomerResults(filteredCustomers);
  };

  // Handle selecting a customer from search results
  const selectCustomer = (customer: CustomerInfo) => {
    setSelectedCustomer(customer);
    setCustomerResults([]);
    setSearchQuery('');
  };

  // Add a token to the selected customer
  const addTokenToCustomer = (token: TokenInfo) => {
    if (!selectedCustomer) return;

    const newToken = {
      ...token,
      id: `tok${Date.now()}`, // Generate unique ID
      claimDate: new Date().toISOString().split('T')[0]
    };

    // Update customers state
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          tokens: [...c.tokens, newToken]
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    
    // Update selected customer
    setSelectedCustomer({
      ...selectedCustomer,
      tokens: [...selectedCustomer.tokens, newToken]
    });

    setShowTokenCatalog(false);
    setActionMessage({
      text: `Successfully added ${token.name} to ${selectedCustomer.firstName}'s account`,
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Remove a token from the selected customer
  const removeTokenFromCustomer = (tokenId: string) => {
    if (!selectedCustomer) return;

    // Update customers state
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          tokens: c.tokens.filter(t => t.id !== tokenId)
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    
    // Update selected customer
    const updatedCustomer = {
      ...selectedCustomer,
      tokens: selectedCustomer.tokens.filter(t => t.id !== tokenId)
    };
    setSelectedCustomer(updatedCustomer);

    setActionMessage({
      text: `Successfully removed token from ${selectedCustomer.firstName}'s account`,
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Reissue an expired or used token
  const reissueToken = (token: TokenInfo) => {
    if (!selectedCustomer) return;

    // First remove the old token
    const updatedTokens = selectedCustomer.tokens.filter(t => t.id !== token.id);
    
    // Create a new active token
    const newToken = {
      ...token,
      id: `tok${Date.now()}`, // Generate unique ID
      state: 'Active' as const,
      claimDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      useDate: undefined,
      shareDate: undefined
    };

    // Update customers state
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          tokens: [...updatedTokens, newToken]
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    
    // Update selected customer
    setSelectedCustomer({
      ...selectedCustomer,
      tokens: [...updatedTokens, newToken]
    });

    setActionMessage({
      text: `Successfully reissued ${token.name} to ${selectedCustomer.firstName}'s account`,
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Save case notes
  const handleSaveNotes = () => {
    setActionMessage({
      text: 'Case notes saved successfully',
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Get badge color based on token state
  const getTokenStateBadgeColor = (state: TokenInfo['state']) => {
    switch (state) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Used':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Shared':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get badge color based on token type
  const getTokenTypeBadgeColor = (type: TokenInfo['type']) => {
    switch (type) {
      case 'ExtraBucks':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Coupon':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Reward':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Lightning':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Search on enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Run search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setCustomerResults([]);
    }
  }, [searchQuery, searchField]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Co-branded Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {/* Kigo x CVS Co-branding */}
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 bg-[#2563EB] rounded-md flex items-center justify-center text-white font-bold">
                K
              </div>
              <span className="text-lg font-semibold mr-2">Kigo</span>
              <span className="text-gray-500 mx-2">×</span>
              <Image 
                src="/logos/cvs-logo.svg" 
                alt="CVS Logo" 
                width={60} 
                height={24} 
                className="h-6 w-auto"
              />
            </div>
            <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ExtraCare Token Management</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Support Agent Info */}
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <p className="text-sm font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userProfile.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-4 p-3 rounded-lg ${
            actionMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            actionMessage.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {actionMessage.text}
          </div>
        )}

        {/* Customer Search */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Customer Lookup</h2>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for customer..."
                className="w-full p-3 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            
            <div className="w-44">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as any)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="email">Email</option>
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="extraCareId">ExtraCare ID</option>
              </select>
            </div>
            
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-lg"
            >
              Search
            </button>
          </div>

          {/* Search Results */}
          {customerResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Results ({customerResults.length})</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                {customerResults.map((customer) => (
                  <div 
                    key={customer.id}
                    className="border-b border-gray-200 dark:border-gray-600 last:border-0 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email} • {customer.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ExtraCare ID: {customer.extraCareId}</p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Account Created: {formatDate(customer.accountCreated)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && customerResults.length === 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              No customers found. Try a different search term.
            </div>
          )}
        </div>

        {/* Customer Profile and Token Management */}
        {selectedCustomer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ExtraCare ID:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedCustomer.extraCareId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Account Created:</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(selectedCustomer.accountCreated)}</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="pt-2">
                  <span className="font-medium">Active Tokens:</span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">
                    {selectedCustomer.tokens.filter(t => t.state === 'Active').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Used Tokens:</span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium">
                    {selectedCustomer.tokens.filter(t => t.state === 'Used').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Expired Tokens:</span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">
                    {selectedCustomer.tokens.filter(t => t.state === 'Expired').length}
                  </span>
                </div>
              </div>
              
              {/* Case Notes */}
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Case Notes</h3>
                <textarea
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white h-32"
                  placeholder="Add notes about this case..."
                ></textarea>
                <button
                  onClick={handleSaveNotes}
                  className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
                >
                  Save Notes
                </button>
              </div>
            </div>
            
            {/* Token Management */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Token Management</h2>
                <button
                  onClick={() => setShowTokenCatalog(!showTokenCatalog)}
                  className="px-4 py-2 flex items-center gap-2 bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-lg text-sm"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add Token
                </button>
              </div>
              
              {/* Token Catalog Dialog */}
              {showTokenCatalog && (
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Token Catalog</h3>
                    <button
                      onClick={() => setShowTokenCatalog(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tokenCatalog.map((token) => (
                      <div
                        key={token.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                        onClick={() => addTokenToCustomer(token)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{token.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getTokenTypeBadgeColor(token.type)}`}>
                            {token.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{token.description}</p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Value: {token.value}</span>
                          <span>Expires: {formatDate(token.expirationDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Customer Tokens */}
              <div>
                {selectedCustomer.tokens.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>This customer has no tokens in their account.</p>
                    <button
                      onClick={() => setShowTokenCatalog(true)}
                      className="mt-3 px-4 py-2 bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-lg text-sm inline-flex items-center"
                    >
                      <PlusCircleIcon className="w-4 h-4 mr-2" />
                      Add Their First Token
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedCustomer.tokens.map((token) => (
                      <div key={token.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{token.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getTokenStateBadgeColor(token.state)}`}>
                                {token.state}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getTokenTypeBadgeColor(token.type)}`}>
                                {token.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{token.description}</p>
                          </div>
                          <div className="text-lg font-semibold text-[#CC0000] dark:text-red-400">
                            {token.value}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <p className="font-medium">Claimed:</p>
                            <p>{formatDate(token.claimDate)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Expires:</p>
                            <p>{formatDate(token.expirationDate)}</p>
                          </div>
                          {token.useDate && (
                            <div>
                              <p className="font-medium">Used:</p>
                              <p>{formatDate(token.useDate)}</p>
                            </div>
                          )}
                          {token.shareDate && (
                            <div>
                              <p className="font-medium">Shared:</p>
                              <p>{formatDate(token.shareDate)}</p>
                            </div>
                          )}
                          {token.merchantLocation && (
                            <div>
                              <p className="font-medium">Location:</p>
                              <p>{token.merchantLocation}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          {(token.state === 'Expired' || token.state === 'Used') && (
                            <button
                              onClick={() => reissueToken(token)}
                              className="px-3 py-1.5 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded text-xs"
                            >
                              <ArrowPathIcon className="w-3.5 h-3.5" />
                              Reissue Token
                            </button>
                          )}
                          <button
                            onClick={() => removeTokenFromCustomer(token.id)}
                            className="px-3 py-1.5 flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded text-xs"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; 2023 Kigo + CVS Pharmacy. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Support Portal v1.2.3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 