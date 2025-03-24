'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Image from 'next/image';
import Card from '@/components/ui/data-display/Card';
import StandardDashboard from '@/components/shared/StandardDashboard';

// Sample data for token management
const sampleTickets = [
  {
    id: 'T-1234',
    customerName: 'John Smith',
    cardNumber: '**** **** **** 5678',
    issueType: 'Expired Token',
    status: 'Open',
    priority: 'High',
    createdAt: '2023-06-12T10:30:00',
    lastUpdated: '2023-06-12T14:45:00',
  },
  {
    id: 'T-1235',
    customerName: 'Maria Garcia',
    cardNumber: '**** **** **** 9012',
    issueType: 'Token Not Working',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2023-06-11T08:15:00',
    lastUpdated: '2023-06-12T11:20:00',
  },
  {
    id: 'T-1236',
    customerName: 'Robert Chen',
    cardNumber: '**** **** **** 3456',
    issueType: 'Missing Rewards',
    status: 'Pending Customer',
    priority: 'Medium',
    createdAt: '2023-06-10T15:45:00',
    lastUpdated: '2023-06-12T09:30:00',
  },
  {
    id: 'T-1237',
    customerName: 'Samantha Lee',
    cardNumber: '**** **** **** 7890',
    issueType: 'Unable to Login',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2023-06-09T12:10:00',
    lastUpdated: '2023-06-11T16:25:00',
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch(status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Customer':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

// Priority indicator component
function PriorityIndicator({ priority }: { priority: string }) {
  const getPriorityStyles = () => {
    switch(priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="flex items-center">
      <span className={`font-medium ${getPriorityStyles()}`}>{priority}</span>
    </div>
  );
}

export default function CVSTokenManagementView() {
  const { userProfile, setThemeMode } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<typeof sampleTickets[0] | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  
  // Set theme to light mode on component mount
  useEffect(() => {
    setThemeMode('light');
    
    // Set current date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    }));
  }, [setThemeMode]);
  
  // Filter tickets based on search query
  const filteredTickets = sampleTickets.filter(ticket => 
    ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.issueType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Create stats section for StandardDashboard
  const statsSection = (
    <>
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4 text-blue-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Open Tickets</p>
            <p className="text-2xl font-bold">{sampleTickets.filter(t => t.status === 'Open').length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-lg mr-4 text-red-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold">{sampleTickets.filter(t => t.priority === 'High').length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Resolved Today</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4 text-purple-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Resolution Time</p>
            <p className="text-2xl font-bold">3.2h</p>
          </div>
        </div>
      </Card>
    </>
  );
  
  // Custom header content with logo
  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-14 w-24 relative mr-4">
          <Image 
            src="/logos/cvs-logo.svg" 
            alt="CVS Logo" 
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#cc0000]">
            Good morning, {userProfile.firstName}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentDate} • <span className="text-[#cc0000] font-medium">ExtraCare Token Management</span>
          </p>
          <p className="text-sm text-gray-500 italic mt-1">
            Success is not final, failure is not fatal. It is the courage to continue that counts.
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="inline-flex items-center rounded-md bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a00000]">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>
    </div>
  );
  
  // Create the main content
  const mainContent = (
    <div className="space-y-6">
      {/* Search and ticket detail panel */}
      <div className="flex gap-6">
        {/* Ticket list panel */}
        <div className="flex-1">
          <Card>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Customer Tickets</h2>
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
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? 'border-[#cc0000] bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="text-sm text-gray-900 mt-2 font-medium">{ticket.customerName}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">{ticket.issueType}</span>
                      <PriorityIndicator priority={ticket.priority} />
                    </div>
                  </div>
                ))}
                
                {filteredTickets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tickets match your search
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Ticket details panel */}
        <div className="flex-1">
          <Card>
            {selectedTicket ? (
              <div className="p-5">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-bold">{selectedTicket.id}</h2>
                    <div className="text-sm text-gray-500 mt-1">
                      Created: {formatDate(selectedTicket.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={selectedTicket.status} />
                </div>
                
                <div className="grid gap-5 grid-cols-2 mb-5 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 font-medium">{selectedTicket.customerName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Card Number</h3>
                    <p className="mt-1 font-medium">{selectedTicket.cardNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issue Type</h3>
                    <p className="mt-1 flex items-center font-medium">
                      {selectedTicket.issueType}
                      <span className="ml-2">
                        <PriorityIndicator priority={selectedTicket.priority} />
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1 font-medium">{formatDate(selectedTicket.lastUpdated)}</p>
                  </div>
                </div>
                
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Activity Timeline</h3>
                  <div className="border-l-2 border-gray-200 pl-4 space-y-4 ml-2">
                    <div>
                      <div className="flex items-center">
                        <div className="absolute -ml-6 mt-1 w-4 h-4 rounded-full bg-[#cc0000]"></div>
                        <p className="text-sm font-medium">Ticket Created</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(selectedTicket.createdAt)}</p>
                      <p className="text-sm mt-1">Initial ticket created for {selectedTicket.issueType}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <div className="absolute -ml-6 mt-1 w-4 h-4 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium">Assigned to Support Team</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(new Date(new Date(selectedTicket.createdAt).getTime() + 30*60000).toISOString())}</p>
                      <p className="text-sm mt-1">Ticket assigned to Payment Processing Team</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <div className="absolute -ml-6 mt-1 w-4 h-4 rounded-full bg-gray-400"></div>
                        <p className="text-sm font-medium">Status Update</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(selectedTicket.lastUpdated)}</p>
                      <p className="text-sm mt-1">Investigating token expiration issue...</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Add Comment</h3>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-3" 
                    rows={3}
                    placeholder="Add your comment here..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  <button className="inline-flex items-center rounded-md bg-[#cc0000] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a00000]">
                    Update Status
                  </button>
                  <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Assign
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-gray-500 py-20">
                <svg className="h-16 w-16 mx-auto text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">No Ticket Selected</h3>
                <p>Select a ticket from the list to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
  
  // Custom sidebar
  const sidebarContent = (
    <>
      <div className="bg-blue-50 rounded-lg p-5 shadow-sm mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Hey {userProfile.firstName}, I'm your AI Assistant</h3>
            <p className="text-sm text-gray-600">Personalized insights for your support cases</p>
          </div>
        </div>
        <div className="mt-4">
          <ul className="space-y-2">
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Analyze current token issues</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Run support report</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          </ul>
        </div>
      </div>
      
      <Card title="Recent Notifications">
        <div className="p-4 space-y-3">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <h4 className="font-medium text-yellow-800">System Update</h4>
            <p className="text-sm text-gray-600 mt-1">
              Token management system will be updated tonight at 2 AM EST. Expect 15 minutes of downtime.
            </p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800">New Process</h4>
            <p className="text-sm text-gray-600 mt-1">
              Updated token validation process now in effect. Please review the documentation.
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-800">Team Meeting</h4>
            <p className="text-sm text-gray-600 mt-1">
              Daily standup at 10:00 AM in the virtual meeting room.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
  
  return (
    <StandardDashboard
      headerContent={headerContent}
      statsSection={statsSection}
      sidebarContent={sidebarContent}
    >
      {mainContent}
    </StandardDashboard>
  );
} 