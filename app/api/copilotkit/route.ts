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
// Function to call Python LangGraph backend
async function callPythonBackend(message: string, context: any) {
  try {
    const appContext = extractAppContext(context);

    console.log("[CopilotKit] 🐍 Calling Python LangGraph backend:", {
      message,
      contextKeys: Object.keys(appContext),
    });

    const response = await fetch("http://localhost:8000/api/copilotkit/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context: appContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const result = await response.json();
    console.log("[CopilotKit] ✅ Python backend response:", result);

    return result.message || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("[CopilotKit] ❌ Error calling Python backend:", error);
    return "I encountered an error processing your request. Please try again or contact support.";
  }
}

const runtime = new CopilotRuntime({
  actions: [
    {
      name: "handleUserMessage",
      description: "Process all user messages through Python LangGraph backend",
      parameters: [
        { name: "message", type: "string", required: true },
        { name: "context", type: "object", required: false },
      ],
      handler: async ({ message, context }) => {
        console.log(
          "[CopilotKit] 🎯 Routing message to Python backend:",
          message
        );
        return await callPythonBackend(message, context || {});
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
