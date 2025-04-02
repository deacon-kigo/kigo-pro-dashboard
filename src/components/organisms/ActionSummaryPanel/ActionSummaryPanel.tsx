/**
 * @component ActionSummaryPanel
 * @classification organism
 * @pattern data-display
 * @usage both
 * @description Displays a summary of actions performed in an external ticketing system
 */
'use client';

import React, { useState } from 'react';
import { 
  ClipboardDocumentCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { useExternalTicketing } from '@/lib/hooks/useExternalTicketing';

interface ActionSummaryPanelProps {
  className?: string;
  onCancel?: () => void;
}

export default function ActionSummaryPanel({ className = '', onCancel }: ActionSummaryPanelProps) {
  const { activities, returnToExternalSystem, currentTicket, hasActiveTicketContext } = useExternalTicketing();
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!hasActiveTicketContext || activities.length === 0) {
    return null;
  }
  
  // Group activities by type for summary
  const actionsByType = activities.reduce((acc, activity) => {
    acc[activity.actionType] = (acc[activity.actionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const getActionTypeDisplayName = (actionType: string, count: number) => {
    let name = '';
    switch (actionType) {
      case 'ADD_TOKEN': name = 'Token Addition'; break;
      case 'REMOVE_TOKEN': name = 'Token Removal'; break;
      case 'REISSUE_TOKEN': name = 'Token Reissue'; break;
      case 'DISPUTE_TOKEN': name = 'Token Dispute'; break;
      case 'UPDATE_TOKEN': name = 'Token Update'; break;
      case 'VIEW_TOKEN': name = 'Token View'; break;
      default: name = 'Action';
    }
    return `${count} ${name}${count > 1 ? 's' : ''}`;
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await returnToExternalSystem(additionalNotes);
    } catch (error) {
      console.error('Error returning to external system:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`bg-white rounded-md border border-gray-200 shadow-sm ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Action Summary</h3>
        <p className="text-sm text-gray-500">
          Review the actions performed before returning to {currentTicket?.externalSystem}
        </p>
      </div>
      
      <div className="px-4 py-3">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Actions Performed ({activities.length} total)
          </h4>
          <ul className="space-y-1 text-sm">
            {Object.entries(actionsByType).map(([actionType, count]) => (
              <li key={actionType} className="flex items-center">
                <ClipboardDocumentCheckIcon className="h-4 w-4 text-blue-500 mr-2" />
                {getActionTypeDisplayName(actionType, count)}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <Textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Add any additional notes to include with the action summary..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Returning...' : `Return to ${currentTicket?.externalSystem}`}
          </Button>
        </div>
      </div>
    </div>
  );
} 