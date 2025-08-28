/**
 * Official CopilotKit SDK Integration
 *
 * Configured to prioritize remote LangGraph endpoint over OpenAI fallback
 * This ensures responses come from our custom agents when available
 */

import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  LangGraphHttpAgent,
} from "@copilotkit/runtime";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    serviceAdapter: new OpenAIAdapter({ openai }),
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
