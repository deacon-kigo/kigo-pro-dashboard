/**
 * Official CopilotKit SDK Integration
 *
 * Configured to prioritize remote LangGraph endpoint over Anthropic Claude fallback
 * This ensures responses come from our custom agents when available
 */

import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  AnthropicAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  LangGraphHttpAgent,
} from "@copilotkit/runtime";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const POST = async (req: NextRequest) => {
  // Connect to your existing LangGraph supervisor workflow via FastAPI
  const runtime = new CopilotRuntime({
    agents: {
      supervisor: new LangGraphHttpAgent({
        url:
          process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit",
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new AnthropicAdapter({
      anthropic,
      model: "claude-3-5-sonnet-20241022", // Claude 4 Sonnet latest version
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
