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
import { Client } from "langsmith";

// Initialize OpenAI client with error handling
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create service adapter
const serviceAdapter = new OpenAIAdapter({ openai });

// LangSmith configuration for observability
const langsmithConfig = {
  enabled: process.env.LANGSMITH_TRACING === "true",
  apiKey: process.env.LANGSMITH_API_KEY,
  projectName: process.env.LANGCHAIN_PROJECT || "kigo-pro-copilot",
};

// Initialize LangSmith client if tracing is enabled
let langsmithClient: Client | null = null;
if (langsmithConfig.enabled && langsmithConfig.apiKey) {
  langsmithClient = new Client({
    apiKey: langsmithConfig.apiKey,
  });
  console.log("[CopilotKit] LangSmith tracing: ENABLED");
} else {
  console.log("[CopilotKit] LangSmith tracing: DISABLED");
}

// Helper function to log action to LangSmith
const logActionToLangSmith = async (
  actionName: string,
  inputs: any,
  outputs: any,
  metadata?: Record<string, any>
) => {
  if (!langsmithClient) return;

  try {
    await langsmithClient.createRun({
      name: actionName,
      run_type: "chain",
      inputs,
      outputs: { result: outputs },
      project_name: langsmithConfig.projectName,
      extra: {
        ...metadata,
        feature: "copilot_chat",
        environment: process.env.NODE_ENV || "development",
      },
    });
  } catch (error) {
    console.warn(`[LangSmith] Failed to log action ${actionName}:`, error);
  }
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
        const inputs = { campaignName, budget, targetAudience };

        // TODO: Call internal API route /api/agents/campaign
        // For now, simple mock implementation
        console.log("[CopilotKit] Creating campaign:", inputs);

        const result = `✅ Campaign "${campaignName}" created with $${budget} budget${targetAudience ? ` targeting ${targetAudience}` : ""}`;

        // Log to LangSmith
        await logActionToLangSmith("createCampaign", inputs, result, {
          type: "campaign_action",
          campaign_name: campaignName,
          budget_amount: budget,
        });

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
        await logActionToLangSmith("getAnalytics", inputs, result, {
          type: "analytics_action",
          campaign_id: campaignId,
          date_range: period,
        });

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
        await logActionToLangSmith("manageFilters", inputs, result, {
          type: "filter_action",
          filter_action: action,
          filter_type: filterType,
        });

        return result;
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Processing request to /api/copilotkit");

  // Log request to LangSmith if enabled
  if (langsmithClient) {
    try {
      await langsmithClient.createRun({
        name: "copilotkit_request",
        run_type: "chain",
        inputs: { endpoint: "/api/copilotkit" },
        project_name: langsmithConfig.projectName,
        extra: {
          feature: "copilot_chat",
          environment: process.env.NODE_ENV || "development",
        },
      });
    } catch (error) {
      console.warn("[LangSmith] Failed to log request:", error);
    }
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
