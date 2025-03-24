'use client';

import React from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { Token } from './types';
import TokenStateBadge from './TokenStateBadge';
import { formatShortDate } from './utils';

type TokenDetailsProps = {
  token: Token;
  onRemoveToken: (tokenId: string) => void;
  onReissueToken?: (token: Token) => void;
  onCloseDetails: () => void;
};

/**
 * Component for displaying detailed token information and actions
 */
export default function TokenDetails({ token, onRemoveToken, onReissueToken, onCloseDetails }: TokenDetailsProps) {
  return (
    <Card>
      <div className="p-5">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold">{token.name}</h2>
            <div className="text-sm text-gray-500 mt-1">
              Token ID: {token.id}
            </div>
          </div>
          <TokenStateBadge state={token.state} />
        </div>
        
        <div className="flex mb-5">
          <div className="w-24 h-24 bg-gray-100 rounded-lg mr-5 relative overflow-hidden">
            <Image 
              src={token.imageUrl || '/images/token-placeholder.png'}
              alt={token.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-gray-700 mb-4">{token.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Claimed</h3>
                <p className="mt-1 font-medium">{formatShortDate(token.claimDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expires</h3>
                <p className="mt-1 font-medium">{formatShortDate(token.expirationDate)}</p>
              </div>
              
              {token.useDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Used</h3>
                  <p className="mt-1 font-medium">{formatShortDate(token.useDate)}</p>
                </div>
              )}
              
              {token.shareDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shared</h3>
                  <p className="mt-1 font-medium">{formatShortDate(token.shareDate)}</p>
                </div>
              )}
              
              {token.merchantName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Merchant</h3>
                  <p className="mt-1 font-medium">{token.merchantName}</p>
                </div>
              )}
              
              {token.merchantLocation && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 font-medium">{token.merchantLocation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Support Notes</h3>
          <textarea 
            className="w-full border border-gray-300 rounded-md p-3" 
            rows={3}
            placeholder="Add notes about this token..."
          ></textarea>
        </div>
        
        <div className="flex justify-between">
          {onReissueToken && (token.state === 'Expired' || token.state === 'Used') && (
            <button 
              onClick={() => onReissueToken(token)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Reissue Token
            </button>
          )}
          
          <button 
            onClick={() => onRemoveToken(token.id)}
            className="inline-flex items-center rounded-md bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a00000]"
          >
            Remove Token
          </button>
          
          <button 
            onClick={onCloseDetails}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Close Details
          </button>
        </div>
      </div>
    </Card>
  );
} 