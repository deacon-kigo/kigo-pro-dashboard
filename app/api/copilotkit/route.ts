/**
 * CopilotKit API Route - Simplified (No LangGraph)
 *
 * Using Anthropic Claude directly without external agent dependencies
 */

import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  AnthropicAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export const POST = async (req: NextRequest) => {
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new AnthropicAdapter({
      anthropic,
      model: "claude-3-5-sonnet-20241022",
    }),
    endpoint: "/api/copilotkit",
  });

  return await handleRequest(req);
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
