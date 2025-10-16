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
  console.log("=".repeat(80));
  console.log("🔵 [CopilotKit API] POST /api/copilotkit - REQUEST RECEIVED");
  console.log("=".repeat(80));

  // Connect to your existing LangGraph supervisor workflow via FastAPI
  const langGraphUrl =
    process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit";
  console.log(`🔗 [LangGraph URL]: ${langGraphUrl}`);

  // Log request details
  try {
    const body = await req.clone().json();
    console.log(`📨 Request body keys: ${Object.keys(body).join(", ")}`);
    console.log(`💬 Messages count: ${body.messages?.length || 0}`);
  } catch (e) {
    console.log("⚠️  Could not parse request body");
  }

  const runtime = new CopilotRuntime({
    agents: {
      supervisor: new LangGraphHttpAgent({
        url: langGraphUrl,
      }),
    },
  });

  console.log("🎯 CopilotRuntime created with supervisor agent");

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new AnthropicAdapter({
      anthropic,
      model: "claude-3-5-sonnet-20241022",
    }),
    endpoint: "/api/copilotkit",
  });

  console.log("✅ Calling handleRequest...");
  const response = await handleRequest(req);
  console.log(`📤 Response status: ${response.status}`);

  return response;
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
