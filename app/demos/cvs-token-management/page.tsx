'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/contexts/DemoContext';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  TicketIcon, 
  ChevronDownIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  ArrowLeftIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Import Redux actions
import {
  setSearchQuery,
  selectCustomer,
  setViewState,
  toggleTokenCatalog,
  addTokenToCustomer,
  removeTokenFromCustomer,
  reissueToken,
  saveCaseNotes,
  clearActionMessage,
  selectToken,
  updateTokenFilters,
  applyPresetFilter,
  setCurrentPage,
  setItemsPerPage,
  initializeState,
  markTokenDisputed
} from '@/lib/redux/slices/cvsTokenSlice';

// Types for the token management interface
// Keep these exported so they can be used in the Redux slice
export interface TokenInfo {
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

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extraCareId: string;
  accountCreated: string;
  address: {
    street: string;
    aptUnit?: string;
    city: string;
    state: string;
    zip: string;
  };
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
    address: {
      street: '123 Market Street',
      aptUnit: 'Apt 4B',
      city: 'Boston',
      state: 'MA',
      zip: '02108'
    },
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
        value: '$5.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok001'
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
        value: '20%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok002'
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
    address: {
      street: '456 Commonwealth Avenue',
      city: 'Boston',
      state: 'MA',
      zip: '02215'
    },
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
        value: '30%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok003'
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
    address: {
      street: '789 Boylston Street',
      aptUnit: 'Suite 300',
      city: 'Boston',
      state: 'MA',
      zip: '02199'
    },
    tokens: []
  }
];

