'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { Token } from './types';
import TokenStateBadge from './TokenStateBadge';
import { formatShortDate as formatDate } from './utils';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTicketModal, selectTicket } from '@/lib/redux/slices/cvsTokenSlice';
import { TierBadge, TicketStatusBadge } from './TicketBadge';
import { 
  XMarkIcon, 
  ArrowPathIcon, 
  TrashIcon, 
  FlagIcon, 
  TicketIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import LightweightTicketForm from './LightweightTicketForm';

type TokenDetailsProps = {
  token: Token;
  onRemoveToken: (tokenId: string) => void;
  onReissueToken: (token: Token) => void;
  onFlagToken?: (token: Token) => void;
  onCloseDetails: () => void;
};

/**
 * Component for displaying detailed token information and actions
 */
export default function TokenDetails({
  token,
  onRemoveToken,
  onReissueToken,
  onFlagToken,
  onCloseDetails
}: TokenDetailsProps) {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(state => state.cvsToken.tickets);
  const { features } = useAppSelector(state => state.featureConfig);
  const [showLightweightForm, setShowLightweightForm] = useState(false);
  
  // Find associated ticket if any
  const associatedTicket = tickets.find(t => 
    t.tokenId === token.id || 
    (token.supportActions?.ticketId && t.id === token.supportActions.ticketId)
  );
  
  const handleTicketClick = () => {
    if (associatedTicket) {
      // View existing ticket
      dispatch(selectTicket(associatedTicket.id));
      dispatch(toggleTicketModal());
    } else {
      // Create new ticket
      dispatch(toggleTicketModal());
    }
  };
  
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
          <div className="flex space-x-2">
            {token.supportActions?.tier && (
              <TierBadge tier={token.supportActions.tier} />
            )}
            <TokenStateBadge state={token.state} />
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={onCloseDetails}
              aria-label="Close details"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
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
                <p className="mt-1 font-medium">{formatDate(token.claimDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expires</h3>
                <p className="mt-1 font-medium">{formatDate(token.expirationDate)}</p>
              </div>
              
              {token.useDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Used</h3>
                  <p className="mt-1 font-medium">{formatDate(token.useDate)}</p>
                </div>
              )}
              
              {token.shareDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shared</h3>
                  <p className="mt-1 font-medium">{formatDate(token.shareDate)}</p>
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
        
        {/* Support Information */}
        {(token.supportActions || associatedTicket) && (
          <div className="mb-5 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Support Information</h3>
            
            {token.supportActions?.tier && (
              <div className="flex items-center mb-2">
                <span className="text-sm text-blue-700 mr-2">Support Tier:</span>
                <TierBadge tier={token.supportActions.tier} />
              </div>
            )}
            
            {token.supportActions?.isReissued && (
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-700">Reissued on {token.supportActions.reissuedDate}</span>
              </div>
            )}
            
            {token.supportActions?.escalationDate && (
              <div className="flex items-center mb-2">
                <ArrowPathIcon className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-700">Escalated on {formatDate(token.supportActions.escalationDate)}</span>
              </div>
            )}
            
            {token.supportActions?.comments && (
              <div className="mt-2">
                <h4 className="text-xs font-medium text-blue-700 mb-1">Support Notes:</h4>
                <p className="text-sm text-gray-700 bg-white p-2 rounded">{token.supportActions.comments}</p>
              </div>
            )}
            
            {associatedTicket && (
              <div className="mt-3">
                <h4 className="text-xs font-medium text-blue-700 mb-1">Linked Ticket:</h4>
                <div className="bg-white p-2 rounded flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{associatedTicket.id}</span>
                    <TicketStatusBadge status={associatedTicket.status} />
                    <TierBadge tier={associatedTicket.tier} />
                  </div>
                  <button
                    onClick={handleTicketClick}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                    View Ticket
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-700 px-2">{associatedTicket.subject}</div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between">
          <div className="space-x-2">
            {token.state === 'Expired' || token.state === 'Used' ? (
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                onClick={() => onReissueToken(token)}
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reissue Token
              </button>
            ) : null}
            
            <button
              className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700"
              onClick={() => onRemoveToken(token.id)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Remove Token
            </button>
            
            {onFlagToken && (
              <button
                className="px-3 py-2 bg-yellow-600 text-white rounded-md flex items-center hover:bg-yellow-700"
                onClick={() => onFlagToken(token)}
              >
                <FlagIcon className="h-4 w-4 mr-2" />
                Flag Token
              </button>
            )}
          </div>
          
          {/* Ticket Actions */}
          {associatedTicket ? (
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              onClick={handleTicketClick}
            >
              <TicketIcon className="h-4 w-4 mr-2" />
              View Ticket
            </button>
          ) : (
            <button
              className="px-3 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
              onClick={() => dispatch(toggleTicketModal())}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Ticket
            </button>
          )}
        </div>
      </div>
    </Card>
  );
} 