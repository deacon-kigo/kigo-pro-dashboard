'use client';

import React from 'react';
import { Badge } from '@/components/atoms/Badge';

// Define TokenState type directly since we're no longer in the token-management folder
export type TokenState = 'Active' | 'Shared' | 'Used' | 'Expired';

type TokenStateBadgeProps = {
  state: TokenState;
  className?: string;
};

/**
 * Badge component for displaying token states with appropriate colors
 */
export default function TokenStateBadge({ state, className = '' }: TokenStateBadgeProps) {
  const getVariant = () => {
    switch(state) {
      case 'Active':
        return 'success';
      case 'Shared':
        return 'info';
      case 'Used':
        return 'secondary';
      case 'Expired':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <Badge variant={getVariant()} className={className}>
      {state}
    </Badge>
  );
} 