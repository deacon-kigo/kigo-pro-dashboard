/**
 * @component TicketBadges
 * @classification molecule
 * @pattern status-display
 * @usage both
 * @description Displays badges for ticket status and support tier with appropriate colors
 */
'use client';

import React from 'react';
import { TicketStatus, SupportTier } from '@/lib/token-management';
import { Badge } from '@/components/atoms/Badge';

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
    <Badge className={`${getBadgeColor()} ${className}`}>
      {status}
    </Badge>
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
    <Badge className={`${getBadgeColor()} ${className}`}>
      {tier === 'Tier1' ? 'Tier 1 (CVS)' : 'Tier 2 (Kigo Pro)'}
    </Badge>
  );
};

export default function TicketBadge(props: TicketBadgeProps) {
  return props.status ? <TicketStatusBadge {...props} /> : <TierBadge {...props} />;
} 