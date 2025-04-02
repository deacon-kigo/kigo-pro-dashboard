'use client';

import React from 'react';
import Card from '@/components/atoms/Card/Card';
import { Token } from './types';

type StatsSectionProps = {
  tokens: Token[];
};

/**
 * Component for displaying token statistics
 */
export default function StatsSection({ tokens }: StatsSectionProps) {
  const activeTokens = tokens.filter(t => t.state === 'Active').length;
  const sharedTokens = tokens.filter(t => t.state === 'Shared').length;
  const usedTokens = tokens.filter(t => t.state === 'Used').length;
  const expiredTokens = tokens.filter(t => t.state === 'Expired').length;
  
  return (
    <>
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-lg mr-4 text-red-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Tokens</p>
            <p className="text-2xl font-bold">{activeTokens}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4 text-blue-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shared Tokens</p>
            <p className="text-2xl font-bold">{sharedTokens}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Used Tokens</p>
            <p className="text-2xl font-bold">{usedTokens}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4 text-yellow-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expired Tokens</p>
            <p className="text-2xl font-bold">{expiredTokens}</p>
          </div>
        </div>
      </Card>
    </>
  );
} 