/**
 * LLM-Based Intent Detection Service
 *
 * Uses OpenAI to intelligently detect user intent from natural language
 * instead of brittle pattern matching.
 */

import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IntentContext {
  currentPage: string;
  userRole: string;
  campaignData?: any;
}

export type UserIntent =
  | "ad_creation"
  | "campaign_optimization"
  | "filter_management"
  | "analytics_query"
  | "merchant_support"
  | "general_assistance";

/**
 * Detect user intent using LLM analysis
 */
export async function detectUserIntent(
  userInput: string,
  context: IntentContext
): Promise<UserIntent> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective for intent detection
      messages: [
        {
          role: "system",
          content: `You are an intent detection system for a marketing platform called Kigo Pro.

Analyze the user's message and determine their intent. Return ONLY the intent category.

Available intents:
- ad_creation: User wants to create, build, make, or start an advertisement/ad/campaign
- campaign_optimization: User wants to optimize, improve, or enhance existing campaign performance  
- filter_management: User wants to create, manage, or work with product filters/targeting
- analytics_query: User wants to see analytics, reports, metrics, or performance data
- merchant_support: User needs help, guidance, or support with platform features
- general_assistance: General questions, greetings, or unclear requests

Context:
- Current page: ${context.currentPage}
- User role: ${context.userRole}

Be intelligent about natural language variations. "I'd like to create an ad" = ad_creation.
Consider page context - if user is on ads-create page, lean toward ad_creation.

Return ONLY the intent name (e.g., "ad_creation").`,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      temperature: 0, // Deterministic for intent detection
      max_tokens: 20, // We only need the intent name
    });

    const detectedIntent =
      response.choices[0]?.message?.content?.trim() as UserIntent;

    // Validate the intent is one of our known types
    const validIntents: UserIntent[] = [
      "ad_creation",
      "campaign_optimization",
      "filter_management",
      "analytics_query",
      "merchant_support",
      "general_assistance",
    ];

    if (validIntents.includes(detectedIntent)) {
      console.log(
        `[Intent Detection] ✅ LLM detected intent: ${detectedIntent} for: "${userInput}"`
      );
      return detectedIntent;
    } else {
      console.log(
        `[Intent Detection] ⚠️ LLM returned invalid intent: ${detectedIntent}, defaulting to general_assistance`
      );
      return "general_assistance";
    }
  } catch (error) {
    console.error(
      "[Intent Detection] ❌ LLM error, falling back to heuristics:",
      error
    );

    // Fallback to simple heuristics if LLM fails
    return detectIntentHeuristic(userInput, context);
  }
}

/**
 * Fallback heuristic-based intent detection
 */
function detectIntentHeuristic(
  userInput: string,
  context: IntentContext
): UserIntent {
  const input = userInput.toLowerCase();

  // Ad creation (more flexible regex patterns)
  if (
    /\b(create|make|build|start|new|want|need|like).{0,20}\b(ad|advertisement|campaign)\b/i.test(
      userInput
    ) ||
    /\bwanna\s+(create|make|build)\b/i.test(userInput) ||
    /\b(i'd like|would like|want to|need to).{0,20}\b(create|make|build)\b/i.test(
      userInput
    )
  ) {
    return "ad_creation";
  }

  // Campaign optimization
  if (
    /\b(optimize|improve|enhance|better|performance|roi)\b/i.test(userInput)
  ) {
    return "campaign_optimization";
  }

  // Filter management
  if (/\b(filter|target|criteria|product selection)\b/i.test(userInput)) {
    return "filter_management";
  }

  // Analytics
  if (
    /\b(analytics|stats|metrics|performance|data|reports|dashboard)\b/i.test(
      userInput
    )
  ) {
    return "analytics_query";
  }

  // Merchant support
  if (
    /\b(help|support|guidance|how to|need help|assistance)\b/i.test(userInput)
  ) {
    return "merchant_support";
  }

  // Context-based detection
  if (
    context.currentPage?.includes("ads-create") ||
    context.currentPage?.includes("campaigns")
  ) {
    return "ad_creation";
  }

  return "general_assistance";
}
