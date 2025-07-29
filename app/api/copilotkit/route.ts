/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route integrates our LangGraph multi-agent system with CopilotKit.
 * Routes ALL user messages through LangGraph supervisor for proper orchestration.
 */
import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { HumanMessage } from "@langchain/core/messages";
import { createSupervisorWorkflow } from "../../../services/agents/supervisor";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract app context from request
function extractAppContext(context: any = {}) {
  return {
    // UI Context
    currentPage: context?.currentPage || "/",
    activeModal: context?.activeModal || null,
    isLoading: context?.isLoading || false,

    // Campaign Context
    campaignData: context?.campaignData || {},
    currentStep: context?.currentStep || 0,
    ads: context?.ads || [],

    // User Context
    userRole: context?.userRole || "user",
    permissions: context?.permissions || [],

    // Session Context
    sessionId: context?.sessionId || `session_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}

// Placeholder for action execution (Phase 2)
async function executeQueuedActions(actions: any[]) {
  console.log("[ActionExecutor] Actions to execute:", actions);
  // TODO: Implement in Phase 2
  return [];
}

// Configure runtime to route all messages through LangGraph
const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description: "Process all user messages through LangGraph system",
      parameters: [
        { name: "message", type: "string", required: true },
        { name: "context", type: "object", required: false },
      ],
      handler: async ({ message, context }) => {
        console.log("[CopilotKit] 🎯 Routing message to LangGraph:", message);

        try {
          // 1. Extract app context from request
          const appContext = extractAppContext(context);
          console.log("[CopilotKit] 📊 App context:", appContext);

          // 2. Initialize LangGraph workflow
          const workflow = createSupervisorWorkflow();

          // 3. Invoke with complete context
          const result = await workflow.invoke({
            messages: [new HumanMessage(message)],
            context: appContext,
          });

          console.log("[CopilotKit] 🤖 LangGraph result:", {
            agentDecision: result.agentDecision,
            userIntent: result.userIntent,
            hasPendingActions: !!result.workflowData?.pendingActions,
          });

          // 4. Execute any requested actions (Phase 2)
          if (result.workflowData?.pendingActions) {
            console.log(
              "[CopilotKit] 🔧 Executing actions:",
              result.workflowData.pendingActions
            );
            await executeQueuedActions(result.workflowData.pendingActions);
          }

          // 5. Return the agent's response
          const response = result.messages[result.messages.length - 1].content;
          console.log("[CopilotKit] 💬 Returning response:", response);

          return response;
        } catch (error) {
          console.error("[CopilotKit] ❌ Error in LangGraph workflow:", error);
          return "I encountered an error processing your request. Please try again or contact support.";
        }
      },
    },
  ],
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log("[CopilotKit] 🚀 LangGraph-integrated Kigo agent starting");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
