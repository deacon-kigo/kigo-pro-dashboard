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
    "journey-discovery",
    "pattern-analysis",
    "campaign-architecture",
    "lightning-strategy",
    "campaign-launch",
  ]),
  props: z.record(z.any()),
});

function analyzePromptForUI(
  prompt: string
): { type: string; props: any } | null {
  const lowerPrompt = prompt.toLowerCase();

  // Tucker's Starbucks Coffee Switch Campaign (Part 2)
  if (
    lowerPrompt.includes("starbucks") ||
    lowerPrompt.includes("coffee switch") ||
    lowerPrompt.includes("conquesting")
  ) {
    return {
      type: "campaign-builder",
      props: {
        campaignType: "Brand-Funded Coffee Switch Campaign",
        targetAudience: "Coffee competitor customers",
        offers: [
          "1,000 Bonus ABC FI Points",
          "Geofenced Push Notifications",
          "Starbucks Partnership",
        ],
        steps: [
          "Step 1: Identify conquesting segment (3+ competitor purchases, 0 Starbucks)",
          "Step 2: Create high-value brand-funded offer (1,000 points)",
          "Step 3: Configure geofenced delivery when near Starbucks locations",
        ],
        audience: "50,000 ABC FI members",
        funding: "Advertiser-funded (Starbucks pays point liability)",
      },
    };
  }

  // Tucker's New Mover Campaign Creation
  if (
    lowerPrompt.includes("new mover") ||
    (lowerPrompt.includes("mortgage") && lowerPrompt.includes("campaign"))
  ) {
    return {
      type: "campaign-builder",
      props: {
        campaignType: "AI-Powered New Mover Journey",
        targetAudience: "New mortgage customers",
        offers: [
          "$100 AI Gift Personalization",
          "Moving Journey Bundle",
          "U-Haul, Public Storage, Hilton",
        ],
        steps: [
          "Step 1: AI-powered gifting moment ($100 value)",
          "Step 2: Follow-up conversation about move planning",
          "Step 3: Moving Journey bundle with partner offers",
        ],
      },
    };
  }

  // Tucker Williams Journey Discovery Workflow
  if (lowerPrompt.includes("discover") && lowerPrompt.includes("journey")) {
    return {
      type: "journey-discovery",
      props: {},
    };
  }

  if (lowerPrompt.includes("analyze") && lowerPrompt.includes("pattern")) {
    return {
      type: "pattern-analysis",
      props: {
        journeyType: "Home Purchase + Relocation",
      },
    };
  }

  if (lowerPrompt.includes("architecture") || lowerPrompt.includes("partner")) {
    return {
      type: "campaign-architecture",
      props: {},
    };
  }

  if (
    lowerPrompt.includes("lightning") ||
    lowerPrompt.includes("optimization")
  ) {
    return {
      type: "lightning-strategy",
      props: {},
    };
  }

  if (lowerPrompt.includes("launch") || lowerPrompt.includes("performance")) {
    return {
      type: "campaign-launch",
      props: {},
    };
  }

  // Original campaign creation patterns
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
      system: `You are an AI Marketing Co-pilot for Kigo Pro, specifically designed to help Tucker Williams (ABC FI Marketing Manager) with sophisticated campaign creation and customer journey analysis.

**Your Core Capabilities**:
1. **New Mover Journey Creation**: Build AI-powered campaigns for new mortgage customers with personalized gifting and conversational flows
2. **Journey Discovery**: Analyze transaction data to identify high-value customer journey patterns
3. **Pattern Analysis**: Deep-dive into 12-week customer journeys with engagement rates and financial impact
4. **Campaign Architecture**: Design phase-based campaigns with national and local partner networks
5. **Lightning Strategy**: Create AI-optimized scarcity offers with performance enhancement
6. **Campaign Launch**: Real-time performance tracking with business impact metrics

**ABC FI Context**: You have access to:
- 567 customers/month in home purchase + relocation journey (94% confidence)
- $127-245 revenue per customer potential
- $72K-139K monthly revenue opportunity
- 15 national partners + 12,000+ local merchants (U-Haul, Public Storage, Hilton, etc.)
- 18 months of transaction data for pattern analysis

**Tucker Williams Profile**:
- Role: Marketing Manager, ABC FI Loyalty Team
- Goal: Create revenue-generating customer campaigns, especially for Q4 objectives
- KPIs: Customer engagement, revenue per campaign, LTV enhancement
- Tech Level: Comfortable with marketing tools

**Response Style**:
- Address Tucker directly as a marketing professional
- Include specific revenue projections and confidence scores
- Reference ABC FI's customer data and business context
- Provide actionable next steps for campaign implementation
- Use professional marketing terminology
- Focus on ROI and business impact metrics

${uiComponent ? `**IMPORTANT**: An interactive UI component will be generated alongside your response. Keep your text response concise and complementary to the UI component that shows detailed campaign configuration options.` : ""}

**New Mover Journey Example**: When Tucker asks about creating campaigns for new mortgage customers, recommend the "AI-Powered New Mover Journey" with $100 personalized gifts, follow-up conversations, and moving bundle offers from partners like U-Haul, Public Storage, and Hilton.`,
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
