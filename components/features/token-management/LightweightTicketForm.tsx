'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  createLightweightTicket, 
  TicketPriority
} from '@/lib/redux/slices/cvsTokenSlice';
import { ExternalLinkIcon } from '@heroicons/react/24/outline';

type LightweightTicketFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
};

const LightweightTicketForm: React.FC<LightweightTicketFormProps> = ({
  onSuccess,
  onCancel,
  autoFocus = true
}) => {
  const dispatch = useAppDispatch();
  
  // Use Redux feature config
  const { features } = useAppSelector(state => state.featureConfig);
  const { selectedCustomer, selectedToken } = useAppSelector(state => state.cvsToken);
  
  const [subject, setSubject] = useState(selectedToken ? `Issue with ${selectedToken.name}` : '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) return;
    
    dispatch(createLightweightTicket({
      customerId: selectedCustomer.id,
      tokenId: selectedToken?.id,
      subject,
      description,
      priority,
    })).then(() => {
      if (onSuccess) onSuccess();
    });
  };
  
  const handleExternalSystemRedirect = () => {
    // In a real application, this would integrate with the external system
    window.alert(`Redirecting to ${features.ticketing.externalSystemName} for ticket creation with pre-filled data.`);
  };
  
  if (features.ticketing.useExternalSystem && !features.ticketing.enableInternalTicketing) {
    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Create Support Ticket</h3>
        <p className="text-sm text-gray-600 mb-3">
          This organization uses {features.ticketing.externalSystemName} for ticket management.
        </p>
        <button
          onClick={handleExternalSystemRedirect}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full flex items-center justify-center"
        >
          <ExternalLinkIcon className="h-4 w-4 mr-2" />
          Open in {features.ticketing.externalSystemName}
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-800 mb-2">Create Support Ticket</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            required
            autoFocus={autoFocus}
          />
        </div>
        
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the issue"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={3}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-xs text-gray-600">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default LightweightTicketForm; 