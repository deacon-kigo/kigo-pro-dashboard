/**
 * CopilotKit API Route for Kigo Pro Dashboard
 *
 * This route integrates our LangGraph multi-agent system with CopilotKit.
 * Uses CopilotKit's standard action system without custom message handling.
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

// Configure runtime without custom actions - let frontend actions handle everything
const runtime = new CopilotRuntime({
  // No custom actions - CopilotKit will use the ones registered via useCopilotAction hooks
});

// Export POST handler
export const POST = async (req: NextRequest) => {
  console.log(
    "[CopilotKit] 🚀 Enhanced Kigo agent with frontend actions available"
  );

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
