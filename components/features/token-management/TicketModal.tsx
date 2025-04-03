'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  DialogClose 
} from "@/components/molecules/dialog";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  toggleTicketModal, 
  createTicket, 
  TicketPriority,
  TicketInfo
} from '@/lib/redux/slices/cvsTokenSlice';
import { useDemo } from '@/contexts/DemoContext';
import { 
  MagnifyingGlassIcon, 
  UserIcon,
  CircleStackIcon,
  LinkIcon,
  ArrowsRightLeftIcon,
  BuildingStorefrontIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Utility to highlight matching text in search results
const HighlightedText = ({ text, searchTerm }: { text: string, searchTerm: string }) => {
  if (!searchTerm.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <span key={i} className="bg-yellow-100">{part}</span> : <span key={i}>{part}</span>
      )}
    </>
  );
};

const TicketModal = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useDemo();
  const { isTicketModalOpen } = useAppSelector(state => state.cvsToken);
  const { features } = useAppSelector(state => state.featureConfig);
  const { tokens, customers } = useAppSelector(state => state.cvsToken);
  
  // Debug logs to verify data
  useEffect(() => {
    if (isTicketModalOpen) {
      console.log(`Loaded ${customers.length} customers from Redux store`);
      console.log(`Loaded ${tokens.length} tokens from Redux store`);
    }
  }, [isTicketModalOpen, customers.length, tokens.length]);
  
  // Ticket form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [externalTicketId, setExternalTicketId] = useState<string>('');
  
  // Feature flags
  const useExternalSystem = features?.ticketing?.useExternalSystem || false;
  const externalSystemName = features?.ticketing?.externalSystemName || 'External System';
  const requireCustomerId = features?.ticketing?.requireCustomerId || false;
  
  // Customer search state
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const debouncedCustomerSearchTerm = useDebounce(customerSearchTerm, 300);
  const [customerSearchResults, setCustomerSearchResults] = useState<Array<{id: string, name: string, email: string}>>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  
  // Token search state
  const [tokenSearchTerm, setTokenSearchTerm] = useState('');
  const debouncedTokenSearchTerm = useDebounce(tokenSearchTerm, 300);
  const [tokenSearchResults, setTokenSearchResults] = useState<Array<any>>([]);
  const [isSearchingToken, setIsSearchingToken] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  
  // External system state
  const [isCreatingExternal, setIsCreatingExternal] = useState(false);
  const [externalSystemError, setExternalSystemError] = useState<string | null>(null);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isTicketModalOpen) {
      resetForm();
    }
  }, [isTicketModalOpen]);
  
  const resetForm = () => {
    setSubject('');
    setDescription('');
    setPriority('Medium');
    setTokenId(null);
    setCustomerId('');
    setExternalTicketId('');
    setCustomerSearchTerm('');
    setCustomerSearchResults([]);
    setTokenSearchTerm('');
    setTokenSearchResults([]);
    setExternalSystemError(null);
  };
  
  // Search for customers based on debounced search term
  useEffect(() => {
    if (!debouncedCustomerSearchTerm.trim()) {
      setCustomerSearchResults([]);
      return;
    }
    
    setIsSearchingCustomer(true);
    
    // Search from Redux store
    const query = debouncedCustomerSearchTerm.toLowerCase();
    
    // Adding a slight delay to simulate database search
    setTimeout(() => {
      const results = customers
        .filter(customer => 
          customer.email.toLowerCase().includes(query) ||
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.extraCareId.includes(query)
        )
        .slice(0, 5) // Limit to 5 results for better UX
        .map(customer => ({
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email
        }));
      
      console.log(`Found ${results.length} customer matches for "${query}"`);
      setCustomerSearchResults(results);
      setIsSearchingCustomer(false);
    }, 200);
  }, [debouncedCustomerSearchTerm, customers]);
  
  // Select a customer
  const selectCustomer = (customer: {id: string, name: string, email: string}) => {
    setCustomerId(customer.id);
    setCustomerSearchResults([]);
    setCustomerSearchTerm('');
  };
  
  // Search for tokens based on debounced search term
  useEffect(() => {
    if (!debouncedTokenSearchTerm.trim()) {
      setTokenSearchResults([]);
      return;
    }
    
    setIsSearchingToken(true);
    
    // Filter from Redux state
    const query = debouncedTokenSearchTerm.toLowerCase();
    
    // Adding a slight delay to simulate database search
    setTimeout(() => {
      const results = tokens.filter(token => 
        token.tokenId.toLowerCase().includes(query) ||
        token.deviceId.toLowerCase().includes(query) ||
        (token.customerId && typeof token.customerId === 'string' && token.customerId.toLowerCase().includes(query))
      ).slice(0, 5);
      
      console.log(`Found ${results.length} token matches for "${query}"`);
      setTokenSearchResults(results);
      setIsSearchingToken(false);
    }, 200);
  }, [debouncedTokenSearchTerm, tokens]);
  
  // Select a token
  const selectToken = (token: any) => {
    setTokenId(token.tokenId);
    // If we have a token with customer ID but no customer ID is set yet, use the token's customer ID
    if (token.customerId && !customerId) {
      setCustomerId(token.customerId);
    }
    setTokenSearchResults([]);
    setTokenSearchTerm('');
  };
  
  // Create external system ticket
  const createExternalSystemTicket = async (): Promise<string> => {
    setIsCreatingExternal(true);
    setExternalSystemError(null);
    
    return new Promise((resolve, reject) => {
      // Simulate API call with timeout
      setTimeout(() => {
        // 90% chance of success, 10% chance of error for demo
        if (Math.random() > 0.1) {
          // Generate fake ticket ID
          const ticketId = `EXT-${Math.floor(Math.random() * 100000)}`;
          setExternalTicketId(ticketId);
          setIsCreatingExternal(false);
          resolve(ticketId);
        } else {
          // Simulate error
          setExternalSystemError(`Could not connect to ${externalSystemName}. Please try again.`);
          setIsCreatingExternal(false);
          reject(new Error(`Failed to create ticket in ${externalSystemName}`));
        }
      }, 1500);
    });
  };
  
  // Handle create ticket
  const handleCreateTicket = async () => {
    // Validation
    if (!subject.trim() || !description.trim()) {
      // Check if we should proceed with external system integration
      if (useExternalSystem) {
        if (confirm(`Required fields are missing. Continue without creating an external ticket?`)) {
          // Continue without external ticket
        } else {
          return;
        }
      } else {
        alert(`Please fill in all required fields`);
        return;
      }
    }
    
    // Create external ticket if feature is enabled
    let externalId: string | null = null;
    if (useExternalSystem) {
      try {
        // Attempt to create external ticket
        externalId = await createExternalSystemTicket();
      } catch (error) {
        // External ticket creation failed, but user might want to create local ticket anyway
        if (!confirm(`External ticket creation failed. Create local ticket anyway?`)) {
          return;
        }
      }
    }
    
    // Create the ticket in our system
    dispatch(createTicket({
      subject,
      description,
      priority,
      tokenId: tokenId || undefined,
      customerId: customerId || "",
      assignedTo: userProfile?.userName || 'Agent',
      status: 'Open', // Add the required status field
      tier: 'Tier1'   // Add the required tier field
    }));
    
    // Close the modal
    dispatch(toggleTicketModal());
  };
  
  return (
    <Dialog open={isTicketModalOpen} onOpenChange={() => dispatch(toggleTicketModal())}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Support Ticket</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* External System Integration */}
          {useExternalSystem && (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <ArrowsRightLeftIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Integration with {externalSystemName}</h3>
                  <p className="text-xs text-blue-600 mt-1">
                    This ticket will be synchronized with your {externalSystemName} account.
                  </p>
                  
                  {externalTicketId ? (
                    <div className="mt-2 flex items-center">
                      <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-700">External Ticket: {externalTicketId}</span>
                    </div>
                  ) : isCreatingExternal ? (
                    <div className="mt-2 flex items-center">
                      <ArrowPathIcon className="h-4 w-4 text-blue-500 mr-1 animate-spin" />
                      <span className="text-sm text-blue-700">Creating external ticket...</span>
                    </div>
                  ) : externalSystemError ? (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-700">{externalSystemError}</span>
                      </div>
                      <button 
                        onClick={() => createExternalSystemTicket()}
                        className="mt-1 text-xs text-blue-700 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          
          {/* Ticket Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                <Input
                  id="subject"
                  placeholder="Brief summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Customer Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              Customer Information {requireCustomerId && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            {customerId ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                <div>
                  <span className="text-sm font-medium">Customer ID: {customerId}</span>
                  {/* Show customer name if available */}
                  {(() => {
                    const foundCustomer = customers.find(c => c.id === customerId);
                    return foundCustomer && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({foundCustomer.firstName} {foundCustomer.lastName})
                      </span>
                    );
                  })()}
                </div>
                <button 
                  onClick={() => setCustomerId('')}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="mt-2 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search by name, email, phone, or ExtraCare ID..."
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {isSearchingCustomer && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {customerSearchTerm && !isSearchingCustomer && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        onClick={() => setCustomerSearchTerm('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {customerSearchResults.length > 0 && (
                  <div className="absolute mt-1 w-full border border-gray-200 rounded-md overflow-hidden shadow-lg bg-white z-10">
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {customerSearchResults.map((customer) => (
                        <li 
                          key={customer.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => selectCustomer(customer)}
                        >
                          <div className="flex items-center">
                            <UserIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium">
                                <HighlightedText 
                                  text={customer.name} 
                                  searchTerm={customerSearchTerm}
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {customer.id} • <HighlightedText 
                                  text={customer.email} 
                                  searchTerm={customerSearchTerm}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {customerSearchTerm && customerSearchResults.length === 0 && !isSearchingCustomer && (
                  <div className="mt-2 text-sm text-gray-500 italic p-2 bg-gray-50 rounded border border-gray-200">
                    No customers found matching "{customerSearchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Token Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CircleStackIcon className="h-4 w-4 mr-1" />
              Link Token (Optional)
            </h3>
            
            {tokenId ? (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-200">
                <div>
                  <span className="text-sm font-medium text-blue-700">Token ID: {tokenId}</span>
                </div>
                <button 
                  onClick={() => setTokenId(null)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Unlink
                </button>
              </div>
            ) : (
              <div className="mt-2 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search tokens by ID, device ID, or customer ID"
                    value={tokenSearchTerm}
                    onChange={(e) => setTokenSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {isSearchingToken && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {tokenSearchTerm && !isSearchingToken && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        onClick={() => setTokenSearchTerm('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {tokenSearchResults.length > 0 && (
                  <div className="absolute mt-1 w-full border border-gray-200 rounded-md overflow-hidden shadow-lg bg-white z-10">
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {tokenSearchResults.map((token) => (
                        <li 
                          key={token.tokenId}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => selectToken(token)}
                        >
                          <div className="flex items-center">
                            <CircleStackIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium">
                                <HighlightedText 
                                  text={token.tokenId} 
                                  searchTerm={tokenSearchTerm}
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                Device: <HighlightedText 
                                  text={token.deviceId} 
                                  searchTerm={tokenSearchTerm}
                                />
                                {token.customerId && 
                                  <> • Customer: <HighlightedText 
                                    text={String(token.customerId)} 
                                    searchTerm={tokenSearchTerm}
                                  /></>
                                }
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {tokenSearchTerm && tokenSearchResults.length === 0 && !isSearchingToken && (
                  <div className="mt-2 text-sm text-gray-500 italic p-2 bg-gray-50 rounded border border-gray-200">
                    No tokens found matching "{tokenSearchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Support Tier Information */}
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-blue-800">Tier 1 Support (CVS)</div>
                <p className="text-xs text-blue-600">
                  This ticket will be created in Tier 1 support. You can escalate to Tier 2 (Kigo PRO) if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch(toggleTicketModal())}>
            Cancel
          </Button>
          <Button onClick={handleCreateTicket}>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal; 