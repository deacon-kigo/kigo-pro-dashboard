/**
 * @component ExternalTicketView
 * @classification view
 * @usage both
 * @description A view that displays external ticket context and action summary
 */
'use client';

import React from 'react';
import TicketContextBanner from '@/components/organisms/TicketContextBanner';
import ActionSummaryPanel from '@/components/organisms/ActionSummaryPanel';
import { useExternalTicketing } from '@/lib/hooks/useExternalTicketing';

export default function ExternalTicketView() {
  const { hasActiveTicketContext } = useExternalTicketing();
  
  if (!hasActiveTicketContext) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <TicketContextBanner />
      <div className="container mx-auto px-4">
        <ActionSummaryPanel className="mb-6" />
        {/* Additional ticket-related content would go here */}
        <div className="bg-white rounded-md border border-gray-200 p-6">
          <h2 className="text-xl font-medium mb-4">Ticket Details</h2>
          <p className="text-gray-600">
            This view demonstrates how organism components can be composed into a complete view.
            In a real application, more ticket details and actions would be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
} 