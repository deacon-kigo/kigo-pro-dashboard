/**
 * @component TicketList
 * @classification organism
 * @pattern data-display
 * @usage both
 * @description A component displaying a list of support tickets with filtering options
 */
'use client';

import React, { useState } from 'react';
import Card from '@/components/atoms/Card/Card';
import { TicketInfo, TicketStatus } from '@/lib/token-management';
import { TicketBadge } from '@/components/molecules/badges';
import { formatShortDate } from '@/lib/token-management';

type TicketListProps = {
  tickets: TicketInfo[];
  onSelectTicket: (ticket: TicketInfo) => void;
  selectedTicketId?: string;
};

export default function TicketList({ tickets, onSelectTicket, selectedTicketId }: TicketListProps) {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tickets based on filter and search query
  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesSearch = !searchQuery || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <Card>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Support Tickets</h2>
          
          <div className="flex space-x-2">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
            >
              <option value="All">All Tickets</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTicketId === ticket.id
                  ? 'border-[#cc0000] bg-red-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{ticket.title}</span>
                <TicketBadge status={ticket.status} />
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {ticket.description?.length > 120 
                  ? `${ticket.description.substring(0, 120)}...` 
                  : ticket.description}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {ticket.customerName && `Customer: ${ticket.customerName}`}
                </span>
                <span className="text-xs text-gray-500">
                  Created: {formatShortDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No tickets match your filter
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 