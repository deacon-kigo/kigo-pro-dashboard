/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route provides a clean interface between CopilotKit and our agent workflows.
 * Business logic is handled by LangGraph agents that dispatch Redux actions directly.
 *
 * Architecture:
 * - CopilotKit handles UI interaction and streaming
 * - Agent workflows handle business logic and state updates
 * - Redux serves as the single source of truth
 * - Agents can manipulate UI through Redux actions
 */
import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { store } from "@/lib/redux/store";
import { agentActions } from "@/lib/redux/actions/agent-actions";

// Initialize OpenAI client with error handling
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const serviceAdapter = new OpenAIAdapter({ openai });

console.log("[CopilotKit] Configuration:", {
  langsmithTracing: process.env.LANGCHAIN_TRACING_V2 === "true",
  project: process.env.LANGCHAIN_PROJECT,
  hasApiKey: !!process.env.LANGSMITH_API_KEY,
  agentWorkflowEnabled: true,
});

// Helper function to get current UI context for agents
const getUIContext = () => {
  const state = store.getState();
  return {
    currentPage: state.ui?.currentPage || "unknown",
    activeFilters: state.productFilter || {},
    campaignForm: state.campaign?.formData || {},
    visibleComponents: state.ui?.visibleComponents || [],
    userContext: state.user || {},
  };
};

// Configure runtime with clean agent-triggering actions
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "createCampaign",
      description:
        "Create a new advertising campaign with intelligent form filling and navigation",
      parameters: [
        {
          name: "campaignName",
          type: "string",
          description: "Name of the campaign",
          required: true,
        },
        {
          name: "budget",
          type: "number",
          description: "Budget for the campaign in dollars",
          required: true,
        },
        {
          name: "targetAudience",
          type: "string",
          description: "Target audience description",
          required: false,
        },
      ],
      handler: async ({ campaignName, budget, targetAudience }) => {
        console.log("[CopilotKit] Triggering campaign agent workflow");

        // Dispatch to agent workflow - no business logic here!
        store.dispatch(
          agentActions.triggerWorkflow({
            agentType: "campaign",
            action: "createCampaign",
            userInput: { campaignName, budget, targetAudience },
            uiContext: getUIContext(),
          })
        );

        // Agent will handle the actual logic and UI updates
        return `🤖 Campaign agent is processing your request for "${campaignName}"...`;
      },
    },
    {
      name: "getAnalytics",
      description:
        "Get analytics and performance data with smart visualization and navigation",
      parameters: [
        {
          name: "campaignId",
          type: "string",
          description: "ID of the campaign to get analytics for",
          required: false,
        },
        {
          name: "dateRange",
          type: "string",
          description:
            "Date range for analytics (e.g., 'last 7 days', 'this month')",
          required: false,
        },
        {
          name: "visualizationType",
          type: "string",
          description: "How to display the data: 'chart', 'table', 'dashboard'",
          required: false,
        },
      ],
      handler: async ({ campaignId, dateRange, visualizationType }) => {
        console.log("[CopilotKit] Triggering analytics agent workflow");

        store.dispatch(
          agentActions.triggerWorkflow({
            agentType: "analytics",
            action: "getAnalytics",
            userInput: { campaignId, dateRange, visualizationType },
            uiContext: getUIContext(),
          })
        );

        return `📊 Analytics agent is gathering data and preparing visualizations...`;
      },
    },
    {
      name: "manageFilters",
      description:
        "Intelligently manage product filters with UI updates and smart suggestions",
      parameters: [
        {
          name: "action",
          type: "string",
          description:
            "Action to perform: 'list', 'add', 'remove', 'update', 'optimize'",
          required: true,
        },
        {
          name: "filterType",
          type: "string",
          description:
            "Type of filter: 'category', 'price', 'brand', 'location'",
          required: false,
        },
        {
          name: "filterValue",
          type: "string",
          description: "Value for the filter",
          required: false,
        },
      ],
      handler: async ({ action, filterType, filterValue }) => {
        console.log("[CopilotKit] Triggering filter agent workflow");

        store.dispatch(
          agentActions.triggerWorkflow({
            agentType: "filter",
            action: "manageFilters",
            userInput: { action, filterType, filterValue },
            uiContext: getUIContext(),
          })
        );

        return `🎯 Filter agent is optimizing your targeting options...`;
      },
    },
    {
      name: "navigateAndAssist",
      description:
        "Navigate the user to different pages and provide contextual assistance",
      parameters: [
        {
          name: "destination",
          type: "string",
          description:
            "Where to navigate: 'campaigns', 'analytics', 'filters', 'dashboard'",
          required: true,
        },
        {
          name: "assistanceType",
          type: "string",
          description:
            "Type of help needed: 'setup', 'optimization', 'analysis', 'troubleshooting'",
          required: false,
        },
      ],
      handler: async ({ destination, assistanceType }) => {
        console.log(
          "[CopilotKit] Triggering navigation and assistance workflow"
        );

        store.dispatch(
          agentActions.triggerWorkflow({
            agentType: "supervisor",
            action: "navigateAndAssist",
            userInput: { destination, assistanceType },
            uiContext: getUIContext(),
          })
        );

        return `🧭 Taking you to ${destination} and setting up assistance...`;
      },
    },
  ],
});

// Export POST handler - clean and simple
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Processing request to /api/copilotkit");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
