import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Basic selectors
export const selectProgramSelectionState = (state: RootState) =>
  state.programSelection;

export const selectSelectedProgramIds = (state: RootState) =>
  state.programSelection.selectedProgramIds;

export const selectTotalSelectedCount = (state: RootState) =>
  state.programSelection.totalSelectedCount;

export const selectSelectionHistory = (state: RootState) =>
  state.programSelection.selectionHistory;

export const selectLastSelectionTime = (state: RootState) =>
  state.programSelection.lastSelectionTime;

export const selectIsSelectionModalOpen = (state: RootState) =>
  state.programSelection.isSelectionModalOpen;

export const selectCollapsedState = (state: RootState) =>
  state.programSelection.collapsedState;

// Computed selectors
export const selectHasSelectedPrograms = createSelector(
  [selectSelectedProgramIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectIsProgramSelected = createSelector(
  [
    selectSelectedProgramIds,
    (state: RootState, programId: string) => programId,
  ],
  (selectedIds, programId) => selectedIds.includes(programId)
);

// Get recent selection activity
export const selectRecentSelectionActivity = createSelector(
  [selectSelectionHistory],
  (history) => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    return history
      .filter((event) => new Date(event.timestamp) > fiveMinutesAgo)
      .slice(-10); // Last 10 events in the last 5 minutes
  }
);

// Get selection statistics
export const selectSelectionStats = createSelector(
  [selectSelectionHistory, selectTotalSelectedCount],
  (history, currentCount) => {
    const totalSelections = history
      .filter(
        (event) => event.action === "select" || event.action === "bulk_select"
      )
      .reduce((total, event) => total + event.programIds.length, 0);

    const totalDeselections = history
      .filter(
        (event) =>
          event.action === "deselect" || event.action === "bulk_deselect"
      )
      .reduce((total, event) => total + event.programIds.length, 0);

    const selectionSessions = history.filter(
      (event) => event.action === "bulk_select" && event.context === "modal"
    ).length;

    return {
      currentCount,
      totalSelections,
      totalDeselections,
      selectionSessions,
      netSelections: totalSelections - totalDeselections,
    };
  }
);

// Selection summary for UI display
export const selectSelectionSummary = createSelector(
  [
    selectSelectedProgramIds,
    selectTotalSelectedCount,
    selectLastSelectionTime,
    selectHasSelectedPrograms,
  ],
  (selectedIds, count, lastSelectionTime, hasSelections) => ({
    selectedIds,
    count,
    lastSelectionTime,
    hasSelections,
    isEmpty: count === 0,
  })
);

// Get programs that were selected in a specific context
export const selectProgramsSelectedInContext = createSelector(
  [selectSelectionHistory, (state: RootState, context: string) => context],
  (history, context) => {
    const contextEvents = history.filter((event) => event.context === context);
    const programIds = new Set<string>();

    contextEvents.forEach((event) => {
      event.programIds.forEach((id) => programIds.add(id));
    });

    return Array.from(programIds);
  }
);

// Check if selection is in progress (modal open)
export const selectSelectionInProgress = createSelector(
  [selectIsSelectionModalOpen],
  (isModalOpen) => isModalOpen
);
