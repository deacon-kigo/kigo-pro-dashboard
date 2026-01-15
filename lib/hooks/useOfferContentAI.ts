"use client";

import { useCopilotAction, useCopilotReadable } from "@/lib/copilot-stubs";

/**
 * Prompt templates with dynamic variable substitution
 */
const PROMPTS = {
  brand_narrative: `Generate a compelling 2-3 sentence brand narrative for this merchant and offer:

Merchant: {merchantName}
Offer Type: {offerType}
Offer Title: {offerTitle}
Description: {description}

Create a brand story that:
- Highlights the merchant's unique value proposition
- Connects emotionally with customers
- Builds trust and authenticity
- Is concise and engaging

Brand Narrative:`,

  merchant_narrative: `Create a merchant value proposition story based on:

Merchant: {merchantName}
Offer Type: {offerType}
Description: {description}

Write a 2-3 sentence narrative that:
- Establishes the merchant as a trusted industry leader
- Emphasizes customer-first values
- Creates memorable brand positioning
- Focuses on expertise and quality

Merchant Story:`,

  offer_narrative: `Enhance this offer description to be more compelling:

Merchant: {merchantName}
Offer Type: {offerType}
Offer Title: {offerTitle}
Current Description: {description}

Create an enhanced description that:
- Emphasizes value and exclusivity
- Creates urgency (limited-time feel)
- Speaks directly to customer benefits
- Is 2-3 sentences, clear and action-oriented

Enhanced Description:`,

  categories: `Suggest relevant categories for this offer:

Merchant: {merchantName}
Offer Type: {offerType}
Offer Title: {offerTitle}
Description: {description}

Return 4-6 relevant category keywords as a comma-separated list (lowercase, no spaces after commas).
Focus on: industry, offer type, target audience, product/service categories.

Categories:`,

  keywords: `Generate SEO-optimized keywords for this offer:

Merchant: {merchantName}
Offer Type: {offerType}
Offer Title: {offerTitle}
Description: {description}

Return 8-12 relevant keywords as a comma-separated list (lowercase, no spaces after commas).
Include: merchant name, offer type, action words, product terms, value words.

Keywords:`,
};

/**
 * Substitute variables in prompt template
 */
function substituteVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || "");
  });
  return result;
}

/**
 * Custom hook for AI-powered offer content generation
 * Uses CopilotKit for real AI generation with prompt engineering
 */
export function useOfferContentAI(context: Record<string, any>) {
  // Make context readable to CopilotKit
  useCopilotReadable({
    description: "Current offer form context for AI content generation",
    value: context,
  });

  // Brand Narrative Generation
  useCopilotAction({
    name: "generate_brand_narrative",
    description:
      "Generate a compelling brand narrative based on merchant and offer details",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Name of the merchant/brand",
        required: true,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer (e.g., BOGO, percent_off, dollar_off)",
        required: true,
      },
      {
        name: "offerTitle",
        type: "string",
        description: "Title/name of the offer",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Current offer description",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, offerTitle, description }) => {
      const prompt = substituteVariables(PROMPTS.brand_narrative, {
        merchantName,
        offerType,
        offerTitle,
        description,
      });

      // This will be handled by CopilotKit's LLM
      return prompt;
    },
  });

  // Merchant Narrative Generation
  useCopilotAction({
    name: "generate_merchant_narrative",
    description: "Generate merchant value proposition story",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Name of the merchant",
        required: true,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Offer description",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, description }) => {
      const prompt = substituteVariables(PROMPTS.merchant_narrative, {
        merchantName,
        offerType,
        description,
      });

      return prompt;
    },
  });

  // Offer Narrative Enhancement
  useCopilotAction({
    name: "generate_offer_narrative",
    description: "Enhance offer description with compelling copy",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Merchant name",
        required: true,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer",
        required: true,
      },
      {
        name: "offerTitle",
        type: "string",
        description: "Offer title",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Current description to enhance",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, offerTitle, description }) => {
      const prompt = substituteVariables(PROMPTS.offer_narrative, {
        merchantName,
        offerType,
        offerTitle,
        description,
      });

      return prompt;
    },
  });

  // Categories Suggestion
  useCopilotAction({
    name: "generate_categories",
    description: "Suggest relevant categories for the offer",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Merchant name",
        required: true,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer",
        required: true,
      },
      {
        name: "offerTitle",
        type: "string",
        description: "Offer title",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Offer description",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, offerTitle, description }) => {
      const prompt = substituteVariables(PROMPTS.categories, {
        merchantName,
        offerType,
        offerTitle,
        description,
      });

      return prompt;
    },
  });

  // Keywords Generation
  useCopilotAction({
    name: "generate_keywords",
    description: "Generate SEO-optimized keywords for the offer",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Merchant name",
        required: true,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer",
        required: true,
      },
      {
        name: "offerTitle",
        type: "string",
        description: "Offer title",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Offer description",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, offerTitle, description }) => {
      const prompt = substituteVariables(PROMPTS.keywords, {
        merchantName,
        offerType,
        offerTitle,
        description,
      });

      return prompt;
    },
  });
}
