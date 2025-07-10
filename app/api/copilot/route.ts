import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createSupervisorWorkflow } from "@/services/agents/supervisor";
import { adCreationAgent } from "@/services/agents/ad-creation";
import {
  langSmithConfig,
  logAgentInteraction,
} from "@/lib/copilot-kit/langsmith-config";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize LangGraph workflow
const supervisorWorkflow = createSupervisorWorkflow();

/**
 * CopilotKit API Route Handler
 *
 * This API route handles all CopilotKit requests and integrates with
 * our LangGraph multi-agent system for processing user interactions.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Extract message and context from CopilotKit request
    const { messages, context } = body;

    // Log the incoming request for observability
    if (langSmithConfig.enabled) {
      logAgentInteraction(
        "copilot_api",
        { messages, context },
        { status: "processing" },
        { endpoint: "/api/copilot" }
      );
    }

    // Process the request through LangGraph if messages exist
    if (messages && messages.length > 0) {
      const agentState = {
        messages,
        userIntent: "",
        context: {
          currentPage: context?.currentPage || "/",
          userRole: context?.userRole || "user",
          campaignData: context?.campaignData,
          sessionId: context?.sessionId || `session-${Date.now()}`,
        },
        agentDecision: "",
        workflowData: {},
      };

      try {
        // Run the LangGraph workflow
        const result = await supervisorWorkflow.invoke(agentState);

        // Extract the AI response from the workflow result
        const aiResponse = result.messages[result.messages.length - 1];

        // Log the successful response
        if (langSmithConfig.enabled) {
          logAgentInteraction(
            "copilot_api",
            { messages, context },
            { response: aiResponse, agentDecision: result.agentDecision },
            { endpoint: "/api/copilot", status: "success" }
          );
        }

        // Return the response in CopilotKit format
        return NextResponse.json({
          message: aiResponse.content,
          role: "assistant",
          metadata: {
            agentDecision: result.agentDecision,
            userIntent: result.userIntent,
            workflowData: result.workflowData,
          },
        });
      } catch (workflowError) {
        console.error("LangGraph workflow error:", workflowError);

        // Log the error
        if (langSmithConfig.enabled) {
          logAgentInteraction(
            "copilot_api",
            { messages, context },
            {
              error:
                workflowError instanceof Error
                  ? workflowError.message
                  : "Unknown error",
            },
            { endpoint: "/api/copilot", status: "error" }
          );
        }

        // Fallback response for workflow errors
        return NextResponse.json({
          message:
            "I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.",
          role: "assistant",
          error: "workflow_error",
        });
      }
    }

    // If no messages, return a default response
    return NextResponse.json({
      message:
        "Hello! I'm your Kigo Pro AI assistant. How can I help you create or optimize your campaigns today?",
      role: "assistant",
    });
  } catch (error) {
    console.error("CopilotKit API error:", error);

    // Return error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process request",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health check
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "CopilotKit API",
    features: {
      langGraph: true,
      langSmith: langSmithConfig.enabled,
      openAI: !!process.env.OPENAI_API_KEY,
    },
  });
}
