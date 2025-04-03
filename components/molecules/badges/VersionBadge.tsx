'use client';

import React from 'react';
import { Badge } from '@/components/atoms/Badge';
import { BeakerIcon, ClockIcon, RocketLaunchIcon, CommandLineIcon } from '@heroicons/react/24/outline';

// Define the type locally instead of importing
export type VersionType = 'current' | 'upcoming' | 'future' | 'experimental';

interface VersionBadgeProps {
  version: VersionType;
}

// Define version info here
const versionInfo: Record<VersionType, { name: string, description: string }> = {
  'current': {
    name: 'Current Release',
    description: 'Features currently implemented in production'
  },
  'upcoming': {
    name: 'Next Release',
    description: 'Features planned for the next release cycle'
  },
  'future': {
    name: 'Future Roadmap',
    description: 'Features in the long-term development roadmap'
  },
  'experimental': {
    name: 'Experimental',
    description: 'Experimental concepts and designs for feedback'
  }
};

const versionIcons: Record<VersionType, React.ReactNode> = {
  'current': <ClockIcon className="w-4 h-4" />,
  'upcoming': <RocketLaunchIcon className="w-4 h-4" />,
  'future': <CommandLineIcon className="w-4 h-4" />,
  'experimental': <BeakerIcon className="w-4 h-4" />
};

// Map version types to Badge variants that match the expected values
const versionVariants: Record<VersionType, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'> = {
  'current': 'success',
  'upcoming': 'info',
  'future': 'secondary',
  'experimental': 'warning'
};

/**
 * Displays a version badge showing the current version mode (upcoming, future, experimental)
 */
export default function VersionBadge({ version }: VersionBadgeProps) {
  if (version === 'current') return null;
  
  const info = versionInfo[version];
  const icon = versionIcons[version];
  const variant = versionVariants[version];
  
  // Using a custom wrapper instead of Badge directly because of the special positioning
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-md border">
        {icon}
        <span className="font-medium text-sm">{info.name}</span>
        <Badge variant={variant} className="text-xs">Mode</Badge>
      </div>
    </div>
  );
} 