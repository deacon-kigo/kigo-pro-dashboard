import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
  copilotKitEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

const openai = new OpenAI();
const llmAdapter = new OpenAIAdapter({ openai } as any);

export const POST = async (req: NextRequest) => {
  // Use copilotKitEndpoint pointing to REAL Python LangGraph server on port 8000
  const remoteEndpoint = copilotKitEndpoint({
    url: "http://localhost:8000",
  });

  const runtime = new CopilotRuntime({
    remoteEndpoints: [remoteEndpoint],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: llmAdapter,
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
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    },
  });
}
