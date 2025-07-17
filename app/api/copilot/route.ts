import { NextRequest } from "next/server";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  createSupervisorWorkflow,
  KigoProAgentState,
} from "@/services/agents/supervisor";
import {
  langSmithConfig,
  logAgentInteraction,
} from "@/lib/copilot-kit/langsmith-config";

// Initialize the supervisor workflow
const supervisorWorkflow = createSupervisorWorkflow();

/**
 * Convert CopilotKit messages to LangChain BaseMessage format
 */
const convertToBaseMessages = (messages: any[]): BaseMessage[] => {
  return messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else if (msg.role === "assistant") {
      return new AIMessage(msg.content);
    } else {
      return new HumanMessage(msg.content);
    }
  });
};

/**
 * Custom LangGraph integration for CopilotKit
 */
async function handleLangGraphRequest(messages: any[], context: any) {
  try {
    // Convert messages to LangChain format
    const baseMessages = convertToBaseMessages(messages);

    // Create agent state
    const agentState: KigoProAgentState = {
      messages: baseMessages,
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

    // Log the request
    if (langSmithConfig.enabled) {
      logAgentInteraction(
        "copilot_api",
        { messages, context },
        { status: "processing" },
        { endpoint: "/api/copilot" }
      );
    }

    // Run the LangGraph workflow
    const result = await supervisorWorkflow.invoke(agentState);

    // Extract the AI response
    const aiResponse = result.messages[result.messages.length - 1];

    // Log the response
    if (langSmithConfig.enabled) {
      logAgentInteraction(
        "copilot_api",
        { messages, context },
        { response: aiResponse, agentDecision: result.agentDecision },
        { endpoint: "/api/copilot", status: "success" }
      );
    }

    // Ensure traces are flushed in serverless environment
    if (process.env.LANGCHAIN_TRACING_V2 === "true") {
      try {
        // Force flush any pending traces
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.warn("Failed to flush traces:", error);
      }
    }

    return {
      content: aiResponse.content,
      role: "assistant",
      metadata: {
        agentDecision: result.agentDecision,
        userIntent: result.userIntent,
        workflowData: result.workflowData,
      },
    };
  } catch (error) {
    console.error("LangGraph workflow error:", error);

    // Log the error
    if (langSmithConfig.enabled) {
      logAgentInteraction(
        "copilot_api",
        { messages, context },
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { endpoint: "/api/copilot", status: "error" }
      );
    }

    return {
      content:
        "I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.",
      role: "assistant",
      metadata: {
        error: "workflow_error",
      },
    };
  }
}

// Main handler function
export async function POST(request: NextRequest) {
  try {
    // Handle the request through our custom LangGraph integration
    const body = await request.json();
    const { messages, context } = body;

    if (messages && messages.length > 0) {
      const response = await handleLangGraphRequest(messages, context);

      // Return in a format compatible with CopilotKit
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: response.content,
                role: response.role,
              },
              finish_reason: "stop",
            },
          ],
          metadata: response.metadata,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Default response
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content:
                "Hello! I'm your Kigo Pro AI assistant. How can I help you create or optimize your campaigns today?",
              role: "assistant",
            },
            finish_reason: "stop",
          },
        ],
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("CopilotKit API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to process request",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "healthy",
      service: "CopilotKit API",
      features: {
        langGraph: true,
        langSmith: langSmithConfig.enabled,
        openAI: !!process.env.OPENAI_API_KEY,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
