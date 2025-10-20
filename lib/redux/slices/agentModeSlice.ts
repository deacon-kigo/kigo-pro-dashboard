import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Agent Mode Slice
 *
 * Manages the AI agent's autonomous mode where it fills form fields
 * and interacts with the UI (Perplexity-style)
 */

export interface AgentModeState {
  isActive: boolean;
  currentAction: string | null;
  activeField: string | null;
  progress: {
    current: number;
    total: number;
  };
  message: string | null;
  fieldsBeingFilled: string[];
  completedFields: string[];
}

const initialState: AgentModeState = {
  isActive: false,
  currentAction: null,
  activeField: null,
  progress: {
    current: 0,
    total: 0,
  },
  message: null,
  fieldsBeingFilled: [],
  completedFields: [],
};

const agentModeSlice = createSlice({
  name: "agentMode",
  initialState,
  reducers: {
    startAgentMode: (
      state,
      action: PayloadAction<{ total: number; message?: string }>
    ) => {
      state.isActive = true;
      state.progress.total = action.payload.total;
      state.progress.current = 0;
      state.message = action.payload.message || "AI Agent is configuring...";
      state.fieldsBeingFilled = [];
      state.completedFields = [];
    },

    stopAgentMode: (state) => {
      state.isActive = false;
      state.currentAction = null;
      state.activeField = null;
      state.progress = { current: 0, total: 0 };
      state.message = null;
      state.fieldsBeingFilled = [];
      state.completedFields = [];
    },

    setCurrentAction: (state, action: PayloadAction<string>) => {
      state.currentAction = action.payload;
    },

    setActiveField: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        // Remove from being filled and add to active
        state.fieldsBeingFilled = state.fieldsBeingFilled.filter(
          (f) => f !== action.payload
        );
        state.activeField = action.payload;
      } else {
        state.activeField = null;
      }
    },

    markFieldComplete: (state, action: PayloadAction<string>) => {
      const field = action.payload;

      // Remove from active
      if (state.activeField === field) {
        state.activeField = null;
      }

      // Remove from being filled
      state.fieldsBeingFilled = state.fieldsBeingFilled.filter(
        (f) => f !== field
      );

      // Add to completed
      if (!state.completedFields.includes(field)) {
        state.completedFields.push(field);
      }

      // Update progress
      state.progress.current += 1;
    },

    queueFieldsToFill: (state, action: PayloadAction<string[]>) => {
      state.fieldsBeingFilled = [
        ...new Set([...state.fieldsBeingFilled, ...action.payload]),
      ];
    },

    updateAgentMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },

    updateProgress: (
      state,
      action: PayloadAction<{ current?: number; total?: number }>
    ) => {
      if (action.payload.current !== undefined) {
        state.progress.current = action.payload.current;
      }
      if (action.payload.total !== undefined) {
        state.progress.total = action.payload.total;
      }
    },
  },
});

export const {
  startAgentMode,
  stopAgentMode,
  setCurrentAction,
  setActiveField,
  markFieldComplete,
  queueFieldsToFill,
  updateAgentMessage,
  updateProgress,
} = agentModeSlice.actions;

export default agentModeSlice.reducer;
