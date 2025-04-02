'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { Account } from './types';
import { formatDate } from './utils';

type AccountDetailsProps = {
  account: Account;
  onReturnToSearch: () => void;
};

/**
 * Component for displaying detailed account information
 */
export default function AccountDetails({ account, onReturnToSearch }: AccountDetailsProps) {
  return (
    <Card>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Account Details</h2>
          <button 
            onClick={onReturnToSearch}
            className="text-[#cc0000] hover:text-[#a00000] text-sm font-medium"
          >
            Back to Search
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="mt-1 font-medium">{account.firstName} {account.lastName}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 font-medium">{account.email}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
            <p className="mt-1 font-medium">{account.mobileNumber}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Account ID</h3>
            <p className="mt-1 font-medium">{account.id}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
            <p className="mt-1 font-medium">{formatDate(account.creationDate)}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Token Summary</h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium text-green-600">{account.tokens.filter(t => t.state === 'Active').length}</span> Active
              </p>
              <p className="text-sm">
                <span className="font-medium text-blue-600">{account.tokens.filter(t => t.state === 'Shared').length}</span> Shared
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">{account.tokens.filter(t => t.state === 'Used').length}</span> Used
              </p>
              <p className="text-sm">
                <span className="font-medium text-red-600">{account.tokens.filter(t => t.state === 'Expired').length}</span> Expired
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 