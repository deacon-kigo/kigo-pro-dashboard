'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectTicket, toggleTicketModal, TicketInfo } from '@/lib/redux/slices/cvsTokenSlice';
import { TicketStatusBadge, TierBadge } from './TicketBadge';
import { ExclamationCircleIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Card from '@/components/atoms/Card/Card';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

interface TicketListProps {
  tickets: TicketInfo[];
  title?: string;
  filterTier?: 'Tier1' | 'Tier2' | 'All';
  maxVisible?: number;
  showCreateButton?: boolean;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  title = 'Support Tickets',
  filterTier = 'All',
  maxVisible = 5,
  showCreateButton = true
}) => {
  const dispatch = useAppDispatch();
  const selectedTicket = useAppSelector(state => state.cvsToken.selectedTicket);
  const [showAll, setShowAll] = useState(false);
  
  // Filter tickets by tier if specified
  const filteredTickets = tickets.filter(ticket => {
    if (filterTier === 'All') return true;
    return ticket.tier === filterTier;
  });
  
  // Sort tickets: Open first, then by priority, then by date
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    // Closed tickets at the bottom
    if (a.status === 'Closed' && b.status !== 'Closed') return 1;
    if (a.status !== 'Closed' && b.status === 'Closed') return -1;
    
    // Sort by priority
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Sort by date (newest first)
    return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
  });
  
  // Limit the number of tickets shown if not showing all
  const visibleTickets = showAll ? sortedTickets : sortedTickets.slice(0, maxVisible);
  
  const handleSelectTicket = (ticketId: string) => {
    dispatch(selectTicket(ticketId));
    dispatch(toggleTicketModal());
  };
  
  const handleCreateTicket = () => {
    dispatch(toggleTicketModal());
  };
  
  return (
    <Card title={title}>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {filterTier === 'All' ? 'All tickets' : filterTier === 'Tier1' ? 'CVS support tickets' : 'Kigo Pro escalated tickets'}
          <span className="ml-1 font-medium">{sortedTickets.length}</span>
        </div>
        
        {showCreateButton && (
          <button
            onClick={handleCreateTicket}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
          >
            Create Ticket
          </button>
        )}
      </div>
      
      {sortedTickets.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No tickets found
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {visibleTickets.map(ticket => (
              <div
                key={ticket.id}
                className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleSelectTicket(ticket.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center">
                      {ticket.status === 'Escalated' && (
                        <ArrowPathIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      )}
                      {ticket.priority === 'High' && (
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className="mr-2">{ticket.id}</span>
                      <TierBadge tier={ticket.tier} className="ml-1" />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{ticket.subject}</div>
                  </div>
                  <TicketStatusBadge status={ticket.status} />
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <div>Updated: {formatDate(ticket.updatedDate)}</div>
                  
                  {ticket.tokenId && (
                    <div className="flex items-center">
                      <ArrowTopRightOnSquareIcon className="h-3 w-3 mr-1" />
                      <span>Has token</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {sortedTickets.length > maxVisible && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                {showAll ? 'Show less' : `Show all (${sortedTickets.length})`}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default TicketList; 