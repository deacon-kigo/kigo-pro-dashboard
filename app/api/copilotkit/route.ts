/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route provides AI assistant functionality with local actions.
 * Inspired by CopilotKit examples with improvements for:
 * - Better error handling
 * - Environment validation
 * - LangSmith observability integration
 * - Structured logging
 *
 * Future considerations:
 * - Migrate to langGraphPlatformEndpoint for complex agent workflows
 * - Implement remote agent endpoints
 */
import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

// Initialize OpenAI client with error handling
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create service adapter
const serviceAdapter = new OpenAIAdapter({ openai });

console.log("[CopilotKit] Configuration:", {
  langsmithTracing: process.env.LANGCHAIN_TRACING_V2 === "true",
  project: process.env.LANGCHAIN_PROJECT,
  hasApiKey: !!process.env.LANGSMITH_API_KEY,
  manualTracingDisabled: true,
});

// Configure runtime with actions
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "createCampaign",
      description: "Create a new advertising campaign",
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
        const inputs = { campaignName, budget, targetAudience };

        // TODO: Call internal API route /api/agents/campaign
        // For now, simple mock implementation
        console.log("[CopilotKit] Creating campaign:", inputs);

        const result = `✅ Campaign "${campaignName}" created with $${budget} budget${targetAudience ? ` targeting ${targetAudience}` : ""}`;

        // Log to LangSmith
        // CopilotKit will automatically log this action

        return result;
      },
    },
    {
      name: "getAnalytics",
      description: "Get analytics and performance data for campaigns",
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
      ],
      handler: async ({ campaignId, dateRange }) => {
        const inputs = { campaignId, dateRange };

        // TODO: Call internal API route /api/agents/analytics
        console.log("[CopilotKit] Getting analytics:", inputs);

        const period = dateRange || "last 7 days";
        const campaign = campaignId || "all campaigns";
        const result = `📊 Analytics for ${campaign} (${period}): 15K impressions, 750 clicks, 3.2% CTR, $0.85 CPC`;

        // Log to LangSmith
        // CopilotKit will automatically log this action

        return result;
      },
    },
    {
      name: "manageFilters",
      description: "Manage product filters and targeting options",
      parameters: [
        {
          name: "action",
          type: "string",
          description: "Action to perform: 'list', 'add', 'remove', 'update'",
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
        const inputs = { action, filterType, filterValue };

        // TODO: Call internal API route /api/agents/filters
        console.log("[CopilotKit] Managing filters:", inputs);

        let result: string;
        if (action === "list") {
          result = `🎯 Current filters: Electronics (category), $50-500 (price), Samsung, Apple (brands)`;
        } else {
          result = `✅ Filter ${action} completed: ${filterType} = ${filterValue}`;
        }

        // Log to LangSmith
        // CopilotKit will automatically log this action

        return result;
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Processing request to /api/copilotkit");

  // Log request to LangSmith if enabled
  // CopilotKit will automatically log this request

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
