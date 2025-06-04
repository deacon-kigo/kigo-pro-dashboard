import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Basic selectors
export const selectAssignmentState = (state: RootState) => state.assignment;

export const selectAssignmentItems = (state: RootState) =>
  state.assignment.assignmentItems;

export const selectIsAssignmentProcessing = (state: RootState) =>
  state.assignment.isProcessing;

export const selectHasActiveAssignments = (state: RootState) =>
  state.assignment.hasActiveAssignments;

export const selectAssignmentStats = (state: RootState) =>
  state.assignment.stats;

export const selectAssignmentFilterId = (state: RootState) =>
  state.assignment.filterId;

export const selectAssignmentFilterName = (state: RootState) =>
  state.assignment.filterName;

// Computed selectors
export const selectAssignmentProgress = createSelector(
  [selectAssignmentStats],
  (stats) => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }
);

export const selectFailedAssignmentItems = createSelector(
  [selectAssignmentItems],
  (items) => items.filter((item) => item.status === "failed")
);

export const selectSuccessfulAssignmentItems = createSelector(
  [selectAssignmentItems],
  (items) => items.filter((item) => item.status === "success")
);

export const selectProcessingAssignmentItems = createSelector(
  [selectAssignmentItems],
  (items) => items.filter((item) => item.status === "processing")
);

export const selectPendingAssignmentItems = createSelector(
  [selectAssignmentItems],
  (items) => items.filter((item) => item.status === "pending")
);

// Get assignment status for a specific item ID
export const selectAssignmentItemStatus = createSelector(
  [selectAssignmentItems, (state: RootState, itemId: string) => itemId],
  (items, itemId) => {
    const item = items.find((item) => item.id === itemId);
    return item?.status || null;
  }
);

// Check if all assignments are complete
export const selectAllAssignmentsComplete = createSelector(
  [selectAssignmentItems],
  (items) => {
    if (items.length === 0) return false;
    return items.every(
      (item) => item.status === "success" || item.status === "failed"
    );
  }
);

// Get assignment duration
export const selectAssignmentDuration = createSelector(
  [selectAssignmentState],
  (assignment) => {
    if (!assignment.startTime) return null;

    const endTime = assignment.endTime || new Date().toISOString();
    const startTime = assignment.startTime;

    const duration =
      new Date(endTime).getTime() - new Date(startTime).getTime();
    return Math.round(duration / 1000); // Duration in seconds
  }
);

// Assignment summary for display
export const selectAssignmentSummary = createSelector(
  [
    selectAssignmentStats,
    selectAssignmentProgress,
    selectAssignmentDuration,
    selectAllAssignmentsComplete,
    selectAssignmentFilterName,
  ],
  (stats, progress, duration, isComplete, filterName) => ({
    stats,
    progress,
    duration,
    isComplete,
    filterName,
    isEmpty: stats.total === 0,
  })
);
