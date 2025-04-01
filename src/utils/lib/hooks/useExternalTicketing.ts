import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { 
  setCurrentTicket, 
  setReturnUrl, 
  recordActivity, 
  updateExternalTicketStatus,
  clearCurrentTicket
} from '@/lib/redux/slices/externalTicketingSlice';
import { TokenActionType, ActivityLog, ActionSummary } from '@/lib/types/ticketing';
import externalTicketingService from '@/lib/services/externalTicketingService';
import { useDemo } from '@/contexts/DemoContext';

/**
 * Hook for managing external ticketing functionality
 */
export function useExternalTicketing() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userProfile } = useDemo();
  
  // Get current state from Redux
  const { 
    currentTicket, 
    activities, 
    returnUrl, 
    loading, 
    error 
  } = useAppSelector(state => state.externalTicketing);
  
  const [initialized, setInitialized] = useState(false);
  
  // Initialize from URL parameters
  useEffect(() => {
    if (initialized) return;
    
    if (typeof window !== 'undefined') {
      const urlParams = externalTicketingService.parseUrlParams(window.location.href);
      
      if (urlParams) {
        console.log('External ticketing params detected:', urlParams);
        
        // Create ticket reference
        const ticketRef = externalTicketingService.createTicketReferenceFromParams(urlParams);
        
        // Store in Redux
        dispatch(setCurrentTicket(ticketRef));
        dispatch(setReturnUrl(urlParams.return_url));
        
        console.log('External ticket context initialized:', ticketRef);
      }
      
      setInitialized(true);
    }
  }, [dispatch, initialized]);
  
  // Create a function to record token actions
  const recordTokenAction = (
    actionType: TokenActionType,
    tokenId: string,
    notes?: string,
    beforeState?: any,
    afterState?: any
  ) => {
    if (!currentTicket) {
      console.error('Cannot record action: No active ticket context');
      return;
    }
    
    dispatch(recordActivity({
      actionType,
      tokenId,
      notes,
      beforeState,
      afterState,
      performedBy: userProfile?.userName || 'Unknown User'
    }));
  };
  
  // Function to return to external system with activity summary
  const returnToExternalSystem = async (customMessage?: string) => {
    if (!currentTicket || !returnUrl || activities.length === 0) {
      console.error('Cannot return to external system: Missing ticket context, return URL, or activities');
      return;
    }
    
    try {
      // Sync activities to external system
      const syncSuccess = await externalTicketingService.syncActivitiesToExternalSystem(
        currentTicket.externalId,
        currentTicket.externalSystem,
        activities,
        returnUrl
      );
      
      if (!syncSuccess) {
        console.error('Failed to sync activities to external system');
        return;
      }
      
      // Create action summary
      const summary = externalTicketingService.createActionSummary(activities, customMessage);
      
      // Generate return URL with summary data
      const completeReturnUrl = externalTicketingService.generateReturnUrl(returnUrl, summary);
      
      // Clear ticket context before navigating away
      dispatch(clearCurrentTicket());
      
      // Navigate back to external system
      window.location.href = completeReturnUrl;
    } catch (error) {
      console.error('Error returning to external system:', error);
    }
  };
  
  // Function to update external ticket status
  const updateTicketStatus = (status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed') => {
    dispatch(updateExternalTicketStatus(status));
  };
  
  // Check if there is an active external ticket context
  const hasActiveTicketContext = !!currentTicket;
  
  return {
    currentTicket,
    activities,
    returnUrl,
    loading,
    error,
    hasActiveTicketContext,
    recordTokenAction,
    returnToExternalSystem,
    updateTicketStatus
  };
} 