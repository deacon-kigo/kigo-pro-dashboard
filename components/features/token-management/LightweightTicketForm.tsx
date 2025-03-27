'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  createLightweightTicket, 
  TicketPriority,
  TokenInfo
} from '@/lib/redux/slices/cvsTokenSlice';
import { 
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { MentionsInput, Mention } from 'react-mentions';

// Custom styles for mentions
const mentionsInputStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
  },
  input: {
    margin: 0,
    padding: '8px 12px',
    overflow: 'auto',
    minHeight: '75px',
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
      borderRadius: '0.375rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    item: {
      padding: '8px 12px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#f3f4f6',
      },
    },
  },
  highlighter: {
    overflow: 'hidden',
    minHeight: '75px',
  },
};

// Custom styles for mention tokens
const mentionStyle = {
  backgroundColor: '#ebf5ff',
  color: '#2563eb',
  borderRadius: '0.25rem',
  padding: '0 0.25rem',
  margin: '0 1px',
  display: 'inline-block',
  border: '1px solid #bfdbfe',
};

type LightweightTicketFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
};

const LightweightTicketForm: React.FC<LightweightTicketFormProps> = ({
  onSuccess,
  onCancel,
  autoFocus = true
}) => {
  const dispatch = useAppDispatch();
  
  // Use Redux feature config
  const { features } = useAppSelector(state => state.featureConfig);
  const { selectedCustomer, selectedToken, customers, tokens } = useAppSelector(state => state.cvsToken);
  
  // Extract all tokens from customers for global search
  const allTokens = useMemo(() => {
    const tokenArray: TokenInfo[] = [];
    
    // Add tokens from the direct tokens array
    if (tokens) {
      // This assumes tokens array contains TokenInfo objects
      // You might need to adapt this based on the actual structure
      tokenArray.push(...tokens.map((t: any) => ({
        id: t.tokenId,
        name: t.tokenId,
        description: t.deviceId,
        type: 'Coupon' as 'Coupon' | 'Reward' | 'ExtraBucks' | 'Lightning', // Explicitly cast to the expected union type
        state: 'Active' as TokenInfo['state'],
        value: '',
        claimDate: '',
        expirationDate: ''
      })));
    }
    
    // Add tokens from each customer
    customers.forEach(customer => {
      if (customer.tokens) {
        tokenArray.push(...customer.tokens);
      }
    });
    
    return tokenArray;
  }, [customers, tokens]);
  
  // State management with direct value updates for performance
  const [subject, setSubject] = useState(selectedToken ? `Issue with ${selectedToken.name}` : '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  
  // Token search state
  const [tokenSearchTerm, setTokenSearchTerm] = useState('');
  const [tokenSearchResults, setTokenSearchResults] = useState<TokenInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSearchToken, setSelectedSearchToken] = useState<TokenInfo | null>(selectedToken);
  
  // Memoize token search results for better performance
  // This runs the search logic without any setTimeout for instant results
  useEffect(() => {
    if (!tokenSearchTerm.trim()) {
      setTokenSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Filter from all available tokens
    const query = tokenSearchTerm.toLowerCase();
    const matchingTokens = allTokens.filter(token => 
      token.name.toLowerCase().includes(query) || 
      (token.description && token.description.toLowerCase().includes(query)) ||
      token.id.toLowerCase().includes(query) ||
      token.type.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results for better UI
    
    setTokenSearchResults(matchingTokens);
    setIsSearching(false);
  }, [tokenSearchTerm, allTokens]);
  
  // Select a token from search results
  const selectToken = useCallback((token: TokenInfo) => {
    setSelectedSearchToken(token);
    setSubject(`Issue with ${token.name}`);
    setTokenSearchTerm('');
    setTokenSearchResults([]);
  }, []);
  
  const clearSelectedToken = useCallback(() => {
    setSelectedSearchToken(null);
    setSubject('');
  }, []);
  
  // Fetch matching tokens for mentions - using allTokens for global search
  const fetchTokenSuggestions = useCallback((query: string, callback: (data: any[]) => void) => {
    const matches = allTokens
      .filter(token => 
        token.name.toLowerCase().includes(query.toLowerCase()) ||
        token.type.toLowerCase().includes(query.toLowerCase()) ||
        (token.value && token.value.toLowerCase().includes(query.toLowerCase()))
      )
      .map(token => ({
        id: token.id,
        display: token.name
      }));
    
    callback(matches);
  }, [allTokens]);
  
  // Render token suggestion
  const renderTokenSuggestion = useCallback((
    suggestion: any,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean
  ) => {
    // Find the token data to display additional information
    const token = allTokens.find(t => t.id === suggestion.id);
    
    return (
      <div className={`token-suggestion ${focused ? 'focused' : ''}`}>
        <div className="flex items-center py-1">
          <CircleStackIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <div className="font-medium">{suggestion.display}</div>
            {token && (
              <div className="text-xs text-gray-500">
                {token.type} • {token.state} • {token.value ? `Value: ${token.value}` : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [allTokens]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) return;
    
    dispatch(createLightweightTicket({
      customerId: selectedCustomer.id,
      tokenId: selectedSearchToken?.id,
      subject,
      description,
      priority,
    })).then(() => {
      if (onSuccess) onSuccess();
    });
  }, [dispatch, selectedCustomer, selectedSearchToken, subject, description, priority, onSuccess]);
  
  const handleExternalSystemRedirect = useCallback(() => {
    // In a real application, this would integrate with the external system
    const systemName = features?.ticketing?.externalSystemName || 'External System';
    window.alert(`Redirecting to ${systemName} for ticket creation with pre-filled data.`);
  }, [features?.ticketing?.externalSystemName]);
  
  // Check if we should use external system only
  const useExternalOnly = features?.ticketing?.useExternalSystem === true;
  
  if (useExternalOnly) {
    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Create Support Ticket</h3>
        <p className="text-sm text-gray-600 mb-3">
          This organization uses {features?.ticketing?.externalSystemName || 'an external system'} for ticket management.
        </p>
        <button
          onClick={handleExternalSystemRedirect}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full flex items-center justify-center"
        >
          <ExternalLinkIcon className="h-4 w-4 mr-2" />
          Open in {features?.ticketing?.externalSystemName || 'External System'}
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-800 mb-2">Create Support Ticket</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
            autoFocus={autoFocus}
          />
        </div>
        
        {/* Token Search Field */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Search and Link Token:</label>
          
          {selectedSearchToken ? (
            <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md border border-blue-200">
              <div className="flex items-center">
                <CircleStackIcon className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <span className="text-sm font-medium text-blue-700">{selectedSearchToken.name}</span>
                  <span className="text-xs text-blue-500 ml-2">{selectedSearchToken.id}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={clearSelectedToken}
                className="text-xs text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={tokenSearchTerm}
                  onChange={(e) => setTokenSearchTerm(e.target.value)}
                  placeholder="Search tokens by name or type..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm"
                />
                {tokenSearchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      type="button"
                      onClick={() => setTokenSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {tokenSearchResults.length > 0 && (
                <div className="absolute mt-1 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="max-h-48 overflow-y-auto py-1 text-sm">
                    {tokenSearchResults.map((token) => (
                      <li 
                        key={token.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => selectToken(token)}
                      >
                        <CircleStackIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-xs text-gray-500">
                            {token.type} • {token.state} • {token.value ? `Value: ${token.value}` : ''}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {tokenSearchTerm && tokenSearchResults.length === 0 && !isSearching && (
                <div className="mt-1 text-xs text-gray-500 italic">
                  No tokens found matching "{tokenSearchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1">Description:</label>
          <div className="token-mentions-wrapper">
            <MentionsInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={mentionsInputStyle}
              placeholder="Brief description of the issue. Type '@' to mention a token."
              className="mentions-input"
            >
              <Mention
                trigger="@"
                data={fetchTokenSuggestions}
                renderSuggestion={renderTokenSuggestion}
                style={mentionStyle}
                className="token-mention"
                markup="@[__display__](__id__)"
              />
            </MentionsInput>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Type @ to reference a token (e.g. @{allTokens[0]?.name || 'ExtraBucks'})
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-xs text-gray-600">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default LightweightTicketForm; 