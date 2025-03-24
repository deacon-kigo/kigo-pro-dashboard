'use client';

import React from 'react';
import { VersionType } from '@/lib/redux/slices/demoSlice';
import { BeakerIcon, ClockIcon, RocketLaunchIcon, CommandLineIcon } from '@heroicons/react/24/outline';

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

const versionColors: Record<VersionType, string> = {
  'current': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'upcoming': 'bg-blue-100 text-blue-800 border-blue-200',
  'future': 'bg-purple-100 text-purple-800 border-purple-200',
  'experimental': 'bg-amber-100 text-amber-800 border-amber-200'
};

/**
 * Displays a version badge showing the current version mode (upcoming, future, experimental)
 */
export default function VersionBadge({ version }: VersionBadgeProps) {
  if (version === 'current') return null;
  
  const info = versionInfo[version];
  const colors = versionColors[version];
  const icon = versionIcons[version];
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full shadow-md ${colors} border`}>
        {icon}
        <span className="font-medium text-sm">{info.name}</span>
        <span className="text-xs opacity-75">Mode</span>
      </div>
    </div>
  );
} 