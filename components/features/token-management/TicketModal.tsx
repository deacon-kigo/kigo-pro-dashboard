'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  createTicket, 
  updateTicket, 
  toggleTicketModal,
  escalateToTier2,
  addTicketNote,
  closeTicket,
  TokenInfo, 
  TicketInfo, 
  TicketPriority, 
  SupportTier 
} from '@/lib/redux/slices/cvsTokenSlice';
import { useDemo } from '@/contexts/DemoContext';

const TicketModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userProfile } = useDemo();
  
  const { 
    showTicketModal, 
    selectedTicket, 
    selectedCustomer, 
    selectedToken 
  } = useAppSelector(state => state.cvsToken);
  
  const [ticket, setTicket] = useState<{
    subject: string;
    description: string;
    priority: TicketPriority;
    tier: SupportTier;
    note: string;
    resolution: string;
  }>({
    subject: '',
    description: '',
    priority: 'Medium',
    tier: 'Tier1',
    note: '',
    resolution: ''
  });
  
  // Populate form with selected ticket data when editing
  useEffect(() => {
    if (selectedTicket) {
      setTicket({
        subject: selectedTicket.subject,
        description: selectedTicket.description,
        priority: selectedTicket.priority,
        tier: selectedTicket.tier,
        note: '',
        resolution: selectedTicket.resolutionSummary || ''
      });
    } else {
      // If creating a new ticket with a selected token, prepopulate with token info
      if (selectedToken) {
        setTicket({
          subject: `Issue with ${selectedToken.name}`,
          description: `Customer reported an issue with their ${selectedToken.name} token. Current state: ${selectedToken.state}`,
          priority: 'Medium',
          tier: 'Tier1',
          note: '',
          resolution: ''
        });
      } else {
        // Default for a new ticket without token context
        setTicket({
          subject: '',
          description: '',
          priority: 'Medium',
          tier: 'Tier1',
          note: '',
          resolution: ''
        });
      }
    }
  }, [selectedTicket, selectedToken]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTicket) {
      // Update existing ticket
      dispatch(updateTicket({
        id: selectedTicket.id,
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority as TicketPriority
      }));
    } else {
      // Create new ticket
      if (!selectedCustomer) return;
      
      dispatch(createTicket({
        customerId: selectedCustomer.id,
        tokenId: selectedToken?.id,
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority as TicketPriority,
        status: 'Open',
        tier: ticket.tier
      }));
    }
    
    dispatch(toggleTicketModal());
  };
  
  const handleEscalate = () => {
    if (!selectedTicket) return;
    
    dispatch(escalateToTier2({
      ticketId: selectedTicket.id,
      reason: ticket.note
    }));
    
    setTicket(prev => ({
      ...prev,
      note: ''
    }));
  };
  
  const handleAddNote = () => {
    if (!selectedTicket || !ticket.note.trim()) return;
    
    dispatch(addTicketNote({
      ticketId: selectedTicket.id,
      note: ticket.note
    }));
    
    setTicket(prev => ({
      ...prev,
      note: ''
    }));
  };
  
  const handleCloseTicket = () => {
    if (!selectedTicket || !ticket.resolution.trim()) return;
    
    dispatch(closeTicket({
      id: selectedTicket.id,
      resolution: ticket.resolution
    }));
    
    dispatch(toggleTicketModal());
  };
  
  if (!showTicketModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold">
            {selectedTicket ? `Ticket: ${selectedTicket.id}` : 'Create New Support Ticket'}
          </h2>
          <button 
            onClick={() => dispatch(toggleTicketModal())}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Customer Info */}
            {selectedCustomer && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                <p>
                  <span className="text-gray-600">Name:</span> {selectedCustomer.firstName} {selectedCustomer.lastName}
                </p>
                <p>
                  <span className="text-gray-600">ID:</span> {selectedCustomer.extraCareId}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> {selectedCustomer.email}
                </p>
              </div>
            )}
            
            {/* Token Info (if applicable) */}
            {selectedToken && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Token Information</h3>
                <p>
                  <span className="text-blue-600">Name:</span> {selectedToken.name}
                </p>
                <p>
                  <span className="text-blue-600">State:</span> {selectedToken.state}
                </p>
                <p>
                  <span className="text-blue-600">Type:</span> {selectedToken.type}
                </p>
              </div>
            )}
            
            {/* Ticket Status (for existing tickets) */}
            {selectedTicket && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-medium ${
                    selectedTicket.status === 'Open' ? 'bg-green-100 text-green-800' : 
                    selectedTicket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                    selectedTicket.status === 'Escalated' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTicket.status}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Support Tier</p>
                  <div className={`mt-1 px-3 py-1 inline-block rounded-full text-sm font-medium ${
                    selectedTicket.tier === 'Tier1' ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedTicket.tier === 'Tier1' ? 'Tier 1 (CVS)' : 'Tier 2 (Kigo Pro)'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Ticket Notes (for existing tickets) */}
            {selectedTicket && selectedTicket.notes && selectedTicket.notes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Ticket Notes</h3>
                <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <ul className="space-y-2">
                    {selectedTicket.notes.map((note, index) => (
                      <li key={index} className="text-sm pb-2 border-b border-gray-200 last:border-0">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Subject Line */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={ticket.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={selectedTicket?.status === 'Closed'}
              />
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={ticket.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={selectedTicket?.status === 'Closed'}
              />
            </div>
            
            {/* Priority */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={ticket.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={selectedTicket?.status === 'Closed'}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            {/* Support Tier (only for new tickets) */}
            {!selectedTicket && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tier">
                  Initial Support Tier
                </label>
                <select
                  id="tier"
                  name="tier"
                  value={ticket.tier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tier1">Tier 1 (CVS)</option>
                  <option value="Tier2">Tier 2 (Kigo Pro)</option>
                </select>
              </div>
            )}
            
            {/* Add a Note (for existing tickets) */}
            {selectedTicket && selectedTicket.status !== 'Closed' && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Add a Note</h3>
                <textarea
                  id="note"
                  name="note"
                  value={ticket.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter additional notes or information about this ticket..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={!ticket.note.trim()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}
            
            {/* Escalation Section (for Tier 1 open tickets) */}
            {selectedTicket && selectedTicket.tier === 'Tier1' && selectedTicket.status !== 'Closed' && (
              <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Escalate to Tier 2 Support</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Escalate this ticket to Kigo PRO specialists for advanced token management support.
                </p>
                <textarea
                  id="note"
                  name="note"
                  value={ticket.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter reason for escalation..."
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleEscalate}
                    disabled={!ticket.note.trim()}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Escalate to Tier 2
                  </button>
                </div>
              </div>
            )}
            
            {/* Resolution Section (for open tickets) */}
            {selectedTicket && selectedTicket.status !== 'Closed' && (
              <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Resolution</h3>
                <p className="text-sm text-green-700 mb-3">
                  Close this ticket by providing a resolution summary.
                </p>
                <textarea
                  id="resolution"
                  name="resolution"
                  value={ticket.resolution}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter resolution details..."
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseTicket}
                    disabled={!ticket.resolution.trim()}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            )}
            
            {/* Resolution Summary (for closed tickets) */}
            {selectedTicket && selectedTicket.status === 'Closed' && selectedTicket.resolutionSummary && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Resolution Summary</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800">{selectedTicket.resolutionSummary}</p>
                </div>
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => dispatch(toggleTicketModal())}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {(!selectedTicket || (selectedTicket && selectedTicket.status !== 'Closed')) && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedTicket ? 'Update Ticket' : 'Create Ticket'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketModal; 