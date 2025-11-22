/**
 * AI Prompt Templates for Offer Content Generation
 *
 * These prompts are used with CopilotKit to generate compelling
 * offer content using LLMs.
 */

export const OFFER_AI_PROMPTS = {
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
