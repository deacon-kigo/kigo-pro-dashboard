'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Link from 'next/link';
import { buildDemoUrl } from '@/lib/utils/url';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ArrowUpTrayIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

// Import redux hooks
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  selectTicket, 
  toggleTicketModal, 
  escalateToTier2,
  addTicketNote,
  closeTicket,
  TicketInfo,
  TicketStatus, 
  SupportTier
} from '@/lib/redux/slices/cvsTokenSlice';

// Components for tier support
import { TicketStatusBadge, TierBadge } from '@/components/features/token-management/TicketBadge';

const softShadow = '0 2px 4px rgba(0,0,0,0.05)';

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

export default function CVSTicketsView() {
  const { updateDemoState, userProfile } = useDemo();
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(state => state.cvsToken.tickets);
  
  const [greeting, setGreeting] = useState('Good morning');
  const [currentTime, setCurrentTime] = useState('');
  const [dateString, setDateString] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<TicketInfo[]>([]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<SupportTier | 'All'>('All');
  const [selectedTicket, setSelectedTicket] = useState<TicketInfo | null>(null);
  const [newNote, setNewNote] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  
  // Set up initial demo state on mount
  useEffect(() => {
    updateDemoState({
      clientId: 'cvs',
      scenario: 'tickets',
      role: 'support'
    });
    updateTimeAndGreeting();
    
    // Set interval to update time every minute
    const interval = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Filter tickets when search term or filters change
  useEffect(() => {
    let filtered = [...tickets];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply tier filter
    if (tierFilter !== 'All') {
      filtered = filtered.filter(ticket => ticket.tier === tierFilter);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(term) ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term) ||
        (ticket.notes && ticket.notes.some(note => note.toLowerCase().includes(term)))
      );
    }
    
    // Sort tickets by status and priority
    filtered.sort((a, b) => {
      // Open tickets first
      if (a.status === 'Open' && b.status !== 'Open') return -1;
      if (a.status !== 'Open' && b.status === 'Open') return 1;
      
      // Then by priority
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, tierFilter]);
  
  // Set personalized greeting based on time of day
  const updateTimeAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    setCurrentTime(now.toLocaleTimeString('en-US', options));
    
    let greeting = 'Good evening';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';
    
    setGreeting(greeting);
    
    // Format date like: Tuesday, March 25, 2025
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDateString(now.toLocaleDateString('en-US', dateOptions));
  };
  
  const handleSelectTicket = (ticket: TicketInfo) => {
    setSelectedTicket(ticket);
    setNewNote('');
    setEscalationReason('');
    setResolutionSummary(ticket.resolutionSummary || '');
  };
  
  const handleAddNote = () => {
    if (!selectedTicket || !newNote.trim()) return;
    
    dispatch(addTicketNote({
      ticketId: selectedTicket.id,
      note: newNote
    }));
    
    // Update the selected ticket
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    
    setNewNote('');
  };
  
  const handleEscalate = () => {
    if (!selectedTicket || !escalationReason.trim()) return;
    
    dispatch(escalateToTier2({
      ticketId: selectedTicket.id,
      reason: escalationReason
    }));
    
    // Update the selected ticket
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    
    setEscalationReason('');
  };
  
  const handleCloseTicket = () => {
    if (!selectedTicket || !resolutionSummary.trim()) return;
    
    dispatch(closeTicket({
      id: selectedTicket.id,
      resolution: resolutionSummary
    }));
    
    // Update the selected ticket
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
  };
  
  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'bg-green-50 text-green-700 hover:bg-green-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'Escalated': return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
      case 'Resolved': return 'bg-purple-50 text-purple-700 hover:bg-purple-100';
      case 'Closed': return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };
  
  const getTierColor = (tier: SupportTier) => {
    switch (tier) {
      case 'Tier1': return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'Tier2': return 'bg-red-50 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{greeting}, {userProfile?.firstName || 'Agent'}</h1>
              <p className="text-gray-600 mt-1">{dateString} • {currentTime}</p>
            </div>
            
            <Link
              href={buildDemoUrl('cvs', 'dashboard')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Return to Dashboard
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Ticket List */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden" style={{ boxShadow: softShadow }}>
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Support Tickets</h2>
                
                {/* Search bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'All' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setStatusFilter('All')}
                  >
                    All Status
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setStatusFilter('Open')}
                  >
                    Open
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'Escalated' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setStatusFilter('Escalated')}
                  >
                    Escalated
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === 'Closed' ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setStatusFilter('Closed')}
                  >
                    Closed
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${tierFilter === 'All' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setTierFilter('All')}
                  >
                    All Tiers
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${tierFilter === 'Tier1' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setTierFilter('Tier1')}
                  >
                    Tier 1 (CVS)
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm font-medium ${tierFilter === 'Tier2' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setTierFilter('Tier2')}
                  >
                    Tier 2 (Kigo Pro)
                  </button>
                </div>
              </div>
              
              {/* Ticket list */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {filteredTickets.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredTickets.map(ticket => (
                      <li 
                        key={ticket.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              {ticket.priority === 'High' && (
                                <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <p className="text-sm font-medium text-blue-600 truncate">{ticket.id}</p>
                              <TierBadge tier={ticket.tier} className="ml-2" />
                            </div>
                            <p className="mt-1 text-sm text-gray-900 font-medium">{ticket.subject}</p>
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {ticket.tokenId ? 'Token issue' : 'Account issue'} • Updated {formatDate(ticket.updatedDate)}
                            </p>
                          </div>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No tickets found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Ticket Details */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8">
            {selectedTicket ? (
              <div className="bg-white rounded-lg border border-gray-100 p-5" style={{ boxShadow: softShadow }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-gray-800">{selectedTicket.id}</h2>
                      <TicketStatusBadge status={selectedTicket.status} className="ml-2" />
                      <TierBadge tier={selectedTicket.tier} className="ml-2" />
                    </div>
                    <p className="text-lg font-medium mt-1">{selectedTicket.subject}</p>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(selectedTicket.createdDate)}
                  </div>
                </div>
                
                {/* Customer information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer ID</p>
                      <p className="font-medium">{selectedTicket.customerId}</p>
                    </div>
                    {selectedTicket.tokenId && (
                      <div>
                        <p className="text-sm text-gray-500">Related Token</p>
                        <Link 
                          href={buildDemoUrl('cvs', 'token-management')}
                          className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {selectedTicket.tokenId.substring(0, 8)}...
                          <ChevronRightIcon className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTicket.priority === 'High' ? 'bg-red-100 text-red-800' :
                        selectedTicket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    
                    {selectedTicket.assignedTo && (
                      <div>
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium">{selectedTicket.assignedTo}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedTicket.description}</p>
                  </div>
                </div>
                
                {/* Ticket Notes */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket Notes</h3>
                  {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {selectedTicket.notes.map((note, index) => (
                          <li key={index} className="p-3 bg-white">
                            <p className="text-sm text-gray-800">{note}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      No notes available for this ticket
                    </div>
                  )}
                </div>
                
                {/* Add Note */}
                {selectedTicket.status !== 'Closed' && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Add Note</h3>
                    <div className="mb-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Add a note to this ticket..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Escalation Section */}
                {selectedTicket.tier === 'Tier1' && selectedTicket.status !== 'Closed' && selectedTicket.status !== 'Escalated' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Escalate to Tier 2 Support</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      If this issue requires advanced token management or technical assistance, escalate to Kigo Pro specialists.
                    </p>
                    <div className="mb-2">
                      <textarea
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        rows={3}
                        placeholder="Explain why this ticket needs Tier 2 support..."
                        value={escalationReason}
                        onChange={(e) => setEscalationReason(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                        onClick={handleEscalate}
                        disabled={!escalationReason.trim()}
                      >
                        <ArrowUpTrayIcon className="inline-block h-4 w-4 mr-1" />
                        Escalate to Tier 2
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Resolution Section */}
                {selectedTicket.status === 'Closed' ? (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 mb-2">Resolution</h3>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <p className="text-sm text-green-800">{selectedTicket.resolutionSummary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
                    <div className="mb-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        rows={3}
                        placeholder="Describe how this ticket was resolved..."
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        onClick={handleCloseTicket}
                        disabled={!resolutionSummary.trim()}
                      >
                        <CheckCircleIcon className="inline-block h-4 w-4 mr-1" />
                        Close Ticket as Resolved
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div>
                    <Link
                      href={buildDemoUrl('cvs', 'token-management')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View in Token Management
                    </Link>
                  </div>
                  
                  {selectedTicket.tier === 'Tier2' && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium mr-2">Tier 2</span>
                      This ticket is being handled by Kigo Pro specialists
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-100 p-8 text-center" style={{ boxShadow: softShadow }}>
                <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No ticket selected</h3>
                <p className="mt-1 text-gray-500">
                  Select a ticket from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 