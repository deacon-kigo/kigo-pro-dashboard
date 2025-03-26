'use client';

import React from 'react';
import Image from 'next/image';
import { Account } from './types';

type DashboardHeaderProps = {
  userProfile: {
    firstName?: string;
    name?: string;
    id?: string;
  };
  currentDate: string;
  selectedAccount: Account | null;
  onAddToken: () => void;
};

/**
 * Header component for the token management dashboard
 */
export default function DashboardHeader({ 
  userProfile, 
  currentDate, 
  selectedAccount,
  onAddToken
}: DashboardHeaderProps) {
  // Use firstName if available, otherwise fall back to name or a default
  const displayName = userProfile.firstName || userProfile.name || 'Agent';
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="h-10 w-16 relative">
            <Image 
              src="/logos/cvs-logo.svg" 
              alt="CVS Logo" 
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="h-8 w-8 relative">
            <Image 
              src="/kigo logo only.svg" 
              alt="Kigo Logo" 
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Good morning, {displayName}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentDate} • <span className="text-[#cc0000] font-medium">ExtraCare Token Management</span>
          </p>
          <p className="text-sm text-gray-500 italic mt-1">
            Support agent ID: {userProfile.id || 'Unknown'}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {selectedAccount && (
          <button 
            onClick={onAddToken}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-red-600 transition-all duration-200"
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
} 