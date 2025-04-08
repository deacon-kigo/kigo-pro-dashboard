'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoState, useDemoActions } from '@/lib/redux/hooks';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  ArrowLeftIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { buildDemoUrl } from '@/lib/utils';

// Token types from token management
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
  externalUrl?: string;
}

export default function CVSTokenCatalog() {
  const { userProfile, themeMode } = useDemoState();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenCatalog, setTokenCatalog] = useState<TokenInfo[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Get the sidebar width from Redux state
  const { sidebarWidth } = useAppSelector(state => state.ui);
  
  // For ensuring consistent styling with CVS branding
  const cvsRed = '#CC0000';
  const cvsBlue = '#2563EB';
  
  useEffect(() => {
    // Force light mode for this component
    if (themeMode !== 'light') {
      router.replace('/demos/cvs-token-catalog?role=support&client=cvs&scenario=token-management&theme=light');
    }
  }, [themeMode, router]);
  
  useEffect(() => {
    setIsClient(true);
    // Generate token catalog data
    setTokenCatalog(generateTokenCatalog());
  }, []);
  
  useEffect(() => {
    // Filter tokens based on search term and selected type
    filterTokens();
  }, [searchTerm, selectedType, tokenCatalog]);
  
  const filterTokens = () => {
    let filtered = [...tokenCatalog];
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by token type
    if (selectedType !== 'All') {
      filtered = filtered.filter(token => token.type === selectedType);
    }
    
    setFilteredTokens(filtered);
  };
  
  // Token type badge color
  const getTokenTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Coupon':
        return 'bg-blue-100 text-blue-800';
      case 'Reward':
        return 'bg-purple-100 text-purple-800';
      case 'ExtraBucks':
        return 'bg-red-100 text-red-800';
      case 'Lightning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate token catalog data
  const generateTokenCatalog = (): TokenInfo[] => {
    const tokenTypes = ['Coupon', 'Reward', 'ExtraBucks', 'Lightning'] as const;
    const categories = [
      'Health & Wellness', 'Beauty Products', 'Household Essentials', 
      'Vitamins & Supplements', 'Personal Care', 'Electronics', 
      'Baby Care', 'Food & Beverages', 'Photo Services', 'Pharmacy'
    ];
    
    const tokens: TokenInfo[] = [];
    
    // Generate 30 sample tokens
    for (let i = 1; i <= 30; i++) {
      const type = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate discount/reward value based on type
      let value: string;
      if (type === 'Coupon') {
        const discountPercent = [10, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 7)];
        value = `${discountPercent}%`;
      } else if (type === 'ExtraBucks' || type === 'Reward') {
        const dollars = [2, 3, 5, 10, 15, 20][Math.floor(Math.random() * 6)];
        value = `$${dollars}.00`;
      } else {
        // Lightning deals
        const dollars = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
        value = `$${dollars}.00`;
      }
      
      // Generate name and description based on type
      const name = generateTokenName(type, category, value);
      const description = generateTokenDescription(type, category, value);
      
      // Generate random dates within reasonable ranges
      const today = new Date();
      const expirationDays = 30 + Math.floor(Math.random() * 60); // 1-3 months
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + expirationDays);
      
      tokens.push({
        id: `catalog-${i.toString().padStart(3, '0')}`,
        name,
        description,
        type,
        state: 'Active', // Catalog tokens are always active
        claimDate: today.toISOString().split('T')[0],
        expirationDate: expirationDate.toISOString().split('T')[0],
        merchantName: 'CVS Pharmacy',
        value,
        externalUrl: `https://www.cvs.com/extracare/token/view?id=catalog-${i.toString().padStart(3, '0')}`
      });
    }
    
    return tokens;
  };
  
  // Helper functions to generate token names and descriptions
  const generateTokenName = (type: 'Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning', category: string, value: string) => {
    if (type === 'Coupon') return `${value} off ${category}`;
    if (type === 'ExtraBucks') return `${value} ExtraBucks Rewards`;
    if (type === 'Reward') return `${value} ${category} Reward`;
    return `${value} Lightning Deal on ${category}`;
  };
  
  const generateTokenDescription = (type: 'Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning', category: string, value: string) => {
    if (type === 'Coupon') return `Get ${value} off your purchase of ${category.toLowerCase()}.`;
    if (type === 'ExtraBucks') return `Earn ${value} ExtraBucks Rewards when you spend $${parseInt(value.replace('$', '')) * 4} on ${category.toLowerCase()}.`;
    if (type === 'Reward') return `${value} reward for your loyalty. Redeem on your next purchase of ${category.toLowerCase()}.`;
    return `Limited time offer! ${value} off ${category.toLowerCase()} for the next 24 hours only.`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main 
        className="py-6 overflow-auto"
        style={{ 
          position: 'fixed',
          top: '72px',  // Header height
          bottom: '56px', // Footer height
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8">
          {/* Search and filter controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tokens by name, description, or value..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium text-gray-700">Filter:</span>
                  <div className="relative w-40">
                    <select
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="Coupon">Coupons</option>
                      <option value="ExtraBucks">ExtraBucks</option>
                      <option value="Reward">Rewards</option>
                      <option value="Lightning">Lightning Deals</option>
                    </select>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-2 top-2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Token grid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Available Tokens ({filteredTokens.length})</h2>
            
            {filteredTokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTokens.map((token) => (
                  <div key={token.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{token.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTokenTypeBadgeColor(token.type)}`}>
                        {token.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 mb-4">{token.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-xs text-gray-500">
                        Expires: {new Date(token.expirationDate).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="inline-flex items-center text-xs text-white bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded"
                          onClick={() => window.open(token.externalUrl, '_blank')}
                        >
                          <ExternalLinkIcon className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          className="inline-flex items-center text-xs text-white bg-green-600 hover:bg-green-700 py-1 px-2 rounded"
                          onClick={() => router.push(`${buildDemoUrl('cvs', 'token-management')}?addToken=${token.id}`)}
                        >
                          <PlusCircleIcon className="h-3 w-3 mr-1" />
                          Add to Customer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tokens match your search criteria
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer 
        className="bg-white shadow-inner border-t border-gray-200 py-4"
        style={{ 
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          height: '56px',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8 flex justify-between items-center h-full">
          <div>
            <p className="text-xs text-gray-500">
              &copy; 2023 CVS Health + Kigo. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              Support Portal v1.2.3
            </p>
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-1" />
              <Link href={buildDemoUrl('cvs', 'help')} className="text-xs text-blue-600 hover:text-blue-800">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back Button */}
      <Link
        href={buildDemoUrl('cvs', 'dashboard')}
        className="fixed bottom-20 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
        aria-label="Back to Dashboard"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </Link>
    </div>
  );
} 