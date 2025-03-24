'use client';

import React from 'react';
import { TokenState } from './types';

type TokenStateBadgeProps = {
  state: TokenState;
  className?: string;
};

/**
 * Badge component for displaying token states with appropriate colors
 */
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateStyles()} ${className}`}>
      {state}
    </span>
  );
} 