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
import { createSupervisorWorkflow } from "@/services/agents/supervisor";
import { HumanMessage } from "@langchain/core/messages";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create workflow instance
const supervisorWorkflow = createSupervisorWorkflow();

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

// Configure runtime with enhanced actions
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description:
        "Process user messages through the Kigo Pro AI assistant system and determine the appropriate response and actions.",
      parameters: [
        {
          name: "message",
          type: "string",
          description: "The exact user message to process",
          required: true,
        },
      ],
      handler: async ({ message }) => {
        console.log("[CopilotKit] 🚀 PROCESSING MESSAGE:", message);

        try {
          const uiContext = getUIContext();
          console.log("[CopilotKit] Server Redux state:", {
            currentPage: uiContext.currentPage,
            hasOtherData: !!uiContext.campaignForm,
          });

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

          console.log(
            "[CopilotKit] Using currentPage:",
            agentInput.context.currentPage
          );
          const result = await supervisorWorkflow.invoke(agentInput);
          console.log("[CopilotKit] Agent result:", {
            userIntent: result.userIntent,
            agentDecision: result.agentDecision,
          });

          // Just return the agent response - let CopilotKit handle action calling
          const lastAgentMessage = result.messages[result.messages.length - 1];
          const response =
            lastAgentMessage?.content ||
            "I'm here to help with your campaigns!";

          console.log("[CopilotKit] ✅ Returning agent response:", response);
          return response;
        } catch (error) {
          console.error("[CopilotKit] Error:", error);
          return "I apologize, but I encountered an error. Please try again or let me know how I can help with your campaigns.";
        }
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log(
    "[CopilotKit] Enhanced Kigo agent with CopilotKit SDK actions available"
  );

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
