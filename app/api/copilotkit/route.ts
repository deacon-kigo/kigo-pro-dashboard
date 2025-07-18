/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route provides AI assistant functionality with local actions.
 * Inspired by CopilotKit examples with improvements for:
 * - Better error handling
 * - Environment validation
 * - LangSmith observability preparation
 * - Structured logging
 *
 * Future considerations:
 * - Migrate to langGraphPlatformEndpoint for complex agent workflows
 * - Add proper LangSmith tracing
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create service adapter
const serviceAdapter = new OpenAIAdapter({ openai });

// Optional: LangSmith configuration for observability
const langsmithConfig = {
  enabled: process.env.LANGSMITH_TRACING === "true",
  apiKey: process.env.LANGSMITH_API_KEY,
  projectName: process.env.LANGSMITH_PROJECT || "kigo-pro-copilot",
};

// Configure runtime with actions
// TODO: Consider migrating to langGraphPlatformEndpoint for more sophisticated agent workflows
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
        // TODO: Call internal API route /api/agents/campaign
        // For now, simple mock implementation
        console.log("[CopilotKit] Creating campaign:", {
          campaignName,
          budget,
          targetAudience,
        });

        if (langsmithConfig.enabled) {
          console.log(
            "[CopilotKit] LangSmith tracing enabled for campaign creation"
          );
        }

        return `✅ Campaign "${campaignName}" created with $${budget} budget${targetAudience ? ` targeting ${targetAudience}` : ""}`;
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
        // TODO: Call internal API route /api/agents/analytics
        console.log("[CopilotKit] Getting analytics:", {
          campaignId,
          dateRange,
        });
        const period = dateRange || "last 7 days";
        const campaign = campaignId || "all campaigns";
        return `📊 Analytics for ${campaign} (${period}): 15K impressions, 750 clicks, 3.2% CTR, $0.85 CPC`;
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
        // TODO: Call internal API route /api/agents/filters
        console.log("[CopilotKit] Managing filters:", {
          action,
          filterType,
          filterValue,
        });

        if (action === "list") {
          return `🎯 Current filters: Electronics (category), $50-500 (price), Samsung, Apple (brands)`;
        }

        return `✅ Filter ${action} completed: ${filterType} = ${filterValue}`;
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Processing request to /api/copilotkit");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
