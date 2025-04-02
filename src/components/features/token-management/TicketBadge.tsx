'use client';

import React from 'react';
import { TicketStatus, SupportTier } from '@/lib/redux/slices/cvsTokenSlice';

type TicketBadgeProps = {
  status?: TicketStatus;
  tier?: SupportTier;
  className?: string;
};

export const TicketStatusBadge: React.FC<TicketBadgeProps> = ({ status, className = '' }) => {
  if (!status) return null;
  
  const getBadgeColor = () => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Escalated':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-purple-100 text-purple-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor()} ${className}`}>
      {status}
    </span>
  );
};

export const TierBadge: React.FC<TicketBadgeProps> = ({ tier, className = '' }) => {
  if (!tier) return null;
  
  const getBadgeColor = () => {
    switch (tier) {
      case 'Tier1':
        return 'bg-blue-100 text-blue-800';
      case 'Tier2':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor()} ${className}`}>
      {tier === 'Tier1' ? 'Tier 1 (CVS)' : 'Tier 2 (Kigo Pro)'}
    </span>
  );
};

const TicketBadge: React.FC<TicketBadgeProps> = (props) => {
  return props.status ? <TicketStatusBadge {...props} /> : <TierBadge {...props} />;
};

export default TicketBadge; 