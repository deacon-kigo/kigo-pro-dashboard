import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  ExternalTicketReference, 
  ActivityLog, 
  ActivitySyncStatus, 
  TokenActionType, 
  ExternalTicketStatus 
} from '@/lib/types/ticketing';
import { v4 as uuidv4 } from 'uuid';

// State structure for external ticketing
interface ExternalTicketingState {
  currentTicket: ExternalTicketReference | null;
  activities: ActivityLog[];
  loading: boolean;
  error: string | null;
  returnUrl: string | null;
}

// Initial state
const initialState: ExternalTicketingState = {
  currentTicket: null,
  activities: [],
  loading: false,
  error: null,
  returnUrl: null
};

// Helper to generate a timestamp in ISO format
const getCurrentTimestamp = () => new Date().toISOString();

// The external ticketing slice
const externalTicketingSlice = createSlice({
  name: 'externalTicketing',
  initialState,
  reducers: {
    // Set current external ticket reference
    setCurrentTicket: (state, action: PayloadAction<ExternalTicketReference>) => {
      state.currentTicket = action.payload;
      state.error = null;
    },
    
    // Clear current ticket context
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.activities = [];
      state.returnUrl = null;
    },
    
    // Set return URL for external system
    setReturnUrl: (state, action: PayloadAction<string>) => {
      state.returnUrl = action.payload;
    },
    
    // Record a token action in the activity log
    recordActivity: (state, action: PayloadAction<{
      actionType: TokenActionType;
      tokenId: string;
      notes?: string;
      beforeState?: any;
      afterState?: any;
      performedBy: string;
    }>) => {
      if (!state.currentTicket) {
        state.error = 'Cannot record activity: No active ticket context';
        return;
      }
      
      const { actionType, tokenId, notes, beforeState, afterState, performedBy } = action.payload;
      
      const newActivity: ActivityLog = {
        id: uuidv4(),
        externalTicketId: state.currentTicket.externalId,
        customerId: state.currentTicket.customerId,
        actionType,
        tokenId,
        notes: notes || '',
        beforeState,
        afterState,
        performedBy,
        performedAt: getCurrentTimestamp(),
        syncStatus: 'Pending'
      };
      
      state.activities.push(newActivity);
    },
    
    // Update sync status for an activity
    updateActivitySyncStatus: (state, action: PayloadAction<{
      activityId: string;
      syncStatus: ActivitySyncStatus;
    }>) => {
      const { activityId, syncStatus } = action.payload;
      const activity = state.activities.find(a => a.id === activityId);
      
      if (activity) {
        activity.syncStatus = syncStatus;
      }
    },
    
    // Add notes to an existing activity
    addActivityNotes: (state, action: PayloadAction<{
      activityId: string;
      notes: string;
    }>) => {
      const { activityId, notes } = action.payload;
      const activity = state.activities.find(a => a.id === activityId);
      
      if (activity) {
        activity.notes = activity.notes 
          ? `${activity.notes}\n\n${notes}` 
          : notes;
      }
    },
    
    // Update external ticket status
    updateExternalTicketStatus: (state, action: PayloadAction<ExternalTicketStatus>) => {
      if (state.currentTicket) {
        state.currentTicket.externalStatus = action.payload;
        state.currentTicket.updatedAt = getCurrentTimestamp();
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Export actions and reducer
export const { 
  setCurrentTicket, 
  clearCurrentTicket, 
  setReturnUrl,
  recordActivity, 
  updateActivitySyncStatus, 
  addActivityNotes,
  updateExternalTicketStatus,
  setLoading, 
  setError 
} = externalTicketingSlice.actions;

export default externalTicketingSlice.reducer; 