// Add these additional sample customers to the mockCustomers array at the top of the file, before the export default function
const additionalSampleCustomers: CustomerInfo[] = [
  {
    id: 'cust004',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 432-1098',
    extraCareId: '5134982760',
    accountCreated: '2022-01-12',
    address: {
      street: '101 Beacon Street',
      aptUnit: 'Unit 15',
      city: 'Boston',
      state: 'MA',
      zip: '02116'
    },
    tokens: [
      {
        id: 'tok004',
        name: '$7 ExtraBucks Rewards',
        description: '$7 ExtraBucks Rewards for beauty purchases',
        type: 'ExtraBucks',
        state: 'Active',
        claimDate: '2023-05-20',
        expirationDate: '2023-06-20',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Eastside Plaza',
        value: '$7.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok004'
      },
      {
        id: 'tok005',
        name: '25% Off Cosmetics',
        description: '25% off cosmetics purchase',
        type: 'Coupon',
        state: 'Active',
        claimDate: '2023-05-01',
        expirationDate: '2023-06-01',
        merchantName: 'CVS Pharmacy',
        merchantLocation: 'Eastside Plaza',
        value: '25%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok005'
      },
      {
        id: 'tok006',
        name: 'BOGO Vitamins',
        description: 'Buy one get one free on select vitamins',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-04-01',
        useDate: '2023-04-15',
        expirationDate: '2023-05-01',
        merchantName: 'CVS Pharmacy',
        value: 'BOGO',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok006'
      },
      {
        id: 'tok007',
        name: 'Free Photo Print',
        description: 'One free 4x6 photo print',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-03-20',
        useDate: '2023-04-10',
        expirationDate: '2023-04-20',
        merchantName: 'CVS Pharmacy',
        value: 'FREE',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok007'
      },
      {
        id: 'tok008',
        name: 'First Aid Kit Discount',
        description: '20% off first aid supplies',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-02-15',
        useDate: '2023-03-01',
        expirationDate: '2023-03-15',
        merchantName: 'CVS Pharmacy',
        value: '20%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok008'
      },
      {
        id: 'tok009',
        name: '$3 Seasonal Items',
        description: '$3 off seasonal merchandise',
        type: 'Coupon',
        state: 'Used',
        claimDate: '2023-01-25',
        useDate: '2023-02-10',
        expirationDate: '2023-02-25',
        merchantName: 'CVS Pharmacy',
        value: '$3.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok009'
      }
    ]
  },
  {
    id: 'cust005',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '(555) 789-6543',
    extraCareId: '7892136540',
    accountCreated: '2023-03-23',
    address: {
      street: '222 Tremont Street',
      aptUnit: 'Apt 7C',
      city: 'Boston',
      state: 'MA',
      zip: '02116'
    },
    tokens: [
      {
        id: 'tok010',
        name: 'Flash Sale: $5 ExtraBucks',
        description: 'Limited time $5 offer - Today only!',
        type: 'Lightning',
        state: 'Active',
        claimDate: '2023-05-25',
        expirationDate: '2023-05-26',
        merchantName: 'CVS Pharmacy',
        value: '$5.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok010'
      }
    ]
  },
  {
    id: 'cust006',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    phone: '(555) 321-7890',
    extraCareId: '3698521470',
    accountCreated: '2021-11-05',
    address: {
      street: '333 Newbury Street',
      city: 'Boston',
      state: 'MA',
      zip: '02115'
    },
    tokens: [
      {
        id: 'tok011',
        name: '40% Off Sunscreen',
        description: '40% off all sunscreen products',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-03-01',
        expirationDate: '2023-04-01',
        merchantName: 'CVS Pharmacy',
        value: '40%',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok011'
      },
      {
        id: 'tok012',
        name: '$10 Off $40 Purchase',
        description: '$10 off when you spend $40 or more',
        type: 'Coupon',
        state: 'Expired',
        claimDate: '2023-02-01',
        expirationDate: '2023-03-01',
        merchantName: 'CVS Pharmacy',
        value: '$10.00',
        externalUrl: 'https://www.cvs.com/extracare/token/view?id=tok012'
      }
    ]
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

// Add a new function to highlight matched text in search results
const HighlightedText = ({ text, searchTerm }: { text: string, searchTerm: string }) => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 px-0.5">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

// Format date for display - move outside component for SSR
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

// Get badge color based on token state - move outside component for SSR
const getTokenStateBadgeColor = (state: string) => {
  switch (state) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Used':
      return 'bg-gray-100 text-gray-800';
    case 'Expired':
      return 'bg-red-100 text-red-800';
    case 'Shared':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get badge color based on token type - move outside component for SSR
const getTokenTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'ExtraBucks':
      return 'bg-yellow-100 text-yellow-800';
    case 'Coupon':
      return 'bg-purple-100 text-purple-800';
    case 'Reward':
      return 'bg-blue-100 text-blue-800';
    case 'Lightning':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CVSTokenManagement() {
  const { userProfile, theme, themeMode } = useDemo();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Add this state to prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  
  // Get state from Redux
  const {
    customers,
    searchQuery,
    customerResults,
    selectedCustomer,
    selectedToken,
    showTokenCatalog,
    actionMessage,
    caseNotes,
    viewState,
    hasSearched,
    tokenCatalog,
    tokenFilters,
    pagination
  } = useAppSelector(state => state.cvsToken);

  // Local state for UI elements that don't need to be in Redux
  const [caseNotesInput, setCaseNotesInput] = useState(caseNotes);
  // Move isExpanded state to component level to avoid Rules of Hooks violation
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  // CVS ExtraCare branding colors
  const cvsRed = '#CC0000';
  const cvsDarkBlue = '#0077C8';
  const cvsLightBlue = '#009FDA';
  const kigoBlue = '#2563EB';

  // Add state for confirm modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'remove' | 'reissue' | 'dispute' | null>(null);
  const [confirmTokenId, setConfirmTokenId] = useState<string | null>(null);
  const [confirmReason, setConfirmReason] = useState('');
  const [confirmComments, setConfirmComments] = useState('');
  const [notHonored, setNotHonored] = useState(false);
  
  // Initialize Redux state only once on the client-side
  useEffect(() => {
    dispatch(initializeState());
    setIsClient(true);
  }, [dispatch]);

  // Force light mode for this component
  useEffect(() => {
    // Set theme to light mode
    if (themeMode !== 'light') {
      router.replace('/demos/cvs-token-management?role=support&client=cvs&scenario=support-flow&theme=light');
    }
  }, [themeMode, router]);

  // Ensure we're using the correct demo context
  useEffect(() => {
    // Check if we already have the correct context
    if (userProfile?.role === 'CVS ExtraCare Support Specialist') return;

    // If not, redirect to the page with the proper URL parameters
    router.replace('/demos/cvs-token-management?role=support&client=cvs&scenario=support-flow&theme=light');
  }, [userProfile, router]);

  // Updated search function to use Redux
  const handleSearch = () => {
    dispatch(setSearchQuery(searchQuery));
  };

  // Modified selectCustomer to use Redux
  const selectCustomerHandler = (customerId: string) => {
    dispatch(selectCustomer(customerId));
  };

  // Function to go back to main view
  const backToMainView = () => {
    dispatch(setViewState('main'));
  };

  // Add a token to the selected customer
  const addTokenToCustomerHandler = (tokenId: string) => {
    dispatch(addTokenToCustomer(tokenId));
    
    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);
  };

  // Updated reissueTokenHandler to show confirmation modal
  const reissueTokenHandler = (tokenId: string) => {
    setConfirmAction('reissue');
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };
  
  // Updated removeTokenFromCustomerHandler to show confirmation modal
  const removeTokenFromCustomerHandler = (tokenId: string) => {
    setConfirmAction('remove');
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };
  
  // New handler for marking a token as disputed
  const markTokenDisputedHandler = (tokenId: string) => {
    setConfirmAction('dispute');
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };
  
  // Handle confirm action
  const handleConfirmAction = () => {
    if (!confirmTokenId) return;
    
    switch (confirmAction) {
      case 'reissue':
        dispatch(reissueToken({ 
          tokenId: confirmTokenId, 
          reason: confirmReason, 
          comments: confirmComments 
        }));
        break;
      case 'remove':
        dispatch(removeTokenFromCustomer(confirmTokenId));
        break;
      case 'dispute':
        dispatch(markTokenDisputed({ 
          tokenId: confirmTokenId, 
          reason: confirmReason, 
          notHonored: notHonored 
        }));
        break;
    }
    
    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);
    
    // Reset confirm modal state
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmTokenId(null);
    setConfirmReason('');
    setConfirmComments('');
    setNotHonored(false);
  };

  // Save case notes
  const handleSaveNotes = () => {
    dispatch(saveCaseNotes(caseNotesInput));
    
    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);
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
    }
  }, [searchQuery]);

  // Function to handle external URL click
  const handleViewInExtraCare = (url: string | undefined) => {
    if (!url) {
      console.log("No external URL available");
      return;
    }
    
    // In a real application, this would navigate to the external URL
    // For the demo, we'll just log it and show an alert
    console.log("Navigating to external URL:", url);
    window.alert(`This would open the token in the Extra Care system: ${url}`);
    
    // In production, we might use:
    // window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper function to get filtered tokens
  const getFilteredTokens = () => {
    if (!selectedCustomer) return [];
    
    return selectedCustomer.tokens.filter(token => {
      // Filter by status
      if (tokenFilters.status.length > 0 && !tokenFilters.status.includes(token.state)) {
        return false;
      }
      
      // Filter by date range (claim date)
      const tokenDate = new Date(token.claimDate);
      if (tokenFilters.dateRange.start && new Date(tokenFilters.dateRange.start) > tokenDate) {
        return false;
      }
      if (tokenFilters.dateRange.end && new Date(tokenFilters.dateRange.end) < tokenDate) {
        return false;
      }
      
      // Filter by token type
      if (tokenFilters.types.length > 0 && !tokenFilters.types.includes(token.type)) {
        return false;
      }
      
      // Filter by merchant
      if (tokenFilters.merchant && token.merchantName && !token.merchantName.toLowerCase().includes(tokenFilters.merchant.toLowerCase())) {
        return false;
      }
      
      // Filter by search query (name or description)
      if (tokenFilters.searchQuery) {
        const query = tokenFilters.searchQuery.toLowerCase();
        return token.name.toLowerCase().includes(query) || token.description.toLowerCase().includes(query);
      }
      
      return true;
    });
  };
  
  // Get filtered tokens - memoize for better performance
  const filteredTokens = React.useMemo(() => getFilteredTokens(), [
    selectedCustomer, tokenFilters
  ]);
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    dispatch(updateTokenFilters({ filterType, value }));
  };
  
  // Preset filters for common scenarios
  const handleApplyPresetFilter = (preset: string) => {
    dispatch(applyPresetFilter(preset));
  };

  // Render customer profile
  const renderCustomerProfile = () => {
    if (!selectedCustomer) return null;
    
    const getTokenCountByState = () => {
      const counts = {
        total: selectedCustomer.tokens.length,
        active: 0,
        expired: 0,
        used: 0,
        shared: 0
      };
      
      selectedCustomer.tokens.forEach(token => {
        if (token.state === 'Active') counts.active++;
        else if (token.state === 'Expired') counts.expired++;
        else if (token.state === 'Used') counts.used++;
        else if (token.state === 'Shared') counts.shared++;
      });
      
      return counts;
    };
    
    const tokenCounts = getTokenCountByState();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Name:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Email:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.email}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Phone:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.phone}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Extra Care ID:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.extraCareId}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Created:</span>
                <span className="text-sm text-gray-900">{formatDate(selectedCustomer.accountCreated)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Address</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Street:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.address.street}</span>
              </div>
              {selectedCustomer.address.aptUnit && (
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-32">Unit/Apt:</span>
                  <span className="text-sm text-gray-900">{selectedCustomer.address.aptUnit}</span>
                </div>
              )}
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">City:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.address.city}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">State:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.address.state}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">Zip Code:</span>
                <span className="text-sm text-gray-900">{selectedCustomer.address.zip}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Token Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">Total Tokens</p>
                <p className="text-2xl font-bold text-blue-800">{tokenCounts.total}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-800">{tokenCounts.active}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700 font-medium">Expired</p>
                <p className="text-2xl font-bold text-yellow-800">{tokenCounts.expired}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">Used</p>
                <p className="text-2xl font-bold text-gray-800">{tokenCounts.used}</p>
              </div>
            </div>
          </div>
          
          {/* Case Notes Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Case Notes</h3>
            <div className="mt-2">
              <textarea
                value={caseNotesInput}
                onChange={(e) => setCaseNotesInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Add case notes here..."
              />
              <div className="mt-2 text-right">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render token filtering UI - more compact version
  const renderTokenFilters = () => {
    return (
      <div className="bg-white rounded-lg shadow-md mb-4">
        <div className="p-4 border-b border-gray-200">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">Filter Tokens</h3>
              {/* Display active filter count badge */}
              {(tokenFilters.status.length > 0 || 
                tokenFilters.types.length > 0 || 
                tokenFilters.dateRange.start || 
                tokenFilters.dateRange.end || 
                tokenFilters.merchant || 
                tokenFilters.searchQuery) && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tokenFilters.status.length + tokenFilters.types.length + 
                   (tokenFilters.dateRange.start ? 1 : 0) + 
                   (tokenFilters.dateRange.end ? 1 : 0) + 
                   (tokenFilters.merchant ? 1 : 0) + 
                   (tokenFilters.searchQuery ? 1 : 0)
                  } active
                </span>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange('clearAll', null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mr-3"
              >
                Clear All
              </button>
              <ChevronDownIcon 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} 
              />
            </div>
          </div>
          
          {/* Display active filters as tags */}
          {!isFiltersExpanded && (tokenFilters.status.length > 0 || 
            tokenFilters.types.length > 0 || 
            tokenFilters.dateRange.start || 
            tokenFilters.dateRange.end || 
            tokenFilters.merchant || 
            tokenFilters.searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-3 pb-1">
              {tokenFilters.status.map(status => (
                <span 
                  key={`status-${status}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                >
                  Status: {status}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('status', status);
                    }}
                  />
                </span>
              ))}
              
              {tokenFilters.types.map(type => (
                <span 
                  key={`type-${type}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                >
                  Type: {type}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('type', type);
                    }}
                  />
                </span>
              ))}
              
              {tokenFilters.dateRange.start && (
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700"
                >
                  From: {formatDate(tokenFilters.dateRange.start)}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('dateStart', '');
                    }}
                  />
                </span>
              )}
              
              {tokenFilters.dateRange.end && (
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700"
                >
                  To: {formatDate(tokenFilters.dateRange.end)}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('dateEnd', '');
                    }}
                  />
                </span>
              )}
              
              {tokenFilters.merchant && (
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
                >
                  Merchant: {tokenFilters.merchant}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('merchant', '');
                    }}
                  />
                </span>
              )}
              
              {tokenFilters.searchQuery && (
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"
                >
                  Search: {tokenFilters.searchQuery}
                  <XMarkIcon 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('searchQuery', '');
                    }}
                  />
                </span>
              )}
            </div>
          )}
        </div>
        
        {isFiltersExpanded && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter - Enhanced UI */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Active', 'Expired', 'Used', 'Shared'].map((status) => (
                    <label key={status} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={tokenFilters.status.includes(status)}
                        onChange={() => handleFilterChange('status', status)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-1"
                      />
                      <span className={`text-sm px-2 py-0.5 rounded-md ${
                        tokenFilters.status.includes(status) 
                          ? status === 'Active' ? 'bg-green-100 text-green-800' 
                          : status === 'Expired' ? 'bg-red-100 text-red-800'
                          : status === 'Used' ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                          : 'text-gray-700'
                      }`}>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Token Type Filter - Enhanced UI */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Token Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Coupon', 'Reward', 'ExtraBucks', 'Lightning'].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={tokenFilters.types.includes(type)}
                        onChange={() => handleFilterChange('type', type)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-1"
                      />
                      <span className={`text-sm px-2 py-0.5 rounded-md ${
                        tokenFilters.types.includes(type)
                          ? type === 'Coupon' ? 'bg-purple-100 text-purple-800'
                          : type === 'Reward' ? 'bg-blue-100 text-blue-800'
                          : type === 'ExtraBucks' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                          : 'text-gray-700'
                      }`}>
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter - Enhanced UI */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      value={tokenFilters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateStart', e.target.value)}
                      className={`w-full p-2 border rounded-md text-sm ${
                        tokenFilters.dateRange.start 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      value={tokenFilters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
                      className={`w-full p-2 border rounded-md text-sm ${
                        tokenFilters.dateRange.end 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Search and Merchant Filter - Enhanced UI */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tokenFilters.merchant}
                      onChange={(e) => handleFilterChange('merchant', e.target.value)}
                      placeholder="Filter by merchant name"
                      className={`w-full p-2 pl-8 border rounded-md text-sm ${
                        tokenFilters.merchant 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    <BuildingStorefrontIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    {tokenFilters.merchant && (
                      <XMarkIcon 
                        className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                        onClick={() => handleFilterChange('merchant', '')} 
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Tokens</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tokenFilters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      placeholder="Search by name or description"
                      className={`w-full p-2 pl-8 border rounded-md text-sm ${
                        tokenFilters.searchQuery 
                          ? 'border-yellow-300 bg-yellow-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    {tokenFilters.searchQuery && (
                      <XMarkIcon 
                        className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                        onClick={() => handleFilterChange('searchQuery', '')} 
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Filters</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleApplyPresetFilter('activeTokens')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 flex items-center"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  Active Tokens
                </button>
                <button
                  onClick={() => handleApplyPresetFilter('expiringSoon')}
                  className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-md text-sm hover:bg-yellow-100 flex items-center"
                >
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                  Expiring Soon
                </button>
                <button
                  onClick={() => handleApplyPresetFilter('recentlyUsed')}
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm hover:bg-gray-100 flex items-center"
                >
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></span>
                  Recently Used
                </button>
                <button
                  onClick={() => handleApplyPresetFilter('highValue')}
                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 flex items-center"
                >
                  <span className="text-xs mr-1.5 font-bold">$</span>
                  High Value Rewards
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsFiltersExpanded(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update renderTokenDetail to show support action history and dispute info
  const renderTokenDetail = () => {
    if (!selectedToken) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Token Details</h3>
              <button 
                onClick={() => dispatch(selectToken(null))}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedToken.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{selectedToken.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenStateBadgeColor(selectedToken.state)}`}>
                    {selectedToken.state}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenTypeBadgeColor(selectedToken.type)}`}>
                    {selectedToken.type}
                  </span>
                  {selectedToken.disputed && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Disputed
                    </span>
                  )}
                  {selectedToken.notHonored && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Not Honored
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-lg font-bold text-green-600">
                {selectedToken.value}
              </div>
            </div>
            
            <div className="border rounded-lg bg-gray-50 p-4 mb-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{selectedToken.state}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Claim Date</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(selectedToken.claimDate)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Expiration Date</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(selectedToken.expirationDate)}</dd>
                </div>
                {selectedToken.useDate && (
                  <div>
                    <dt className="text-gray-500">Used Date</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(selectedToken.useDate)}</dd>
                  </div>
                )}
                {selectedToken.shareDate && (
                  <div>
                    <dt className="text-gray-500">Shared Date</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(selectedToken.shareDate)}</dd>
                  </div>
                )}
                {selectedToken.merchantName && (
                  <div>
                    <dt className="text-gray-500">Merchant</dt>
                    <dd className="mt-1 text-gray-900">{selectedToken.merchantName}</dd>
                  </div>
                )}
                {selectedToken.merchantLocation && (
                  <div>
                    <dt className="text-gray-500">Location</dt>
                    <dd className="mt-1 text-gray-900">{selectedToken.merchantLocation}</dd>
                  </div>
                )}
              </dl>
            </div>
            
            {/* Support actions history */}
            {selectedToken.supportActions && (
              <div className="border rounded-lg bg-blue-50 p-4 mb-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Support Actions</h4>
                <dl className="grid grid-cols-1 gap-y-2 text-sm">
                  {selectedToken.supportActions.isReissued && (
                    <>
                      <div>
                        <dt className="text-blue-700">Reissued Date</dt>
                        <dd className="mt-1 text-blue-900">{formatDate(selectedToken.supportActions.reissuedDate || '')}</dd>
                      </div>
                      <div>
                        <dt className="text-blue-700">Reissued By</dt>
                        <dd className="mt-1 text-blue-900">{selectedToken.supportActions.reissuedBy}</dd>
                      </div>
                      <div>
                        <dt className="text-blue-700">Reason</dt>
                        <dd className="mt-1 text-blue-900">{selectedToken.supportActions.reissuedReason}</dd>
                      </div>
                      {selectedToken.supportActions.comments && (
                        <div>
                          <dt className="text-blue-700">Comments</dt>
                          <dd className="mt-1 text-blue-900">{selectedToken.supportActions.comments}</dd>
                        </div>
                      )}
                      {selectedToken.supportActions.originalTokenId && (
                        <div>
                          <dt className="text-blue-700">Original Token ID</dt>
                          <dd className="mt-1 text-blue-900">{selectedToken.supportActions.originalTokenId}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>
            )}
            
            {/* Dispute information */}
            {selectedToken.disputed && (
              <div className="border rounded-lg bg-orange-50 p-4 mb-6">
                <h4 className="text-sm font-medium text-orange-800 mb-2">Dispute Information</h4>
                <dl className="grid grid-cols-1 gap-y-2 text-sm">
                  <div>
                    <dt className="text-orange-700">Dispute Date</dt>
                    <dd className="mt-1 text-orange-900">{formatDate(selectedToken.disputeDate || '')}</dd>
                  </div>
                  <div>
                    <dt className="text-orange-700">Reason</dt>
                    <dd className="mt-1 text-orange-900">{selectedToken.disputeReason}</dd>
                  </div>
                  {selectedToken.notHonored && (
                    <div>
                      <dt className="text-orange-700">Store Status</dt>
                      <dd className="mt-1 text-orange-900">Token not honored by store</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {selectedToken.state === 'Active' && (
                <>
                  <button
                    onClick={() => removeTokenFromCustomerHandler(selectedToken.id)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md flex items-center justify-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-1.5" />
                    Remove Token
                  </button>
                  
                  <button
                    onClick={() => markTokenDisputedHandler(selectedToken.id)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md flex items-center justify-center"
                  >
                    <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
                    Mark Disputed
                  </button>
                </>
              )}
              
              {(selectedToken.state === 'Expired' || selectedToken.state === 'Used' || selectedToken.notHonored) && (
                <button
                  onClick={() => reissueTokenHandler(selectedToken.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center justify-center"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                  Reissue Token
                </button>
              )}
              
              {selectedToken.externalUrl && (
                <button
                  onClick={() => handleViewInExtraCare(selectedToken.externalUrl)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
                >
                  <ExternalLinkIcon className="h-4 w-4 mr-1.5" />
                  View in ExtraCare
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Token Catalog Modal
  const renderTokenCatalogModal = () => {
    if (!showTokenCatalog) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add Token to Customer</h3>
              <button 
                onClick={() => dispatch(toggleTokenCatalog())}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">
              Select a token to add to {selectedCustomer?.firstName} {selectedCustomer?.lastName}'s account.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokenCatalog.map((token) => (
                <div 
                  key={token.id}
                  className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => addTokenToCustomerHandler(token.id)}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{token.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenTypeBadgeColor(token.type)}`}>
                      {token.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{token.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600">{token.value}</span>
                    <span className="text-xs text-gray-500">Expires in {
                      Math.ceil((new Date(token.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    } days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add a confirmation modal
  const renderConfirmModal = () => {
    if (!showConfirmModal) return null;
    
    const getModalTitle = () => {
      switch (confirmAction) {
        case 'reissue': return 'Confirm Token Reissue';
        case 'remove': return 'Confirm Token Removal';
        case 'dispute': return 'Mark Token as Disputed';
        default: return 'Confirm Action';
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{getModalTitle()}</h3>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {confirmAction === 'remove' ? (
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to remove this token? This action cannot be undone.
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {confirmAction === 'reissue' ? 'Reissue Reason' : 'Dispute Reason'}
                  </label>
                  <select
                    value={confirmReason}
                    onChange={(e) => setConfirmReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a reason</option>
                    {confirmAction === 'reissue' ? (
                      <>
                        <option value="Store didn't honor">Store didn't honor</option>
                        <option value="Token expired prematurely">Token expired prematurely</option>
                        <option value="Technical issue">Technical issue</option>
                        <option value="Customer satisfaction">Customer satisfaction</option>
                        <option value="Other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Store didn't honor">Store didn't honor</option>
                        <option value="Token not working">Token not working</option>
                        <option value="Customer complaint">Customer complaint</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
                
                {confirmAction === 'dispute' && (
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notHonored}
                        onChange={(e) => setNotHonored(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Store didn't honor the token</span>
                    </label>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Comments
                  </label>
                  <textarea
                    value={confirmComments}
                    onChange={(e) => setConfirmComments(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Add any additional comments here..."
                    required={confirmAction === 'reissue'}
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={confirmAction !== 'remove' && !confirmReason}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  confirmAction === 'remove' 
                    ? 'bg-red-600 hover:bg-red-700'
                    : !confirmReason
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmAction === 'remove' ? 'Remove' : confirmAction === 'reissue' ? 'Reissue' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get the paginated customers for the current page
  const getPaginatedCustomers = () => {
    if (!customers.length) return [];
    
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = Math.min(startIndex + pagination.itemsPerPage, customers.length);
    
    return customers.slice(startIndex, endIndex);
  };
  
  // Helper function to generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // Show current page and 1 page before and after (if they exist)
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  
  // Render Pagination controls
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    const pageNumbers = getPageNumbers();
    
    return (
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, customers.length)} of {customers.length} customers
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`p-2 rounded-md border ${
              pagination.currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-500 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          {pageNumbers.map((number, index) => (
            <button
              key={index}
              onClick={() => typeof number === 'number' && handlePageChange(number)}
              disabled={typeof number !== 'number'}
              className={`min-w-[40px] h-10 px-3.5 rounded-md ${
                pagination.currentPage === number
                ? 'bg-blue-600 text-white'
                : typeof number === 'number'
                  ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 border-none'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`p-2 rounded-md border ${
              pagination.currentPage === pagination.totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-500 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };
  
  // Render per page selector
  const renderPerPageSelector = () => {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Show</span>
        <select 
          value={pagination.itemsPerPage}
          onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
          className="border border-gray-300 rounded-md px-2 py-1 text-gray-700"
        >
          {[10, 20, 50].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <span>per page</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-4 p-3 rounded-lg ${
            actionMessage.type === 'success' ? 'bg-green-100 text-green-800' :
            actionMessage.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {actionMessage.text}
          </div>
        )}

        {/* Breadcrumbs navigation */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button 
                onClick={backToMainView} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Customer Lookup
              </button>
            </li>
            {viewState === 'detail' && selectedCustomer && (
              <>
                <li className="text-gray-500">/</li>
                <li className="text-gray-700 font-medium">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </li>
              </>
            )}
          </ol>
        </nav>

        {viewState === 'main' ? (
          /* Main View: Customer Search & Table */
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Lookup</h2>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name, email, phone, or ExtraCare ID..."
                  className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              
              <button 
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {customerResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Results ({customerResults.length})</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {customerResults.map((customer) => (
                    <div 
                      key={customer.id}
                      className="border-b border-gray-200 last:border-0 p-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => selectCustomerHandler(customer.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            <HighlightedText 
                              text={`${customer.firstName} ${customer.lastName}`} 
                              searchTerm={searchQuery} 
                            />
                          </p>
                          <p className="text-sm text-gray-500">
                            <HighlightedText 
                              text={customer.email} 
                              searchTerm={searchQuery} 
                            /> • <HighlightedText 
                              text={customer.phone} 
                              searchTerm={searchQuery} 
                            />
                          </p>
                          <p className="text-xs text-gray-500">
                            ExtraCare ID: <HighlightedText 
                              text={customer.extraCareId} 
                              searchTerm={searchQuery} 
                            />
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Account Created: {formatDate(customer.accountCreated)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced empty state */}
            {hasSearched && searchQuery && customerResults.length === 0 && (
              <div className="mt-6 p-8 bg-gray-50 rounded-lg text-center">
                <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                <p className="text-gray-500 mb-4">We couldn't find any customers matching '{searchQuery}'</p>
                <p className="text-sm text-gray-600">
                  Try with a different search term or check for typos
                </p>
              </div>
            )}
            
            {/* Initial empty state with pagination */}
            {!hasSearched && !searchQuery && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold">Customers</h3>
                  {renderPerPageSelector()}
                </div>
                {isClient ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ExtraCare ID</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getPaginatedCustomers().map((customer) => (
                          <tr 
                            key={customer.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => selectCustomerHandler(customer.id)}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 h-10 w-10 ${
                                  customer.id === 'cust004' ? 'bg-purple-500' : 
                                  customer.id === 'cust005' ? 'bg-pink-500' : 
                                  customer.id === 'cust006' ? 'bg-yellow-500' : 
                                  'bg-[#2563EB]'
                                } rounded-full flex items-center justify-center text-white`}>
                                  {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                                  <div className="text-sm text-gray-500">{customer.email}</div>
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{customer.extraCareId}</div>
                              <div className="text-xs text-gray-500">Created: {formatDate(customer.accountCreated)}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active: {customer.tokens.filter(t => t.state === 'Active').length}
                                </span>
                                {customer.tokens.filter(t => t.state === 'Expired').length > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Expired: {customer.tokens.filter(t => t.state === 'Expired').length}
                                  </span>
                                )}
                                {customer.tokens.filter(t => t.state === 'Used').length > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Used: {customer.tokens.filter(t => t.state === 'Used').length}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.tokens.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {customer.tokens.length > 0 ? 'Active' : 'No Tokens'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-blue-600 hover:text-blue-800">
                              <button 
                                className="font-medium"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click from firing
                                  selectCustomerHandler(customer.id);
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Show a loading/skeleton state until client is ready */
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-16 bg-gray-200 rounded mb-2"></div>
                  </div>
                )}
                
                {/* Pagination - only show when client-side */}
                {isClient && renderPagination()}
              </div>
            )}
          </div>
        ) : (
          /* Detail View: Customer Details and Token Management - REDESIGNED */
          selectedCustomer && (
            <div className="p-6 pt-0">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <button
                    onClick={backToMainView}
                    className="mr-4 hover:bg-gray-100 p-2 rounded-md transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <h3 className="text-xl font-bold text-gray-900">Customer Token Management</h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(toggleTokenCatalog())}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="flex items-center">
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      Add Token
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Customer Profile */}
                <div className="lg:col-span-1">
                  {renderCustomerProfile()}
                </div>
                
                {/* Right Column: Token Management */}
                <div className="lg:col-span-2">
                  {/* Token Filters */}
                  {renderTokenFilters()}
                  
                  {/* Token List */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="border-b border-gray-200 p-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Token Inventory
                          {tokenFilters.status.length > 0 || tokenFilters.types.length > 0 || 
                           tokenFilters.dateRange.start || tokenFilters.dateRange.end || 
                           tokenFilters.merchant || tokenFilters.searchQuery ? (
                            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              Filtered
                            </span>
                          ) : null}
                        </h2>
                        <span className="text-sm text-gray-500">
                          Showing {filteredTokens.length} of {selectedCustomer.tokens.length} tokens
                        </span>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200 px-4">
                      {filteredTokens.length === 0 ? (
                        <div className="py-8 text-center">
                          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No tokens found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {selectedCustomer.tokens.length === 0 
                              ? "This customer has no tokens in their account." 
                              : "No tokens match the current filter criteria."}
                          </p>
                          {selectedCustomer.tokens.length > 0 && (
                            <div className="mt-6">
                              <button
                                onClick={() => handleFilterChange('clearAll', null)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Clear Filters
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        filteredTokens.map((token) => (
                          <div key={token.id} className="py-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">{token.name}</h3>
                                <p className="mt-1 text-xs text-gray-500 truncate">{token.description}</p>
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <span>Expires: {formatDate(token.expirationDate)}</span>
                                  {token.merchantName && (
                                    <>
                                      <span className="mx-2">&middot;</span>
                                      <BuildingStorefrontIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      <span>{token.merchantName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col items-end space-y-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getTokenStateBadgeColor(token.state)}`}>
                                  {token.state}
                                </span>
                                <span className="inline-flex items-center text-sm">
                                  <span className={`font-medium ${token.value.includes('$') ? 'text-green-600' : 'text-blue-600'}`}>
                                    {token.value}
                                  </span>
                                </span>
                                <button
                                  onClick={() => dispatch(selectToken(token.id))}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  View details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">
              &copy; 2023 Kigo + CVS Pharmacy. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              Support Portal v1.2.3
            </p>
          </div>
        </div>
      </footer>

      {/* Token Detail Modal */}
      {renderTokenDetail()}

      {/* Token Catalog Modal */}
      {renderTokenCatalogModal()}

      {/* Confirmation Modal */}
      {renderConfirmModal()}
    </div>
  );
} 