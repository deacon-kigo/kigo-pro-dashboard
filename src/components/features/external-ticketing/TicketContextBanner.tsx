'use client';

import React from 'react';
import { 
  TicketIcon, 
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ExternalTicketReference } from '@/lib/types/ticketing';
import { useExternalTicketing } from '@/lib/hooks/useExternalTicketing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TicketContextBannerProps {
  className?: string;
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Resolved': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSystemLogo = (system: string) => {
  switch (system) {
    case 'ServiceNow':
      return <span className="font-semibold text-blue-700">ServiceNow</span>;
    case 'Zendesk':
      return <span className="font-semibold text-green-700">Zendesk</span>;
    case 'Salesforce':
      return <span className="font-semibold text-blue-600">Salesforce</span>;
    case 'Jira':
      return <span className="font-semibold text-blue-500">Jira</span>;
    default:
      return <span className="font-semibold text-gray-700">{system}</span>;
  }
};

export default function TicketContextBanner({ className = '' }: TicketContextBannerProps) {
  const { 
    currentTicket, 
    activities, 
    returnToExternalSystem,
    hasActiveTicketContext
  } = useExternalTicketing();
  
  if (!hasActiveTicketContext) {
    return null;
  }
  
  const handleReturnClick = () => {
    returnToExternalSystem();
  };
  
  const activityCount = activities.length;
  
  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <TicketIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center">
              {getSystemLogo(currentTicket?.externalSystem || 'Unknown')}
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-sm font-medium text-gray-700">
                Ticket {currentTicket?.externalId}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <Badge className={`${getStatusColor(currentTicket?.externalStatus || 'Open')} ml-2`}>
                {currentTicket?.externalStatus}
              </Badge>
              <Badge className={`${getPriorityColor(currentTicket?.priority || 'Medium')} ml-2`}>
                {currentTicket?.priority} Priority
              </Badge>
            </div>
            <div className="mt-1 text-sm text-gray-600 font-medium line-clamp-1">
              {currentTicket?.subject}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            Created {formatDate(currentTicket?.createdAt || '')}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <UserIcon className="h-3 w-3 mr-1" />
            {currentTicket?.createdBy}
          </div>
          
          {activityCount > 0 && (
            <div className="flex items-center text-xs font-medium text-blue-600">
              <ArrowPathIcon className="h-3 w-3 mr-1" />
              {activityCount} {activityCount === 1 ? 'action' : 'actions'} recorded
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            className="flex items-center"
            onClick={handleReturnClick}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Return to {currentTicket?.externalSystem}
          </Button>
        </div>
      </div>
    </div>
  );
} 