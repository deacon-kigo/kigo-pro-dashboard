/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route integrates our LangGraph multi-agent system with CopilotKit.
 * The supervisor agent handles intent detection and routing automatically.
 */
import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { store } from "@/lib/redux/store";
import supervisorWorkflow from "@/services/agents/supervisor";
import { setCurrentPage } from "@/lib/redux/slices/uiSlice";
import { HumanMessage } from "@langchain/core/messages";

// Initialize OpenAI client with error handling
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// The workflow is already compiled and ready to use
// const supervisorWorkflow = already imported above

// Configure runtime with our agent integration
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "processWithAgent",
      description: "Process user request through our intelligent agent system",
      parameters: [
        {
          name: "userMessage",
          type: "string",
          description: "The user's message or request",
          required: true,
        },
      ],
      handler: async ({ userMessage }) => {
        try {
          console.log(
            "[CopilotKit] Processing with agent system:",
            userMessage
          );

          const uiContext = getUIContext();

          // Create agent input state
          const agentInput = {
            messages: [new HumanMessage(userMessage)],
            userIntent: "",
            context: {
              currentPage: uiContext.currentPage,
              userRole: "admin",
              sessionId: `copilot_${Date.now()}`,
              campaignData: uiContext.campaignForm,
            },
            agentDecision: "",
            workflowData: {},
          };

          // Run through our agent workflow
          const result = await supervisorWorkflow.invoke(agentInput);

          // Handle auto-navigation for ad creation
          if (
            result.userIntent === "ad_creation" ||
            result.agentDecision === "campaign_agent"
          ) {
            console.log(
              "[CopilotKit] Ad creation intent detected, navigating to create ad page"
            );
            setTimeout(() => {
              store.dispatch(setCurrentPage("/campaign-manager/ads-create"));
            }, 500);
          }

          // Return the agent's response
          const lastMessage = result.messages[result.messages.length - 1];
          return (
            lastMessage?.content || "I'm here to help with your campaigns!"
          );
        } catch (error) {
          console.error("[CopilotKit] Agent processing error:", error);
          return "I apologize, but I encountered an error. Please try again or let me know how I can help with your campaigns.";
        }
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Processing request to /api/copilotkit");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
