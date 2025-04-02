'use client';

import React from 'react';
import { 
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { ActivityLog, TokenActionType } from '@/lib/types/ticketing';
import { useExternalTicketing } from '@/lib/hooks/useExternalTicketing';

interface ActivityTimelineProps {
  className?: string;
  maxItems?: number;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (e) {
    return 'Invalid date';
  }
};

const getActivityIcon = (activityType: TokenActionType) => {
  switch (activityType) {
    case 'ADD_TOKEN':
      return <PlusCircleIcon className="h-5 w-5 text-green-500" />;
    case 'REMOVE_TOKEN':
      return <MinusCircleIcon className="h-5 w-5 text-red-500" />;
    case 'REISSUE_TOKEN':
      return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
    case 'DISPUTE_TOKEN':
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    case 'UPDATE_TOKEN':
      return <PencilIcon className="h-5 w-5 text-purple-500" />;
    case 'VIEW_TOKEN':
      return <EyeIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <PencilIcon className="h-5 w-5 text-gray-500" />;
  }
};

const getActivityDescription = (activity: ActivityLog) => {
  switch (activity.actionType) {
    case 'ADD_TOKEN':
      return 'Added token to customer account';
    case 'REMOVE_TOKEN':
      return 'Removed token from customer account';
    case 'REISSUE_TOKEN':
      return 'Reissued expired token with new expiration date';
    case 'DISPUTE_TOKEN':
      return 'Marked token as disputed';
    case 'UPDATE_TOKEN':
      return 'Updated token information';
    case 'VIEW_TOKEN':
      return 'Viewed token details';
    default:
      return 'Performed action on token';
  }
};

const getSyncStatusColor = (syncStatus: string) => {
  switch (syncStatus) {
    case 'Synced': return 'text-green-600';
    case 'Failed': return 'text-red-600';
    default: return 'text-yellow-600';
  }
};

export default function ActivityTimeline({ className = '', maxItems }: ActivityTimelineProps) {
  const { activities, hasActiveTicketContext } = useExternalTicketing();
  
  if (!hasActiveTicketContext || activities.length === 0) {
    return null;
  }
  
  // Filter activities if maxItems is provided
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;
  const hasMoreActivities = maxItems && activities.length > maxItems;
  
  return (
    <div className={`bg-white rounded-md border border-gray-200 shadow-sm ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
        <p className="text-sm text-gray-500">
          Actions performed during this session
        </p>
      </div>
      
      <div className="px-4 py-2 max-h-64 overflow-y-auto">
        <ul className="space-y-4">
          {displayedActivities.map((activity) => (
            <li key={activity.id} className="relative pb-4">
              {/* Timeline connector */}
              <div className="absolute top-5 left-3 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
              
              <div className="relative flex items-start">
                {/* Activity icon */}
                <div className="flex-shrink-0">
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200">
                    {getActivityIcon(activity.actionType)}
                  </div>
                </div>
                
                {/* Activity content */}
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium text-gray-900">
                      {getActivityDescription(activity)}
                    </div>
                    <div className="whitespace-nowrap text-gray-500">
                      {formatDate(activity.performedAt)}
                    </div>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-700">
                    <p>Token ID: {activity.tokenId}</p>
                    {activity.notes && (
                      <p className="mt-1 whitespace-pre-line text-gray-600">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-1 text-xs">
                    <span className={`${getSyncStatusColor(activity.syncStatus)}`}>
                      {activity.syncStatus === 'Synced' ? 'Synced to external system' : 
                       activity.syncStatus === 'Failed' ? 'Failed to sync' : 
                       'Pending sync'}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {hasMoreActivities && (
          <div className="py-2 text-center">
            <span className="text-sm text-blue-600">
              +{activities.length - maxItems} more activities
            </span>
          </div>
        )}
        
        {displayedActivities.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No activities recorded yet
          </div>
        )}
      </div>
    </div>
  );
} 