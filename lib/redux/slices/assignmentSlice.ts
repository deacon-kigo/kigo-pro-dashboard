import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Assignment item interface
export interface AssignmentItem {
  id: string;
  name: string;
  type: "promotedProgram";
  parentName: string;
  status: "pending" | "processing" | "success" | "failed";
  error?: string;
  startTime?: string;
  endTime?: string;
}

// Assignment statistics
export interface AssignmentStats {
  total: number;
  completed: number;
  successful: number;
  failed: number;
  processing: number;
  pending: number;
}

// Assignment state interface
export interface AssignmentState {
  filterId: string | null;
  filterName: string | null;
  assignmentItems: AssignmentItem[];
  isProcessing: boolean;
  hasActiveAssignments: boolean;
  stats: AssignmentStats;
  startTime: string | null;
  endTime: string | null;
}

// Initial state
const initialState: AssignmentState = {
  filterId: null,
  filterName: null,
  assignmentItems: [],
  isProcessing: false,
  hasActiveAssignments: false,
  stats: {
    total: 0,
    completed: 0,
    successful: 0,
    failed: 0,
    processing: 0,
    pending: 0,
  },
  startTime: null,
  endTime: null,
};

// Helper function to calculate stats
const calculateStats = (items: AssignmentItem[]): AssignmentStats => {
  const total = items.length;
  const successful = items.filter((item) => item.status === "success").length;
  const failed = items.filter((item) => item.status === "failed").length;
  const processing = items.filter(
    (item) => item.status === "processing"
  ).length;
  const pending = items.filter((item) => item.status === "pending").length;
  const completed = successful + failed;

  return {
    total,
    completed,
    successful,
    failed,
    processing,
    pending,
  };
};

// Create the slice
export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    // Start a new assignment process
    startAssignment: (
      state,
      action: PayloadAction<{
        filterId: string;
        filterName: string;
        items: AssignmentItem[];
      }>
    ) => {
      const { filterId, filterName, items } = action.payload;

      console.log("🚀 Redux: Assignment started with items:", items);

      state.filterId = filterId;
      state.filterName = filterName;
      state.assignmentItems = items.map((item) => ({
        ...item,
        status: "pending" as const,
        startTime: new Date().toISOString(),
      }));
      state.isProcessing = true;
      state.hasActiveAssignments = true;
      state.stats = calculateStats(state.assignmentItems);
      state.startTime = new Date().toISOString();
      state.endTime = null;

      // For demo purposes: Start automatic progression simulation
      // This simulates real assignment processing with realistic timing
      // Note: In a real app, this would be handled by API calls and websockets
      const mockProgressionTimer = setTimeout(() => {
        console.log("🎬 Starting mock assignment progression...");
        // The actual progression will be handled by a separate system
        // This is just to log that the simulation would start
      }, 500);

      // Store the timer ID for potential cleanup
      (state as any).mockTimerId = mockProgressionTimer;
    },

    // Update the status of a specific assignment item
    updateAssignmentItemStatus: (
      state,
      action: PayloadAction<{
        itemId: string;
        status: AssignmentItem["status"];
        error?: string;
      }>
    ) => {
      const { itemId, status, error } = action.payload;

      const item = state.assignmentItems.find((item) => item.id === itemId);
      if (item) {
        item.status = status;
        if (error) item.error = error;
        if (status === "success" || status === "failed") {
          item.endTime = new Date().toISOString();
        }

        // Recalculate stats
        state.stats = calculateStats(state.assignmentItems);

        // Check if all assignments are complete
        const allComplete = state.assignmentItems.every(
          (item) => item.status === "success" || item.status === "failed"
        );

        if (allComplete) {
          state.isProcessing = false;
          state.endTime = new Date().toISOString();
        }
      }
    },

    // Batch update multiple assignment statuses
    updateMultipleAssignmentStatuses: (
      state,
      action: PayloadAction<{
        updates: Array<{
          itemId: string;
          status: AssignmentItem["status"];
          error?: string;
        }>;
      }>
    ) => {
      const { updates } = action.payload;

      updates.forEach(({ itemId, status, error }) => {
        const item = state.assignmentItems.find((item) => item.id === itemId);
        if (item) {
          item.status = status;
          if (error) item.error = error;
          if (status === "success" || status === "failed") {
            item.endTime = new Date().toISOString();
          }
        }
      });

      // Recalculate stats
      state.stats = calculateStats(state.assignmentItems);

      // Check if all assignments are complete
      const allComplete = state.assignmentItems.every(
        (item) => item.status === "success" || item.status === "failed"
      );

      if (allComplete) {
        state.isProcessing = false;
        state.endTime = new Date().toISOString();
      }
    },

    // Retry failed assignments
    retryFailedAssignments: (state) => {
      const failedItems = state.assignmentItems.filter(
        (item) => item.status === "failed"
      );

      failedItems.forEach((item) => {
        item.status = "pending";
        item.error = undefined;
        item.endTime = undefined;
      });

      if (failedItems.length > 0) {
        state.isProcessing = true;
        state.stats = calculateStats(state.assignmentItems);
      }
    },

    // Clear all assignment data (reset)
    clearAssignment: (state) => {
      return initialState;
    },

    // Set processing state
    setAssignmentProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
  },
});

// Export actions
export const {
  startAssignment,
  updateAssignmentItemStatus,
  updateMultipleAssignmentStatuses,
  retryFailedAssignments,
  clearAssignment,
  setAssignmentProcessing,
} = assignmentSlice.actions;

// Export reducer
export default assignmentSlice.reducer;
