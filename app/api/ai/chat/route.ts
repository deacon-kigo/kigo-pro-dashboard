/**
 * AI Chat API Route for Kigo Pro Dashboard
 *
 * Based on kigo-ai-server implementation
 * Uses Anthropic Claude for AI responses
 */

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const SYSTEM_PROMPT = `You are an AI assistant for Kigo Pro Dashboard, a marketing campaign and offer management platform.

You help users with:
- Creating and managing marketing offers (BOGO, percentage discounts, loyalty points, etc.)
- Building and optimizing advertising campaigns
- Analyzing campaign performance and metrics
- Managing product catalogs and filters
- Understanding customer segments and targeting
- Recommending best practices for offers and campaigns

You have deep knowledge of:
- Offer types: percentage_savings, BOGO, dollars_off, free_with_purchase, loyalty_points
- Redemption methods: in-store codes, mobile app, QR codes, digital wallets
- Campaign metrics: CTR, conversion rates, ROI, engagement
- Program types: instant rewards, sweepstakes, loyalty programs

Be helpful, concise, and actionable. Provide specific recommendations when asked.
When discussing offers or campaigns, include relevant details like timing, targeting, and expected outcomes.`;

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          message: "messages field is required and must be an array",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Stream response using Anthropic Claude
    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
