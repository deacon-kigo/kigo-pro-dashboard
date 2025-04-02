/**
 * @component TokenStateBadge
 * @classification molecule
 * @pattern status-display
 * @usage both
 * @description Displays a badge representing the state of a token with appropriate colors
 */
'use client';

import React from 'react';
import { Badge } from '@/components/atoms/Badge';
import { TokenState } from '@/lib/token-management';

type TokenStateBadgeProps = {
  state: TokenState;
  className?: string;
};

export default function TokenStateBadge({ state, className = '' }: TokenStateBadgeProps) {
  const getStateStyles = () => {
    switch(state) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Shared':
        return 'bg-blue-100 text-blue-800';
      case 'Used':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Badge className={`${getStateStyles()} ${className}`}>
      {state}
    </Badge>
  );
} 