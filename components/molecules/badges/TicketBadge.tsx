'use client';

import React from 'react';
import { Badge } from '@/components/atoms/Badge';

// Define our types locally instead of importing from Redux slice
export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';
export type SupportTier = 'Tier1' | 'Tier2';

type TicketBadgeProps = {
  status?: TicketStatus;
  tier?: SupportTier;
  className?: string;
};

export const TicketStatusBadge: React.FC<TicketBadgeProps> = ({ status, className = '' }) => {
  if (!status) return null;
  
  const getVariant = () => {
    switch (status) {
      case 'Open':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Escalated':
        return 'warning';
      case 'Resolved':
        return 'secondary';
      case 'Closed':
        return 'default';
      default:
        return 'default';
    }
  };
  
  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
};

export const TierBadge: React.FC<TicketBadgeProps> = ({ tier, className = '' }) => {
  if (!tier) return null;
  
  const getVariant = () => {
    switch (tier) {
      case 'Tier1':
        return 'info';
      case 'Tier2':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <Badge variant={getVariant()} className={className}>
      {tier === 'Tier1' ? 'Tier 1 (CVS)' : 'Tier 2 (Kigo Pro)'}
    </Badge>
  );
};

const TicketBadge: React.FC<TicketBadgeProps> = (props) => {
  return props.status ? <TicketStatusBadge {...props} /> : <TierBadge {...props} />;
};

export default TicketBadge; 