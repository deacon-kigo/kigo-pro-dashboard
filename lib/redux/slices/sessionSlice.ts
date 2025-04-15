import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface SessionState {
  // Inactivity tracking
  lastActivity: number; // Timestamp of last user activity
  sessionTimeoutMinutes: number; // How long until session times out (default: 60 minutes)
  warningTimeoutMinutes: number; // How long before timeout to show warning (default: 5 minutes)
  showTimeoutWarning: boolean; // Whether to show the timeout warning dialog
  remainingSeconds: number; // Countdown for the warning dialog

  // Session state
  isSessionExpired: boolean; // Whether the session has expired
}

const initialState: SessionState = {
  lastActivity: Date.now(),
  sessionTimeoutMinutes: 60,
  warningTimeoutMinutes: 5,
  showTimeoutWarning: false,
  remainingSeconds: 5 * 60, // Default 5 minutes in seconds
  isSessionExpired: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    // Record user activity to reset inactivity timer
    recordUserActivity: (state) => {
      state.lastActivity = Date.now();

      // If warning is showing and user interacts, reset it
      if (state.showTimeoutWarning) {
        state.showTimeoutWarning = false;
        state.remainingSeconds = state.warningTimeoutMinutes * 60;
      }
    },

    // Show the timeout warning
    showWarning: (state) => {
      state.showTimeoutWarning = true;
      state.remainingSeconds = state.warningTimeoutMinutes * 60;
    },

    // Hide the timeout warning
    hideWarning: (state) => {
      state.showTimeoutWarning = false;
    },

    // Update countdown timer
    updateCountdown: (state, action: PayloadAction<number>) => {
      state.remainingSeconds = action.payload;
    },

    // Set session as expired, which will trigger logout
    expireSession: (state) => {
      state.isSessionExpired = true;
      state.showTimeoutWarning = false;
    },

    // Reset expired state (called after logout completes)
    resetExpiredState: (state) => {
      state.isSessionExpired = false;
      state.lastActivity = Date.now();
    },

    // Configure timeout settings
    configureTimeouts: (
      state,
      action: PayloadAction<{
        sessionTimeoutMinutes?: number;
        warningTimeoutMinutes?: number;
      }>
    ) => {
      const { sessionTimeoutMinutes, warningTimeoutMinutes } = action.payload;

      if (sessionTimeoutMinutes !== undefined) {
        state.sessionTimeoutMinutes = sessionTimeoutMinutes;
      }

      if (warningTimeoutMinutes !== undefined) {
        state.warningTimeoutMinutes = warningTimeoutMinutes;
        // Also reset the remaining seconds if we're showing warning
        if (state.showTimeoutWarning) {
          state.remainingSeconds = warningTimeoutMinutes * 60;
        }
      }
    },
  },
});

// Selectors
export const selectSessionState = (state: RootState) => state.session;
export const selectLastActivity = (state: RootState) =>
  state.session.lastActivity;
export const selectShowTimeoutWarning = (state: RootState) =>
  state.session.showTimeoutWarning;
export const selectRemainingSeconds = (state: RootState) =>
  state.session.remainingSeconds;
export const selectIsSessionExpired = (state: RootState) =>
  state.session.isSessionExpired;
export const selectSessionTimeoutMinutes = (state: RootState) =>
  state.session.sessionTimeoutMinutes;
export const selectWarningTimeoutMinutes = (state: RootState) =>
  state.session.warningTimeoutMinutes;

export const {
  recordUserActivity,
  showWarning,
  hideWarning,
  updateCountdown,
  expireSession,
  resetExpiredState,
  configureTimeouts,
} = sessionSlice.actions;

export default sessionSlice.reducer;
