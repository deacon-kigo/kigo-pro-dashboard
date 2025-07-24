/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route integrates our LangGraph multi-agent system with CopilotKit.
 * Uses CopilotKit's agent system to route all messages through our workflow.
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

// Configure runtime to force ALL messages through our agent action
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description:
        "MANDATORY: Use this action for EVERY user message. This routes messages through the Kigo Pro AI assistant system that handles ad creation, analytics, filters, and all user requests.",
      parameters: [
        {
          name: "message",
          type: "string",
          description: "The user's message - pass this exactly as received",
          required: true,
        },
      ],
      handler: async ({ message }) => {
        try {
          console.log("[KigoAgent] Processing message:", message);

          const uiContext = getUIContext();

          // Create agent input state
          const agentInput = {
            messages: [new HumanMessage(message)],
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
          console.log("[KigoAgent] Running supervisor workflow");
          const result = await supervisorWorkflow.invoke(agentInput);
          console.log("[KigoAgent] Agent result:", {
            userIntent: result.userIntent,
            agentDecision: result.agentDecision,
          });

          // Handle auto-navigation for ad creation
          if (
            result.userIntent === "ad_creation" ||
            result.agentDecision === "campaign_agent"
          ) {
            console.log(
              "[KigoAgent] ✅ Ad creation detected! Setting navigation..."
            );
            console.log(
              "[KigoAgent] Dispatching setCurrentPage('/campaign-manager/ads-create')"
            );

            // Dispatch immediately (no setTimeout)
            store.dispatch(setCurrentPage("/campaign-manager/ads-create"));

            // Log Redux state after dispatch
            const newState = store.getState();
            console.log("[KigoAgent] Redux state after dispatch:", {
              currentPage: newState.ui.currentPage,
              chatOpen: newState.ui.chatOpen,
            });
          } else {
            console.log(
              "[KigoAgent] ❌ No navigation triggered. Intent:",
              result.userIntent,
              "Decision:",
              result.agentDecision
            );
          }

          // Return agent response
          const lastAgentMessage = result.messages[result.messages.length - 1];
          return (
            lastAgentMessage?.content || "I'm here to help with your campaigns!"
          );
        } catch (error) {
          console.error("[KigoAgent] Error:", error);
          return "I apologize for the error. How can I help you with your campaigns?";
        }
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] Kigo agent action available");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
