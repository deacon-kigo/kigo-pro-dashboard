import React from 'react';

type StatusType = 'active' | 'draft' | 'scheduled' | 'completed' | 'paused';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-pastel-green text-green-700';
      case 'draft':
        return 'bg-pastel-blue text-blue-700';
      case 'scheduled':
        return 'bg-pastel-purple text-purple-700';
      case 'completed':
        return 'bg-pastel-orange text-orange-700';
      case 'paused':
        return 'bg-pastel-yellow text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyles()} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 