/**
 * @view TokenManagementView
 * @description A view for managing customer tokens and support tickets
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Image from 'next/image';
import Card from '@/components/atoms/Card/Card';
import StandardDashboard from '@/components/shared/StandardDashboard';
import TokenList from '@/components/organisms/TokenList';
import TicketList from '@/components/organisms/TicketList';
import { TokenStateBadge, TicketBadge, TierBadge } from '@/components/molecules/badges';
import { 
  Token, 
  Account, 
  TicketInfo, 
  TicketStatus,
  TokenState,
  SupportTier,
  formatDate,
  formatShortDate,
  generateTokenId,
  calculateExpirationDate
} from '@/lib/token-management';

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

// Sample tickets
const sampleTickets: TicketInfo[] = [
  {
    id: 'TCKT-1001',
    subject: 'Unable to redeem coupon',
    description: 'Customer reports they cannot redeem their ExtraBucks coupon at the store.',
    status: 'Open',
    priority: 'High',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T10:30:00',
    assignedTo: 'Sarah Johnson',
    tier: 'Tier1',
    tokenId: 'TKN-1001',
    customerName: 'John Smith'
  },
  {
    id: 'TCKT-1002',
    subject: 'Missing rewards points',
    description: 'Customer says their reward points from last purchase are not showing up.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2023-06-14T14:45:00',
    updatedAt: '2023-06-15T09:15:00',
    assignedTo: 'Mike Thompson',
    tier: 'Tier1',
    tokenId: 'TKN-1003',
    customerName: 'Maria Garcia'
  },
  {
    id: 'TCKT-1003',
    subject: 'App crashes during checkout',
    description: 'Customer experiencing app crashes when trying to complete purchase with digital coupon.',
    status: 'Escalated',
    priority: 'High',
    createdAt: '2023-06-13T08:20:00',
    updatedAt: '2023-06-15T11:30:00',
    assignedTo: 'Technical Support',
    tier: 'Tier2',
    customerName: 'Robert Chen'
  },
  {
    id: 'TCKT-1004',
    subject: 'Wrong coupon amount applied',
    description: 'Customer reports $5 coupon only gave $2 discount at checkout.',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '2023-06-12T16:10:00',
    updatedAt: '2023-06-14T15:45:00',
    assignedTo: 'Sarah Johnson',
    tier: 'Tier1',
    tokenId: 'TKN-1002',
    customerName: 'Samantha Lee'
  }
];

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
      <span className={`mr-1 ${getPriorityStyles()}`}>●</span>
      <span className={`text-xs ${getPriorityStyles()}`}>{priority}</span>
    </div>
  );
}

export default function TokenManagementView() {
  const { clientName, version } = useDemo();
  const [currentTab, setCurrentTab] = useState('tokens');
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [allTokens, setAllTokens] = useState<Token[]>([...sampleTokens]);
  const [allTickets, setAllTickets] = useState<TicketInfo[]>([...sampleTickets]);
  
  // Find selected token
  const selectedToken = selectedTokenId 
    ? allTokens.find(token => token.id === selectedTokenId) || null
    : null;
    
  // Find selected ticket
  const selectedTicket = selectedTicketId
    ? allTickets.find(ticket => ticket.id === selectedTicketId) || null
    : null;
    
  // Associated ticket for selected token
  const associatedTicket = selectedToken
    ? allTickets.find(ticket => ticket.tokenId === selectedToken.id) || null
    : null;
    
  // Token for selected ticket
  const ticketToken = selectedTicket?.tokenId
    ? allTokens.find(token => token.id === selectedTicket.tokenId) || null
    : null;
  
  // Account search
  useEffect(() => {
    if (searchTerm.length >= 3) {
      // Find account by email, name, or phone
      const foundAccount = sampleAccounts.find(account => 
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${account.firstName} ${account.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.mobileNumber.includes(searchTerm)
      );
      
      setCurrentAccount(foundAccount || null);
    } else {
      setCurrentAccount(null);
    }
  }, [searchTerm]);

  // Add token to account
  const addTokenToAccount = (token: Token) => {
    if (!currentAccount) return;
    
    // Update account's tokens
    const updatedAccount = {
      ...currentAccount,
      tokens: [...currentAccount.tokens, token]
    };
    
    // Update account in accounts list
    const updatedAccounts = sampleAccounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    );
    
    // Add token to all tokens if not already there
    if (!allTokens.some(t => t.id === token.id)) {
      setAllTokens([...allTokens, token]);
    }
    
    setCurrentAccount(updatedAccount);
  };
  
  // Remove token from account
  const removeTokenFromAccount = (tokenId: string) => {
    if (!currentAccount) return;
    
    // Update account's tokens
    const updatedAccount = {
      ...currentAccount,
      tokens: currentAccount.tokens.filter(token => token.id !== tokenId)
    };
    
    // Update account in accounts list
    const updatedAccounts = sampleAccounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    );
    
    setCurrentAccount(updatedAccount);
    
    // Deselect token if it was selected
    if (selectedTokenId === tokenId) {
      setSelectedTokenId(null);
    }
  };
  
  // Reissue token
  const reissueToken = (oldToken: Token) => {
    if (!oldToken) return;
    
    // Mark old token as expired
    const updatedTokens = allTokens.map(token => 
      token.id === oldToken.id ? { ...token, state: 'Expired' as TokenState } : token
    );
    
    // Create new token with most properties from old token
    const newToken: Token = {
      id: generateTokenId(),
      name: oldToken.name,
      description: oldToken.description,
      imageUrl: oldToken.imageUrl,
      state: 'Active',
      claimDate: new Date().toISOString(),
      expirationDate: calculateExpirationDate(),
      merchantName: oldToken.merchantName,
      merchantLocation: oldToken.merchantLocation,
      supportActions: {
        isReissued: true,
        reissuedDate: new Date().toISOString(),
        reissuedBy: 'Support Agent',
        reissuedReason: 'Customer request',
        originalTokenId: oldToken.id,
        tier: 'Tier1'
      }
    };
    
    // Add new token to list
    setAllTokens([...updatedTokens, newToken]);
    
    // If token belongs to current account, add it there too
    if (currentAccount && currentAccount.tokens.some(t => t.id === oldToken.id)) {
      const updatedAccount = {
        ...currentAccount,
        tokens: [
          ...currentAccount.tokens.map(t => 
            t.id === oldToken.id ? { ...t, state: 'Expired' as TokenState } : t
          ),
          newToken
        ]
      };
      
      setCurrentAccount(updatedAccount);
    }
    
    // Select the new token
    setSelectedTokenId(newToken.id);
  };
  
  // Create support ticket
  const createSupportTicket = (tokenId: string, subject: string, description: string) => {
    if (!currentAccount) return;
    
    const customerName = `${currentAccount.firstName} ${currentAccount.lastName}`;
    
    // Create new ticket
    const newTicket: TicketInfo = {
      id: `TCKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      description,
      status: 'Open',
      priority: 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      tier: 'Tier1',
      tokenId,
      customerName
    };
    
    // Add ticket to list
    setAllTickets([...allTickets, newTicket]);
    
    // Switch to tickets tab and select new ticket
    setCurrentTab('tickets');
    setSelectedTicketId(newTicket.id);
  };
  
  return (
    <StandardDashboard 
      clientName={clientName || 'CVS'}
      currentPage="token-management" 
      version={version}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Token Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage customer tokens and support tickets
          </p>
        </div>
        
        {/* Search Section */}
        <Card className="mb-8">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Customer Search</h2>
            <div className="flex">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                  placeholder="Search by email, name, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Customer Details Section */}
        {currentAccount && (
          <Card className="mb-8">
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{currentAccount.firstName} {currentAccount.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{currentAccount.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{currentAccount.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Since</p>
                  <p className="font-medium">{formatShortDate(currentAccount.creationDate)}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Tabs */}
        <div className="mb-4 border-b">
          <div className="flex -mb-px">
            <button
              className={`py-2 px-4 text-center ${
                currentTab === 'tokens'
                  ? 'border-b-2 border-[#cc0000] text-[#cc0000] font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setCurrentTab('tokens')}
            >
              Tokens
            </button>
            <button
              className={`py-2 px-4 text-center ${
                currentTab === 'tickets'
                  ? 'border-b-2 border-[#cc0000] text-[#cc0000] font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setCurrentTab('tickets')}
            >
              Support Tickets
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token/Ticket List */}
          <div className="lg:col-span-1">
            {currentTab === 'tokens' ? (
              // Token List
              <TokenList 
                tokens={currentAccount ? currentAccount.tokens : allTokens}
                onSelectToken={(token) => setSelectedTokenId(token.id)}
                selectedTokenId={selectedTokenId || undefined}
              />
            ) : (
              // Ticket List
              <TicketList
                tickets={allTickets}
                onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
                selectedTicketId={selectedTicketId || undefined}
              />
            )}
          </div>
          
          {/* Token/Ticket Details */}
          <div className="lg:col-span-2">
            {currentTab === 'tokens' && selectedToken ? (
              // Token Details
              <Card>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedToken.name}</h2>
                      <p className="text-sm text-gray-600">{selectedToken.description}</p>
                    </div>
                    <TokenStateBadge state={selectedToken.state} />
                  </div>
                  
                  {selectedToken.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <div className="w-full max-w-md overflow-hidden rounded-lg">
                        <Image
                          src={selectedToken.imageUrl}
                          alt={selectedToken.name}
                          width={400}
                          height={200}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Token ID</p>
                      <p className="font-medium">{selectedToken.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{selectedToken.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Claim Date</p>
                      <p className="font-medium">{formatDate(selectedToken.claimDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="font-medium">{formatDate(selectedToken.expirationDate)}</p>
                    </div>
                    {selectedToken.useDate && (
                      <div>
                        <p className="text-sm text-gray-500">Use Date</p>
                        <p className="font-medium">{formatDate(selectedToken.useDate)}</p>
                      </div>
                    )}
                    {selectedToken.shareDate && (
                      <div>
                        <p className="text-sm text-gray-500">Share Date</p>
                        <p className="font-medium">{formatDate(selectedToken.shareDate)}</p>
                      </div>
                    )}
                    {selectedToken.merchantName && (
                      <div>
                        <p className="text-sm text-gray-500">Merchant</p>
                        <p className="font-medium">{selectedToken.merchantName}</p>
                      </div>
                    )}
                    {selectedToken.merchantLocation && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{selectedToken.merchantLocation}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Support Actions */}
                  {selectedToken.state === 'Active' && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-md font-semibold mb-2">Support Actions</h3>
                      <div className="flex space-x-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                          onClick={() => reissueToken(selectedToken)}
                        >
                          Reissue Token
                        </button>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm"
                          onClick={() => createSupportTicket(
                            selectedToken.id,
                            `Support request for ${selectedToken.name}`,
                            `Customer needs assistance with token ${selectedToken.id}`
                          )}
                        >
                          Create Support Ticket
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Associated Ticket */}
                  {associatedTicket && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-md font-semibold mb-2">Associated Support Ticket</h3>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{associatedTicket.subject}</p>
                            <p className="text-xs text-gray-500">{associatedTicket.id}</p>
                          </div>
                          <TicketBadge status={associatedTicket.status} />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{associatedTicket.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <PriorityIndicator priority={associatedTicket.priority} />
                          <p className="text-xs text-gray-500">
                            Created: {formatShortDate(associatedTicket.createdAt)}
                          </p>
                        </div>
                        <button
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => {
                            setCurrentTab('tickets');
                            setSelectedTicketId(associatedTicket.id);
                          }}
                        >
                          View Ticket Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : currentTab === 'tickets' && selectedTicket ? (
              // Ticket Details
              <Card>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedTicket.subject}</h2>
                      <p className="text-sm text-gray-500">{selectedTicket.id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TicketBadge status={selectedTicket.status} />
                      <TierBadge tier={selectedTicket.tier} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{selectedTicket.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <PriorityIndicator priority={selectedTicket.priority} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(selectedTicket.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium">{selectedTicket.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{selectedTicket.customerName || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Associated Token */}
                  {ticketToken && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-md font-semibold mb-2">Associated Token</h3>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{ticketToken.name}</p>
                            <p className="text-xs text-gray-500">{ticketToken.id}</p>
                          </div>
                          <TokenStateBadge state={ticketToken.state} />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{ticketToken.description}</p>
                        <button
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => {
                            setCurrentTab('tokens');
                            setSelectedTokenId(ticketToken.id);
                          }}
                        >
                          View Token Details
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Support Actions */}
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-md font-semibold mb-2">Support Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.status !== 'Closed' && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                          Update Status
                        </button>
                      )}
                      {selectedTicket.status !== 'Escalated' && selectedTicket.tier === 'Tier1' && (
                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-md text-sm">
                          Escalate to Tier 2
                        </button>
                      )}
                      {ticketToken && ticketToken.state === 'Active' && (
                        <button 
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
                          onClick={() => reissueToken(ticketToken)}
                        >
                          Reissue Associated Token
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              // No selection
              <Card>
                <div className="p-10 text-center text-gray-500">
                  {currentTab === 'tokens' ? (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No token selected</h3>
                      <p className="mt-1 text-sm text-gray-500">Select a token to view its details</p>
                    </>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No ticket selected</h3>
                      <p className="mt-1 text-sm text-gray-500">Select a ticket to view its details</p>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </StandardDashboard>
  );
} 