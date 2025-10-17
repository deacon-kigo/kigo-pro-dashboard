/**
 * CopilotKit Direct LLM API Route
 * Bypasses LangGraph - calls OpenAI/Anthropic directly
 * For demo purposes - simpler integration for offer creation
 */

import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

const OFFER_MANAGER_SYSTEM_PROMPT = `You are an AI assistant for the Kigo PRO Offer Manager. Help users create marketing offers step-by-step.

**Your Role:**
- Guide through offer creation workflow (Goal → Details → Redemption → Campaign → Review)
- Ask clarifying questions about business objectives, target audience, and budget
- Recommend offer types (Discount %, Fixed $, BOGO, Cashback, Points, Lightning offers)
- Suggest optimal values based on goals (15-20% discounts typically perform best)
- Help with redemption methods (Promo Code, Show & Save, Barcode Scan, Online Link)
- Provide campaign setup guidance

**Program Types:**
- Closed Loop (e.g., John Deere): Dealer networks with corporate campaigns
- Open Loop (e.g., Yardi): Property management with merchant marketplace

Be conversational, provide specific recommendations, and celebrate progress!`;

export const POST = async (req: NextRequest) => {
  console.log("🟢 [CopilotKit Direct] Request received");

  try {
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create OpenAI adapter with system prompt
    const serviceAdapter = new OpenAIAdapter({
      openai,
      model: "gpt-4o",
    });

    // Create runtime
    const runtime = new CopilotRuntime();

    console.log("✅ Using OpenAI direct adapter");

    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilot-direct",
    });

    return await handleRequest(req);
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
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
