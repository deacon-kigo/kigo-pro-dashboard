'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import StandardDashboard from '@/components/ui/StandardDashboard';
import AccountLookup from './AccountLookup';
import AccountDetails from './AccountDetails';
import TokenList from './TokenList';
import TokenDetails from './TokenDetails';
import TokenSearchModal from './TokenSearchModal';
import TicketList from './TicketList';
import TicketModal from './TicketModal';
import SidebarContent from './SidebarContent';
import DashboardHeader from './DashboardHeader';
import StatsSection from './StatsSection';
import { Account, Token, TokenState } from './types';
import { sampleTokens, sampleAccounts } from './data';
import { generateTokenId, calculateExpirationDate } from './utils';
import { useAppSelector } from '@/lib/redux/hooks';

/**
 * Main token management view component
 */
export default function TokenManagementView() {
  const { userProfile, setThemeMode } = useDemo();
  const tickets = useAppSelector(state => state.cvsToken.tickets);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showTokenSearchModal, setShowTokenSearchModal] = useState(false);
  
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
  
  // Token management actions
  const addTokenToAccount = (token: Token) => {
    if (!selectedAccount) return;
    
    const newToken = { 
      ...token, 
      id: generateTokenId(), 
      state: 'Active' as TokenState,
      claimDate: new Date().toISOString(),
      expirationDate: calculateExpirationDate(),
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
      id: generateTokenId(), 
      state: 'Active' as TokenState,
      claimDate: new Date().toISOString(),
      expirationDate: calculateExpirationDate(),
      useDate: undefined,
      shareDate: undefined,
      supportActions: {
        ...oldToken.supportActions,
        isReissued: true,
        reissuedDate: new Date().toISOString(),
        reissuedBy: userProfile?.name || 'Agent',
        originalTokenId: oldToken.id
      }
    };
    
    // Update selected account with new token
    const updatedAccount = { 
      ...selectedAccount, 
      tokens: [...selectedAccount.tokens, newToken] 
    };
    
    // Update state
    setSelectedAccount(updatedAccount);
    setSelectedToken(null);
  };
  
  const flagToken = (token: Token) => {
    if (!selectedAccount) return;
    
    // Find the token in the account
    const tokenIndex = selectedAccount.tokens.findIndex(t => t.id === token.id);
    if (tokenIndex === -1) return;
    
    // Create a new tokens array with the flagged token
    const updatedTokens = [...selectedAccount.tokens];
    updatedTokens[tokenIndex] = {
      ...token,
      supportActions: {
        ...token.supportActions,
        comments: `${token.supportActions?.comments || ''}${token.supportActions?.comments ? '\n' : ''}Token flagged for investigation.`
      }
    };
    
    // Update selected account
    const updatedAccount = {
      ...selectedAccount,
      tokens: updatedTokens
    };
    
    // Update state
    setSelectedAccount(updatedAccount);
    setSelectedToken(updatedTokens[tokenIndex]);
  };
  
  // Main content - shows account lookup or token management
  const mainContent = (
    <div className="space-y-6">
      {!selectedAccount ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AccountLookup onSelectAccount={setSelectedAccount} />
          </div>
          
          <div>
            <TicketList 
              tickets={tickets} 
              title="Recent Tickets"
              filterTier="All"
              maxVisible={5}
              showCreateButton={false}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <AccountDetails 
                account={selectedAccount} 
                onReturnToSearch={() => {
                  setSelectedAccount(null);
                  setSelectedToken(null);
                }} 
              />
              
              {/* Ticket list for selected account */}
              <div className="mt-6">
                <TicketList
                  tickets={tickets.filter(ticket => ticket.customerId === selectedAccount.id)}
                  title="Customer Tickets"
                  filterTier="All"
                  maxVisible={3}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <TokenList 
                tokens={selectedAccount.tokens} 
                onSelectToken={setSelectedToken}
                selectedTokenId={selectedToken?.id}
              />
            </div>
          </div>
          
          {selectedToken && (
            <TokenDetails 
              token={selectedToken} 
              onRemoveToken={removeTokenFromAccount}
              onReissueToken={reissueToken}
              onFlagToken={flagToken}
              onCloseDetails={() => setSelectedToken(null)}
            />
          )}
          
          {showTokenSearchModal && (
            <TokenSearchModal 
              tokens={sampleTokens}
              onAddToken={addTokenToAccount}
              onClose={() => setShowTokenSearchModal(false)}
            />
          )}
        </>
      )}
      
      {/* Ticket Modal for creating/viewing tickets */}
      <TicketModal />
    </div>
  );
  
  return (
    <StandardDashboard
      headerContent={
        <DashboardHeader 
          userProfile={userProfile} 
          currentDate={currentDate} 
          selectedAccount={selectedAccount}
          onAddToken={() => setShowTokenSearchModal(true)}
        />
      }
      statsSection={<StatsSection tokens={sampleTokens} />}
      sidebarContent={<SidebarContent />}
    >
      {mainContent}
    </StandardDashboard>
  );
} 