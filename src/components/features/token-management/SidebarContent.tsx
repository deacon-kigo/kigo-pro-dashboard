'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/lib/redux/hooks';
import { 
  TicketIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { TierBadge, TicketStatusBadge } from './TicketBadge';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Sidebar content component for the token management view
 */
export default function SidebarContent() {
  const tickets = useAppSelector(state => state.cvsToken.tickets);
  
  // Get recent tickets (last 3)
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, 3);
  
  // Count tickets by tier
  const tier1Count = tickets.filter(t => t.tier === 'Tier1').length;
  const tier2Count = tickets.filter(t => t.tier === 'Tier2').length;
  
  // Count open tickets
  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Support Resources
        </h3>
        <div className="mt-2 space-y-1">
          <Link
            href="/dashboard/resources/guides"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <InformationCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            ExtraCare Token Management Guide
          </Link>
          <Link
            href="/dashboard/resources/training"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <InformationCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Training Resources
          </Link>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ticket Overview
          </h3>
          <Link 
            href="/demos/cvs-tickets"
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">Tier 1 (CVS)</div>
            <div className="text-lg font-bold text-blue-800">{tier1Count}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-600 font-medium">Tier 2 (Kigo)</div>
            <div className="text-lg font-bold text-red-800">{tier2Count}</div>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 font-medium">Open Tickets</div>
          <div className="text-lg font-bold text-gray-800">{openTickets}</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Recent Tickets
        </h3>
        <div className="mt-2 space-y-3">
          {recentTickets.map(ticket => (
            <Link
              key={ticket.id}
              href="/demos/cvs-tickets"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <TicketIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-blue-600">{ticket.id}</span>
                </div>
                <div className="flex space-x-1">
                  <TicketStatusBadge status={ticket.status} />
                  <TierBadge tier={ticket.tier} />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-800 line-clamp-1">{ticket.subject}</p>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Updated {formatDate(ticket.updatedDate)}
                </div>
                {ticket.status === 'Escalated' && (
                  <div className="flex items-center text-xs text-yellow-600">
                    <ArrowPathIcon className="h-3 w-3 mr-1" />
                    Escalated
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Links
        </h3>
        <div className="mt-2 space-y-1">
          <Link
            href="/demos/cvs-tickets"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <TicketIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Support Tickets
          </Link>
          <Link
            href="/dashboard/reports"
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <InformationCircleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Token Reports
          </Link>
        </div>
      </div>
    </div>
  );
} 