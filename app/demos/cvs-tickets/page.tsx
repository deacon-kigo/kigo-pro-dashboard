'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildDemoUrl } from '@/lib/utils/url';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ArrowUpTrayIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  UsersIcon,
  BoltIcon,
  CircleStackIcon,
  ArrowsRightLeftIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/Tabs";

// Import redux hooks
import { useAppSelector, useAppDispatch, useDemoState } from '@/lib/redux/hooks';
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
import { TicketStatusBadge, TierBadge } from '@/components/molecules/badges/TicketBadge';
import TicketModal from '@/components/features/token-management/TicketModal';

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

// Add this constant for ticket priority colors
const PRIORITY_COLORS = {
  'High': 'bg-red-50 text-red-700 border-red-200',
  'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Low': 'bg-blue-50 text-blue-700 border-blue-200'
};

export default function CVSTicketsView() {
  const { userProfile } = useDemoState();
  const dispatch = useAppDispatch();
  
  // Get tickets from redux
  const { tickets, selectedTicket: reduxSelectedTicket } = useAppSelector(state => state.cvsToken);
  const { features } = useAppSelector(state => state.featureConfig);
  // Get the sidebar width from Redux state
  const { sidebarWidth } = useAppSelector(state => state.ui);
  
  // Local component state
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [dateString, setDateString] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketInfo | null>(null);
  const [newNote, setNewNote] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'tier1' | 'tier2' | 'escalated' | 'closed'>('all');
  const [currentTab, setCurrentTab] = useState<string>('all');
  
  // Flag for external ticketing system mode
  const useExternalSystem = features?.ticketing?.useExternalSystem || false;
  const externalSystemName = features?.ticketing?.externalSystemName || 'External System';
  
  // Update time and greeting on component mount
  useEffect(() => {
    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  // Update time and greeting
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
  
  // Sync with redux selected ticket
  useEffect(() => {
    if (reduxSelectedTicket) {
      setSelectedTicket(reduxSelectedTicket);
    }
  }, [reduxSelectedTicket]);

  // Handle selecting a ticket
  const handleSelectTicket = (ticket: TicketInfo) => {
    dispatch(selectTicket(ticket.id));
    setSelectedTicket(ticket);
  };
  
  // Filter tickets based on current filter and search term
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      searchTerm === '' || 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (currentTab) {
      case 'tier1':
        return ticket.tier === 'Tier1' && ticket.status !== 'Closed';
      case 'tier2':
        return ticket.tier === 'Tier2' && ticket.status !== 'Closed';
      case 'escalated':
        return ticket.status === 'Escalated';
      case 'closed':
        return ticket.status === 'Closed';
      case 'open':
        return ticket.status === 'Open' || ticket.status === 'In Progress';
      case 'all':
      default:
        return true;
    }
  });
  
  // Add note to ticket
  const handleAddNote = () => {
    if (!selectedTicket || !newNote.trim()) return;
    
    dispatch(addTicketNote({
      ticketId: selectedTicket.id,
      note: `${userProfile?.firstName || 'Agent'}: ${newNote}`
    }));
    
    // Update the selected ticket
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
    
    setNewNote('');
  };
  
  // Escalate ticket to tier 2
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
  
  // Close ticket with resolution
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
  
  // Create a new ticket
  const handleCreateTicket = () => {
    dispatch(toggleTicketModal());
  };
  
  // External system integration
  const openInExternalSystem = (ticketId: string) => {
    alert(`Opening ticket ${ticketId} in ${externalSystemName}...`);
    // In a real implementation, this would redirect to or open the external system
  };
  
  // Handle automatic actions from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');
      
      if (action === 'create') {
        dispatch(toggleTicketModal());
      }
    }
  }, [dispatch]);
  
  // Component for ticket details
  const TicketDetailsPanel = () => {
    if (!selectedTicket) {
      return (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center" style={{ boxShadow: softShadow }}>
          <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No ticket selected</h3>
          <p className="mt-1 text-gray-500">
            Select a ticket from the list to view details
          </p>
          <button 
            onClick={handleCreateTicket}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Ticket
          </button>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden h-full flex flex-col" style={{ boxShadow: softShadow }}>
        {/* Ticket Header */}
        <div className={`p-4 border-b border-gray-100 ${selectedTicket.tier === 'Tier1' ? 'bg-blue-50' : 'bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="mr-2">Ticket {selectedTicket.id}</span>
              <TicketStatusBadge status={selectedTicket.status} />
            </h2>
            
            <div className="flex items-center space-x-2">
              <TierBadge tier={selectedTicket.tier} />
              
              <button
                onClick={handleCreateTicket}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                New Ticket
              </button>
              
              {useExternalSystem && (
                <button
                  onClick={() => openInExternalSystem(selectedTicket.id)}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Open in {externalSystemName}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <h3 className="font-medium">{selectedTicket.subject}</h3>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-600 gap-2">
            <span className={`px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[selectedTicket.priority]}`}>
              {selectedTicket.priority} Priority
            </span>
            <span>Created: {formatDate(selectedTicket.createdDate)}</span>
            <span>Updated: {formatDate(selectedTicket.updatedDate)}</span>
          </div>
          
          {selectedTicket.customerId && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <UserCircleIcon className="h-4 w-4 mr-1" />
              <span>Customer ID: {selectedTicket.customerId}</span>
            </div>
          )}
          
          {selectedTicket.tokenId && (
            <div className="mt-1 flex items-center text-sm text-blue-600">
              <CircleStackIcon className="h-4 w-4 mr-1" />
              <span>Token ID: {selectedTicket.tokenId}</span>
            </div>
          )}
        </div>
        
        {/* Ticket Body */}
        <div className="flex-1 overflow-auto">
          {/* Description */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
              {selectedTicket.description}
            </div>
          </div>
          
          {/* Notes */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Support Notes</h3>
            {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedTicket.notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                    {note}
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {index === 0 ? 'Initial note' : `Note ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No notes yet</div>
            )}
            
            {selectedTicket.status !== 'Closed' && (
              <div className="mt-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Add a note..."
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Escalation (only for Tier1 tickets) */}
          {selectedTicket.tier === 'Tier1' && selectedTicket.status !== 'Closed' && selectedTicket.status !== 'Escalated' && (
            <div className="p-4 border-b border-gray-100 bg-yellow-50">
              <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                <ArrowsRightLeftIcon className="h-4 w-4 mr-1" />
                Escalate to Tier 2 (Kigo PRO)
              </h3>
              <p className="text-xs text-yellow-700 mb-2">
                Escalate this ticket to Kigo PRO specialists for advanced token management assistance.
              </p>
              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm bg-white"
                placeholder="Explain reason for escalation..."
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleEscalate}
                  disabled={!escalationReason.trim()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Escalate Ticket
                </button>
              </div>
            </div>
          )}
          
          {/* Resolution (for all tickets except closed) */}
          {selectedTicket.status !== 'Closed' && (
            <div className="p-4 border-b border-gray-100 bg-green-50">
              <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Resolve Ticket
              </h3>
              <textarea
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm bg-white"
                placeholder="Provide resolution summary..."
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleCloseTicket}
                  disabled={!resolutionSummary.trim()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          )}
          
          {/* Resolution Summary (for closed tickets) */}
          {selectedTicket.status === 'Closed' && selectedTicket.resolutionSummary && (
            <div className="p-4 border-t border-gray-100 bg-green-50">
              <h3 className="text-sm font-medium text-green-800 mb-2">Resolution Summary</h3>
              <div className="bg-white rounded-md p-3 text-sm text-gray-700 border border-green-200">
                {selectedTicket.resolutionSummary}
              </div>
              <div className="text-xs text-green-800 mt-2 text-right">
                Closed on {formatDate(selectedTicket.updatedDate)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main 
        className="py-6 overflow-auto"
        style={{ 
          position: 'fixed',
          top: '72px',  // Header height
          bottom: '56px', // Footer height
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8">
          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Ticket List */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              {/* Search and Create Ticket Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1 mr-2">
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
                <button
                  onClick={handleCreateTicket}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New Ticket
                </button>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="all" className="mb-4" onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tier1">Tier 1</TabsTrigger>
                  <TabsTrigger value="tier2">Tier 2</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="escalated">Escalated</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Ticket List */}
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden" style={{ boxShadow: softShadow }}>
                {filteredTickets.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No tickets found matching the current filters
                  </div>
                ) : (
                  <div className="space-y-0 max-h-[calc(100vh-360px)] overflow-y-auto">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSelectTicket(ticket)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                              {ticket.tier === 'Tier1' 
                                ? <BuildingStorefrontIcon className="h-5 w-5 text-blue-700" />
                                : <BoltIcon className="h-5 w-5 text-red-700" />
                              }
                            </div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-blue-600">{ticket.id}</span>
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${PRIORITY_COLORS[ticket.priority]}`}>
                                  {ticket.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 line-clamp-1">{ticket.subject}</p>
                            </div>
                          </div>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                        
                        <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                          <span>Updated {formatDate(ticket.updatedDate)}</span>
                          {ticket.tokenId && (
                            <span className="flex items-center text-blue-600">
                              <CircleStackIcon className="h-3 w-3 mr-1" />
                              Token linked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Ticket Details */}
            <div className="col-span-12 md:col-span-7 lg:col-span-8">
              <TicketDetailsPanel />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer 
        className="bg-white shadow-inner border-t border-gray-200 py-4"
        style={{ 
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          height: '56px',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8 flex justify-between items-center h-full">
          <div>
            <p className="text-xs text-gray-500">
              &copy; 2023 CVS Health + Kigo. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              Support Portal v1.2.3
            </p>
            <div className="flex items-center">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
              <Link href={buildDemoUrl('cvs', 'help')} className="text-xs text-blue-600 hover:text-blue-800">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Ticket Modal */}
      <TicketModal />
    </div>
  );
} 