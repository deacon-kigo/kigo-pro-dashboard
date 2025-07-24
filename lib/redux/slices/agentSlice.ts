/**
 * Agent Slice for tracking agent state and interactions
 *
 * This slice manages the state of all agents and their interactions,
 * providing observability into agent workflows and decisions.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AgentInteraction {
  id: string;
  agentType: "campaign" | "analytics" | "filter" | "supervisor";
  action: string;
  userInput: any;
  result: any;
  timestamp: number;
  duration?: number;
  status: "pending" | "completed" | "error";
}

export interface AgentState {
  // Active agent workflows
  activeWorkflows: Record<
    string,
    {
      agentType: string;
      action: string;
      startTime: number;
      status: "running" | "completed" | "error";
    }
  >;

  // Agent interaction history
  interactions: AgentInteraction[];

  // Agent capabilities and status
  agentStatus: Record<
    string,
    {
      isActive: boolean;
      lastInteraction: number;
      totalInteractions: number;
    }
  >;

  // Current context shared across agents
  sharedContext: {
    userPreferences: any;
    activeFilters: any;
    currentCampaign: any;
    sessionData: any;
  };

  // Agent performance metrics
  metrics: {
    totalInteractions: number;
    averageResponseTime: number;
    successRate: number;
    errorCount: number;
  };
}

const initialState: AgentState = {
  activeWorkflows: {},
  interactions: [],
  agentStatus: {
    campaign: { isActive: true, lastInteraction: 0, totalInteractions: 0 },
    analytics: { isActive: true, lastInteraction: 0, totalInteractions: 0 },
    filter: { isActive: true, lastInteraction: 0, totalInteractions: 0 },
    supervisor: { isActive: true, lastInteraction: 0, totalInteractions: 0 },
  },
  sharedContext: {
    userPreferences: {},
    activeFilters: {},
    currentCampaign: null,
    sessionData: {},
  },
  metrics: {
    totalInteractions: 0,
    averageResponseTime: 0,
    successRate: 0,
    errorCount: 0,
  },
};

export const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    // Start a new agent workflow
    startWorkflow: (
      state,
      action: PayloadAction<{
        workflowId: string;
        agentType: string;
        action: string;
      }>
    ) => {
      const { workflowId, agentType, action: workflowAction } = action.payload;

      state.activeWorkflows[workflowId] = {
        agentType,
        action: workflowAction,
        startTime: Date.now(),
        status: "running",
      };
    },

    // Complete a workflow
    completeWorkflow: (
      state,
      action: PayloadAction<{
        workflowId: string;
        status: "completed" | "error";
      }>
    ) => {
      const { workflowId, status } = action.payload;

      if (state.activeWorkflows[workflowId]) {
        state.activeWorkflows[workflowId].status = status;

        // Clean up completed workflows after a delay
        setTimeout(() => {
          delete state.activeWorkflows[workflowId];
        }, 5000);
      }
    },

    // Log agent interaction
    logInteraction: (
      state,
      action: PayloadAction<{
        agentType: string;
        action: string;
        result: any;
        timestamp?: number;
      }>
    ) => {
      const {
        agentType,
        action: agentAction,
        result,
        timestamp,
      } = action.payload;

      const interaction: AgentInteraction = {
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentType: agentType as any,
        action: agentAction,
        userInput: {},
        result,
        timestamp: timestamp || Date.now(),
        status: "completed",
      };

      // Add to interactions history (keep last 50)
      state.interactions.unshift(interaction);
      if (state.interactions.length > 50) {
        state.interactions = state.interactions.slice(0, 50);
      }

      // Update agent status
      if (state.agentStatus[agentType]) {
        state.agentStatus[agentType].lastInteraction = interaction.timestamp;
        state.agentStatus[agentType].totalInteractions += 1;
      }

      // Update metrics
      state.metrics.totalInteractions += 1;
    },

    // Update shared context
    updateSharedContext: (
      state,
      action: PayloadAction<{
        key: string;
        data: any;
      }>
    ) => {
      const { key, data } = action.payload;
      (state.sharedContext as any)[key] = data;
    },

    // Set agent status
    setAgentStatus: (
      state,
      action: PayloadAction<{
        agentType: string;
        isActive: boolean;
      }>
    ) => {
      const { agentType, isActive } = action.payload;

      if (state.agentStatus[agentType]) {
        state.agentStatus[agentType].isActive = isActive;
      }
    },

    // Clear interaction history
    clearInteractions: (state) => {
      state.interactions = [];
    },

    // Update metrics
    updateMetrics: (
      state,
      action: PayloadAction<{
        successRate?: number;
        averageResponseTime?: number;
        errorCount?: number;
      }>
    ) => {
      const { successRate, averageResponseTime, errorCount } = action.payload;

      if (successRate !== undefined) state.metrics.successRate = successRate;
      if (averageResponseTime !== undefined)
        state.metrics.averageResponseTime = averageResponseTime;
      if (errorCount !== undefined) state.metrics.errorCount = errorCount;
    },
  },
});

export const {
  startWorkflow,
  completeWorkflow,
  logInteraction,
  updateSharedContext,
  setAgentStatus,
  clearInteractions,
  updateMetrics,
} = agentSlice.actions;

export default agentSlice.reducer;
