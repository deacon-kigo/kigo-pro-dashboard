'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import StandardDashboard from '@/components/ui/StandardDashboard';
import AccountLookup from './AccountLookup';
import AccountDetails from './AccountDetails';
import TokenList from './TokenList';
import TokenDetails from './TokenDetails';
import TokenSearchModal from './TokenSearchModal';
import SidebarContent from './SidebarContent';
import DashboardHeader from './DashboardHeader';
import StatsSection from './StatsSection';
import { Account, Token } from './types';
import { sampleTokens, sampleAccounts } from './data';
import { generateTokenId, calculateExpirationDate } from './utils';

/**
 * Main token management view component
 */
export default function TokenManagementView() {
  const { userProfile, setThemeMode } = useDemo();
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
      state: 'Active',
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
      state: 'Active',
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
    setSelectedToken(null);
  };
  
  // Main content - shows account lookup or token management
  const mainContent = (
    <div className="space-y-6">
      {!selectedAccount ? (
        <AccountLookup onSelectAccount={setSelectedAccount} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AccountDetails 
              account={selectedAccount} 
              onReturnToSearch={() => {
                setSelectedAccount(null);
                setSelectedToken(null);
              }} 
            />
            
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