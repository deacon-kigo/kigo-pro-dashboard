/**
 * Vercel AI SDK Chat API Route
 *
 * Following the official pattern from https://github.com/vercel/ai
 */

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Schema for generative UI components
const generativeUISchema = z.object({
  type: z.enum([
    "campaign-builder",
    "analytics-dashboard",
    "customer-insights",
  ]),
  props: z.record(z.any()),
});

function analyzePromptForUI(
  prompt: string
): { type: string; props: any } | null {
  const lowerPrompt = prompt.toLowerCase();

  // Campaign creation patterns
  if (
    lowerPrompt.includes("create") &&
    (lowerPrompt.includes("campaign") || lowerPrompt.includes("targeting"))
  ) {
    const targetAudience =
      extractTargetAudience(prompt) || "First-time home buyers";
    const offers = extractOffers(prompt) || [
      "HELOC Special Rate",
      "Moving Day Package",
      "First-Time Buyer Bonus",
    ];

    return {
      type: "campaign-builder",
      props: {
        campaignType: "Targeted Marketing Campaign",
        targetAudience,
        offers,
      },
    };
  }

  // Analytics patterns
  if (
    lowerPrompt.includes("analytics") ||
    lowerPrompt.includes("performance") ||
    lowerPrompt.includes("revenue") ||
    lowerPrompt.includes("roi")
  ) {
    return {
      type: "analytics-dashboard",
      props: {
        metric: extractMetric(prompt) || "Overall Performance",
        timeframe: extractTimeframe(prompt) || "Last 30 days",
      },
    };
  }

  // Customer insights patterns
  if (
    lowerPrompt.includes("customer") ||
    lowerPrompt.includes("behavior") ||
    lowerPrompt.includes("segment") ||
    lowerPrompt.includes("insights")
  ) {
    return {
      type: "customer-insights",
      props: {
        segment: extractSegment(prompt) || "First-time home buyers",
        insights: [
          "Peak engagement occurs during weekday evenings (7-9 PM)",
          "Strong preference for bundled offers with 3+ products",
          "Mobile-first behavior with 78% of interactions on mobile devices",
          "High conversion rate for time-limited offers (24-48 hour windows)",
        ],
      },
    };
  }

  return null;
}

function extractTargetAudience(prompt: string): string | null {
  const patterns = [
    /targeting\s+([^,\n]+)/i,
    /audience[:\s]+([^,\n]+)/i,
    /(first[- ]time\s+home\s+buyers?)/i,
    /(millennials?)/i,
    /(families)/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function extractOffers(prompt: string): string[] | null {
  const offers = [];
  if (prompt.toLowerCase().includes("heloc")) offers.push("HELOC Special Rate");
  if (prompt.toLowerCase().includes("moving"))
    offers.push("Moving Day Package");
  if (prompt.toLowerCase().includes("local"))
    offers.push("Local Business Partnerships");
  if (prompt.toLowerCase().includes("bonus"))
    offers.push("First-Time Buyer Bonus");

  return offers.length > 0 ? offers : null;
}

function extractMetric(prompt: string): string | null {
  if (prompt.toLowerCase().includes("revenue")) return "Revenue Analysis";
  if (prompt.toLowerCase().includes("conversion")) return "Conversion Metrics";
  if (prompt.toLowerCase().includes("engagement"))
    return "Engagement Analytics";
  return null;
}

function extractTimeframe(prompt: string): string | null {
  if (prompt.toLowerCase().includes("week")) return "Last 7 days";
  if (prompt.toLowerCase().includes("month")) return "Last 30 days";
  if (prompt.toLowerCase().includes("quarter")) return "Last 90 days";
  return null;
}

function extractSegment(prompt: string): string | null {
  const segments = [
    "First-time home buyers",
    "Millennials",
    "Young families",
    "Urban professionals",
    "High-value customers",
  ];

  for (const segment of segments) {
    if (prompt.toLowerCase().includes(segment.toLowerCase())) {
      return segment;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Analyze if we should generate UI
    const uiComponent = analyzePromptForUI(lastMessage.content);

    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are an AI Marketing Co-pilot for Kigo Pro, a sophisticated marketing platform. You help marketing managers with:

1. **Campaign Creation**: Design targeted campaigns with specific audiences, offers, and mechanics
2. **Customer Analysis**: Analyze behavioral patterns, segments, and opportunities  
3. **Revenue Optimization**: Identify high-value opportunities and ROI projections
4. **Strategic Recommendations**: Provide tactical and strategic marketing advice

**Context**: You have access to customer data showing:
- 34,000+ active customers across various segments
- Journey opportunities in home buying, DIY, education, food & beverage
- Revenue potential of $2.9M+ in identified opportunities
- Behavioral patterns for millennials, families, urban professionals

**Response Style**:
- Be specific with numbers, timelines, and actionable recommendations
- Include revenue projections and confidence scores when relevant
- Provide clear next steps and implementation guidance
- Use emojis and formatting for readability
- Focus on practical, implementable solutions

${uiComponent ? `**IMPORTANT**: An interactive UI component will be generated alongside your response. Keep your text response concise and complementary to the UI component.` : ""}

**Example Query**: "Create a campaign targeting first-time home buyers with HELOC offers"
**Your Response Should Include**: Target audience size, offer structure, revenue projections, timeline, and next steps.`,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // If we have a UI component, we need to handle it differently
    if (uiComponent) {
      // For now, we'll include the UI component info in the response
      // The frontend will parse this and render the appropriate component
      const stream = result.toUIMessageStreamResponse();

      // Add UI component metadata to the response
      const response = new Response(stream.body, {
        headers: {
          ...Object.fromEntries(stream.headers.entries()),
          "X-UI-Component": JSON.stringify(uiComponent),
        },
      });

      return response;
    }

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Vercel AI Chat API error:", error);
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
