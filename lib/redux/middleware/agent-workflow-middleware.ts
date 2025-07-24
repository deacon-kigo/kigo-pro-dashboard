/**
 * Agent Workflow Middleware for Redux Integration
 *
 * This middleware intercepts agent actions and triggers appropriate LangGraph workflows.
 * It enables bi-directional communication between agents and the UI through Redux.
 */
import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  setCurrentPage,
  addNotification,
  highlightComponent,
  setLoading,
  addVisibleComponent,
  setActiveModal,
} from "../slices/uiSlice";
import { agentActions } from "../actions/agent-actions";

// Agent workflow functions (will be implemented)
interface AgentWorkflowInput {
  userInput: any;
  uiContext: any;
  dispatch: any;
  getState: () => RootState;
}

// Placeholder for actual LangGraph agent implementations
const agentWorkflows = {
  campaign: async (input: AgentWorkflowInput) => {
    const { userInput, dispatch } = input;

    // Show loading state
    dispatch(
      setLoading({ isLoading: true, message: "Campaign agent is working..." })
    );

    // Simulate agent processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Agent logic: navigate to campaign form and pre-fill data
    if (userInput.action === "createCampaign") {
      // Navigate to campaign creation page
      dispatch(setCurrentPage("/campaigns/create"));

      // Pre-fill the campaign form (this would be handled by campaign slice)
      // dispatch(updateCampaignForm(userInput));

      // Show notification
      dispatch(
        addNotification({
          message: `Campaign "${userInput.campaignName}" setup started with $${userInput.budget} budget`,
          type: "success",
        })
      );

      // Highlight the form for user attention
      dispatch(highlightComponent("campaign-form"));
    }

    dispatch(setLoading({ isLoading: false }));
  },

  analytics: async (input: AgentWorkflowInput) => {
    const { userInput, dispatch } = input;

    dispatch(setLoading({ isLoading: true, message: "Analyzing data..." }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (userInput.action === "getAnalytics") {
      // Navigate to analytics page
      dispatch(setCurrentPage("/analytics"));

      // Show specific visualization
      if (userInput.visualizationType === "chart") {
        dispatch(addVisibleComponent("revenue-chart"));
        dispatch(highlightComponent("revenue-chart"));
      }

      dispatch(
        addNotification({
          message: `Analytics loaded for ${userInput.dateRange || "last 7 days"}`,
          type: "info",
        })
      );
    }

    dispatch(setLoading({ isLoading: false }));
  },

  filter: async (input: AgentWorkflowInput) => {
    const { userInput, dispatch } = input;

    dispatch(setLoading({ isLoading: true, message: "Optimizing filters..." }));

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (userInput.action === "manageFilters") {
      // Update filter state (would be handled by filter slice)
      dispatch(
        addNotification({
          message: `Filter ${userInput.action} completed: ${userInput.filterType} = ${userInput.filterValue}`,
          type: "success",
        })
      );

      // Show filter panel if not visible
      dispatch(addVisibleComponent("filter-panel"));
    }

    dispatch(setLoading({ isLoading: false }));
  },

  supervisor: async (input: AgentWorkflowInput) => {
    const { userInput, dispatch } = input;

    dispatch(
      setLoading({ isLoading: true, message: "Preparing assistance..." })
    );

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (userInput.action === "navigateAndAssist") {
      const { destination, assistanceType } = userInput;

      // Navigate to destination
      const routeMap: Record<string, string> = {
        campaigns: "/campaigns",
        analytics: "/analytics",
        filters: "/filters",
        dashboard: "/",
      };

      dispatch(setCurrentPage(routeMap[destination] || "/"));

      // Show contextual assistance
      if (assistanceType) {
        dispatch(
          setActiveModal({
            type: "assistance-guide",
            data: { destination, assistanceType },
          })
        );
      }

      dispatch(
        addNotification({
          message: `Welcome to ${destination}! ${assistanceType ? `I'm here to help with ${assistanceType}.` : ""}`,
          type: "info",
        })
      );
    }

    dispatch(setLoading({ isLoading: false }));
  },
};

export const agentWorkflowMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    // Let Redux handle the action first
    const result = next(action);

    // Check if this is an agent workflow trigger
    if (action.type === "agent/triggerWorkflow") {
      const { agentType, userInput, uiContext } = action.payload;

      console.log(
        `[Agent Middleware] Triggering ${agentType} agent workflow:`,
        {
          action: userInput.action,
          uiContext: uiContext.currentPage,
        }
      );

      try {
        // Get the appropriate agent workflow
        const workflow = agentWorkflows[agentType];

        if (workflow) {
          // Execute the agent workflow with Redux integration
          await workflow({
            userInput,
            uiContext,
            dispatch: store.dispatch,
            getState: store.getState as () => RootState,
          });

          // Log successful agent interaction
          store.dispatch(
            agentActions.logAgentInteraction(
              agentType,
              userInput.action,
              "completed"
            )
          );
        } else {
          console.warn(
            `[Agent Middleware] No workflow found for agent: ${agentType}`
          );

          // Show error notification
          store.dispatch(
            addNotification({
              message: `Agent ${agentType} is not available`,
              type: "error",
            })
          );
        }
      } catch (error) {
        console.error(
          `[Agent Middleware] Error in ${agentType} workflow:`,
          error
        );

        store.dispatch(
          addNotification({
            message: `Error processing request with ${agentType} agent`,
            type: "error",
          })
        );

        store.dispatch(setLoading({ isLoading: false }));
      }
    }

    return result;
  };
