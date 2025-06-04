import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Selection event for tracking history
export interface SelectionEvent {
  id: string;
  timestamp: string;
  action: "select" | "deselect" | "bulk_select" | "bulk_deselect" | "clear_all";
  programIds: string[];
  context?: string; // e.g., "modal", "bulk_action"
}

// Program selection state interface
export interface ProgramSelectionState {
  selectedProgramIds: string[];
  selectionHistory: SelectionEvent[];
  lastSelectionTime: string | null;
  totalSelectedCount: number;
  isSelectionModalOpen: boolean;
  collapsedState: boolean; // For UI state
}

// Initial state
const initialState: ProgramSelectionState = {
  selectedProgramIds: [],
  selectionHistory: [],
  lastSelectionTime: null,
  totalSelectedCount: 0,
  isSelectionModalOpen: false,
  collapsedState: true,
};

// Helper function to create selection event
const createSelectionEvent = (
  action: SelectionEvent["action"],
  programIds: string[],
  context?: string
): SelectionEvent => ({
  id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
  timestamp: new Date().toISOString(),
  action,
  programIds,
  context,
});

// Create the slice
export const programSelectionSlice = createSlice({
  name: "programSelection",
  initialState,
  reducers: {
    // Select single program
    selectProgram: (
      state,
      action: PayloadAction<{ programId: string; context?: string }>
    ) => {
      const { programId, context } = action.payload;

      if (!state.selectedProgramIds.includes(programId)) {
        state.selectedProgramIds.push(programId);
        state.totalSelectedCount = state.selectedProgramIds.length;
        state.lastSelectionTime = new Date().toISOString();

        // Add to history
        state.selectionHistory.push(
          createSelectionEvent("select", [programId], context)
        );

        console.log(
          `📋 Redux: Program ${programId} selected. Total: ${state.totalSelectedCount}`
        );
      }
    },

    // Deselect single program
    deselectProgram: (
      state,
      action: PayloadAction<{ programId: string; context?: string }>
    ) => {
      const { programId, context } = action.payload;

      const index = state.selectedProgramIds.indexOf(programId);
      if (index > -1) {
        state.selectedProgramIds.splice(index, 1);
        state.totalSelectedCount = state.selectedProgramIds.length;
        state.lastSelectionTime = new Date().toISOString();

        // Add to history
        state.selectionHistory.push(
          createSelectionEvent("deselect", [programId], context)
        );

        console.log(
          `📋 Redux: Program ${programId} deselected. Total: ${state.totalSelectedCount}`
        );
      }
    },

    // Bulk select multiple programs
    selectMultiplePrograms: (
      state,
      action: PayloadAction<{ programIds: string[]; context?: string }>
    ) => {
      const { programIds, context } = action.payload;

      const newSelections: string[] = [];
      programIds.forEach((programId) => {
        if (!state.selectedProgramIds.includes(programId)) {
          state.selectedProgramIds.push(programId);
          newSelections.push(programId);
        }
      });

      if (newSelections.length > 0) {
        state.totalSelectedCount = state.selectedProgramIds.length;
        state.lastSelectionTime = new Date().toISOString();

        // Add to history
        state.selectionHistory.push(
          createSelectionEvent("bulk_select", newSelections, context)
        );

        console.log(
          `📋 Redux: ${newSelections.length} programs bulk selected. Total: ${state.totalSelectedCount}`
        );
      }
    },

    // Bulk deselect multiple programs
    deselectMultiplePrograms: (
      state,
      action: PayloadAction<{ programIds: string[]; context?: string }>
    ) => {
      const { programIds, context } = action.payload;

      const removedSelections: string[] = [];
      programIds.forEach((programId) => {
        const index = state.selectedProgramIds.indexOf(programId);
        if (index > -1) {
          state.selectedProgramIds.splice(index, 1);
          removedSelections.push(programId);
        }
      });

      if (removedSelections.length > 0) {
        state.totalSelectedCount = state.selectedProgramIds.length;
        state.lastSelectionTime = new Date().toISOString();

        // Add to history
        state.selectionHistory.push(
          createSelectionEvent("bulk_deselect", removedSelections, context)
        );

        console.log(
          `📋 Redux: ${removedSelections.length} programs bulk deselected. Total: ${state.totalSelectedCount}`
        );
      }
    },

    // Set selected programs (replace entire selection)
    setSelectedPrograms: (
      state,
      action: PayloadAction<{ programIds: string[]; context?: string }>
    ) => {
      const { programIds, context } = action.payload;

      const previousSelection = [...state.selectedProgramIds];
      state.selectedProgramIds = [...programIds];
      state.totalSelectedCount = state.selectedProgramIds.length;
      state.lastSelectionTime = new Date().toISOString();

      // Add to history if there's a meaningful change
      const sortedPrevious = [...previousSelection].sort();
      const sortedNew = [...programIds].sort();
      if (JSON.stringify(sortedPrevious) !== JSON.stringify(sortedNew)) {
        state.selectionHistory.push(
          createSelectionEvent(
            "bulk_select",
            programIds,
            context || "set_selection"
          )
        );

        console.log(
          `📋 Redux: Selection set to ${programIds.length} programs. Total: ${state.totalSelectedCount}`
        );
      }
    },

    // Clear all selections
    clearAllSelections: (
      state,
      action: PayloadAction<{ context?: string }>
    ) => {
      const { context } = action.payload || {};

      const previousSelection = [...state.selectedProgramIds];
      state.selectedProgramIds = [];
      state.totalSelectedCount = 0;
      state.lastSelectionTime = new Date().toISOString();

      if (previousSelection.length > 0) {
        // Add to history
        state.selectionHistory.push(
          createSelectionEvent("clear_all", previousSelection, context)
        );

        console.log("📋 Redux: All selections cleared");
      }
    },

    // UI state management
    setSelectionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSelectionModalOpen = action.payload;
      console.log(
        `📋 Redux: Selection modal ${action.payload ? "opened" : "closed"}`
      );
    },

    setCollapsedState: (state, action: PayloadAction<boolean>) => {
      state.collapsedState = action.payload;
    },

    // Clear selection history (for performance or privacy)
    clearSelectionHistory: (state) => {
      state.selectionHistory = [];
      console.log("📋 Redux: Selection history cleared");
    },

    // Remove old history entries (keep last N entries)
    trimSelectionHistory: (state, action: PayloadAction<number>) => {
      const keepCount = action.payload;
      if (state.selectionHistory.length > keepCount) {
        state.selectionHistory = state.selectionHistory.slice(-keepCount);
        console.log(
          `📋 Redux: Selection history trimmed to ${keepCount} entries`
        );
      }
    },
  },
});

// Export actions
export const {
  selectProgram,
  deselectProgram,
  selectMultiplePrograms,
  deselectMultiplePrograms,
  setSelectedPrograms,
  clearAllSelections,
  setSelectionModalOpen,
  setCollapsedState,
  clearSelectionHistory,
  trimSelectionHistory,
} = programSelectionSlice.actions;

// Export reducer
export default programSelectionSlice.reducer;
