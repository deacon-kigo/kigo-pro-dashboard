import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectCompleteFilterContext } from "./productFilterSelectors";
import {
  selectAssignmentSummary,
  selectAssignmentItems,
} from "./assignmentSelectors";
import {
  selectSelectionSummary,
  selectSelectedProgramIds,
} from "./programSelectionSelectors";

// Determine the current workflow stage
export const selectWorkflowStage = createSelector(
  [
    (state: RootState) => state.productFilter.filterName,
    (state: RootState) => state.productFilter.criteria,
    (state: RootState) => state.programSelection.selectedProgramIds,
    (state: RootState) => state.assignment.assignmentItems,
    (state: RootState) => state.assignment.isProcessing,
  ],
  (filterName, criteria, selectedPrograms, assignmentItems, isProcessing) => {
    // Filter creation stage
    if (!filterName || criteria.length === 0) {
      return "filter_creation";
    }

    // Program selection stage
    if (selectedPrograms.length === 0 && assignmentItems.length === 0) {
      return "program_selection";
    }

    // Assignment in progress
    if (
      isProcessing ||
      assignmentItems.some(
        (item) => item.status === "processing" || item.status === "pending"
      )
    ) {
      return "assignment_processing";
    }

    // Assignment complete
    if (assignmentItems.length > 0) {
      return "assignment_complete";
    }

    // Programs selected but not yet assigned
    if (selectedPrograms.length > 0) {
      return "ready_for_assignment";
    }

    return "filter_creation";
  }
);

// Complete workflow context for AI assistant
export const selectCompleteWorkflowContext = createSelector(
  [
    selectCompleteFilterContext,
    selectAssignmentSummary,
    selectSelectionSummary,
    selectWorkflowStage,
    (state: RootState) => state.aiAssistant.messages,
  ],
  (
    filterContext,
    assignmentSummary,
    selectionSummary,
    workflowStage,
    aiMessages
  ) => ({
    // Filter context
    filter: {
      name: filterContext.filterName,
      description: filterContext.description,
      criteria: filterContext.criteria,
      isValid: filterContext.filterName && filterContext.criteria.length > 0,
    },

    // Program selection context
    programSelection: {
      selectedCount: selectionSummary.count,
      selectedProgramIds: selectionSummary.selectedIds,
      hasSelections: selectionSummary.hasSelections,
      lastSelectionTime: selectionSummary.lastSelectionTime,
    },

    // Assignment context
    assignment: {
      isActive: assignmentSummary.stats.total > 0,
      isProcessing:
        !assignmentSummary.isComplete && assignmentSummary.stats.total > 0,
      isComplete: assignmentSummary.isComplete,
      stats: assignmentSummary.stats,
      progress: assignmentSummary.progress,
      duration: assignmentSummary.duration,
      filterName: assignmentSummary.filterName,
    },

    // Workflow state
    workflow: {
      stage: workflowStage,
      canProceedToSelection:
        filterContext.filterName && filterContext.criteria.length > 0,
      canStartAssignment: selectionSummary.hasSelections,
      isReadyForCompletion: assignmentSummary.isComplete,
    },

    // AI context
    ai: {
      conversationHistory: aiMessages,
      hasActiveConversation: aiMessages.length > 0,
    },

    // Metadata
    meta: {
      lastUpdated: new Date().toISOString(),
      contextVersion: "1.0",
    },
  })
);

// Check if the workflow is ready for AI assistance
export const selectIsReadyForAIAssistance = createSelector(
  [selectCompleteWorkflowContext],
  (context) => {
    // AI can help at any stage, but more context is better
    return {
      canHelp: true,
      contextLevel: (() => {
        if (context.assignment.isActive) return "full"; // Has filter + selection + assignment
        if (context.programSelection.hasSelections) return "medium"; // Has filter + selection
        if (context.filter.isValid) return "basic"; // Has filter only
        return "minimal"; // Just starting
      })(),
      suggestions: (() => {
        const suggestions: string[] = [];

        if (!context.filter.isValid) {
          suggestions.push("help_create_filter");
        }

        if (context.filter.isValid && !context.programSelection.hasSelections) {
          suggestions.push("suggest_programs");
        }

        if (
          context.programSelection.hasSelections &&
          !context.assignment.isActive
        ) {
          suggestions.push("help_start_assignment");
        }

        if (context.assignment.isProcessing) {
          suggestions.push("monitor_progress");
        }

        if (context.assignment.isComplete) {
          suggestions.push("review_results", "suggest_optimizations");
        }

        return suggestions;
      })(),
    };
  }
);

// Workflow progress summary
export const selectWorkflowProgress = createSelector(
  [selectCompleteWorkflowContext],
  (context) => {
    const steps = [
      {
        key: "filter_creation",
        name: "Create Filter",
        completed: context.filter.isValid,
        current: context.workflow.stage === "filter_creation",
      },
      {
        key: "program_selection",
        name: "Select Programs",
        completed: context.programSelection.hasSelections,
        current:
          context.workflow.stage === "program_selection" ||
          context.workflow.stage === "ready_for_assignment",
      },
      {
        key: "assignment",
        name: "Assign to Programs",
        completed: context.assignment.isComplete,
        current: context.workflow.stage === "assignment_processing",
      },
    ];

    const completedSteps = steps.filter((step) => step.completed).length;
    const totalSteps = steps.length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

    return {
      steps,
      completedSteps,
      totalSteps,
      progressPercentage,
      currentStep: steps.find((step) => step.current) || steps[0],
    };
  }
);

// Get actionable insights for the current workflow state
export const selectWorkflowInsights = createSelector(
  [selectCompleteWorkflowContext, selectWorkflowProgress],
  (context, progress) => {
    const insights: Array<{
      type: "info" | "warning" | "success" | "error";
      message: string;
      action?: string;
    }> = [];

    // Filter insights
    if (!context.filter.isValid) {
      insights.push({
        type: "info",
        message:
          "Start by creating a product filter with name, description, and criteria",
        action: "focus_filter_form",
      });
    }

    // Selection insights
    if (context.filter.isValid && !context.programSelection.hasSelections) {
      insights.push({
        type: "info",
        message: "Your filter is ready! Now select programs to assign it to",
        action: "open_program_selection",
      });
    }

    // Assignment insights
    if (
      context.programSelection.hasSelections &&
      !context.assignment.isActive
    ) {
      insights.push({
        type: "success",
        message: `${context.programSelection.selectedCount} programs selected. Ready to start assignment`,
        action: "start_assignment",
      });
    }

    if (context.assignment.isProcessing) {
      insights.push({
        type: "info",
        message: `Assignment in progress: ${context.assignment.progress}% complete (${context.assignment.stats.completed}/${context.assignment.stats.total})`,
      });
    }

    if (context.assignment.stats.failed > 0) {
      insights.push({
        type: "warning",
        message: `${context.assignment.stats.failed} assignments failed. Review and retry if needed`,
        action: "review_failures",
      });
    }

    if (
      context.assignment.isComplete &&
      context.assignment.stats.successful > 0
    ) {
      insights.push({
        type: "success",
        message: `Assignment complete! ${context.assignment.stats.successful} programs successfully assigned`,
      });
    }

    return insights;
  }
);
