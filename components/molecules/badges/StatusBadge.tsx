'use client';

import React from 'react';
import { Badge } from '@/components/atoms/Badge';

export type StatusType = 'active' | 'draft' | 'scheduled' | 'completed' | 'paused';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

/**
 * A badge that displays the status of an item (active, draft, scheduled, etc.)
 */
export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'info';
      case 'scheduled':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={className}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
} 