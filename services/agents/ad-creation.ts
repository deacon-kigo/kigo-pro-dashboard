import { AIMessage } from "@langchain/core/messages";
import { createTracedFunction, logAgentInteraction } from "@/lib/copilot-stubs";
import { KigoProAgentState } from "./supervisor";

/**
 * Ad Creation Agent
 *
 * This agent specializes in creating advertising campaigns through
 * natural language interaction. It extracts campaign parameters,
 * validates requirements, and generates campaign creation instructions.
 */

interface AdCreationParams {
  campaignName?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  businessType?: string;
  targetAudience?: string;
  mediaTypes?: string[];
  location?: string;
  campaignType?: string;
}

/**
 * Main Ad Creation Agent Function
 */
export const adCreationAgent = createTracedFunction(
  "ad_creation_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages, workflowData } = state;

    try {
      // Extract campaign parameters from user input
      const latestMessage = messages[messages.length - 1];
      const userInput = latestMessage.content as string;

      const params = await extractCampaignParameters(userInput, workflowData);

      // Validate required parameters
      const validation = validateCampaignParameters(params);

      if (!validation.isValid) {
        return await handleMissingParameters(
          state,
          validation.missingFields,
          params
        );
      }

      // Generate campaign creation response
      const response = await generateCampaignCreationResponse(params);

      // Log the interaction
      logAgentInteraction(
        "ad_creation_agent",
        { userInput, workflowData },
        { params, response },
        { campaignType: params.campaignType }
      );

      return {
        messages: [...messages, response],
        workflowData: {
          ...workflowData,
          campaignParams: params,
          readyToCreate: true,
        },
      };
    } catch (error) {
      console.error("Ad creation agent error:", error);

      const errorResponse = new AIMessage({
        content:
          "I apologize, but I encountered an error while processing your campaign creation request. Please try again or provide more details about what you'd like to create.",
      });

      return {
        messages: [...messages, errorResponse],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
);

/**
 * Extract campaign parameters from natural language input
 */
async function extractCampaignParameters(
  userInput: string,
  workflowData: any
): Promise<AdCreationParams> {
  const input = userInput.toLowerCase();
  const params: AdCreationParams = {};

  // Extract budget
  const budgetMatch = userInput.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (budgetMatch) {
    params.budget = parseFloat(budgetMatch[1].replace(",", ""));
  } else if (workflowData.budget) {
    params.budget = workflowData.budget;
  }

  // Extract business type
  const businessTypes = {
    restaurant: ["restaurant", "pizza", "food", "dining", "cafe", "bar"],
    retail: ["store", "shop", "retail", "clothing", "fashion"],
    pharmacy: ["pharmacy", "drug store", "cvs", "walgreens"],
    automotive: ["car", "auto", "vehicle", "dealership"],
    technology: ["tech", "software", "app", "digital"],
    healthcare: ["medical", "health", "doctor", "clinic"],
    finance: ["bank", "financial", "insurance", "loan"],
  };

  for (const [type, keywords] of Object.entries(businessTypes)) {
    if (keywords.some((keyword) => input.includes(keyword))) {
      params.businessType = type;
      break;
    }
  }

  // Extract target audience
  const audienceKeywords = {
    families: ["families", "family", "parents", "kids"],
    students: ["students", "college", "university", "school"],
    professionals: ["professionals", "business", "corporate", "office"],
    seniors: ["seniors", "elderly", "retirement", "older"],
    millennials: ["millennials", "young adults", "20s", "30s"],
    "gen z": ["gen z", "teenagers", "teens", "young people"],
  };

  for (const [audience, keywords] of Object.entries(audienceKeywords)) {
    if (keywords.some((keyword) => input.includes(keyword))) {
      params.targetAudience = audience;
      break;
    }
  }

  // Extract media types
  const mediaKeywords = {
    display: ["display", "banner", "web ads"],
    social: ["social", "facebook", "instagram", "twitter"],
    video: ["video", "youtube", "streaming"],
    native: ["native", "content", "article"],
    search: ["search", "google", "bing"],
  };

  params.mediaTypes = [];
  for (const [media, keywords] of Object.entries(mediaKeywords)) {
    if (keywords.some((keyword) => input.includes(keyword))) {
      params.mediaTypes.push(media);
    }
  }

  // Default media types if none specified
  if (params.mediaTypes.length === 0) {
    params.mediaTypes = ["display", "social"];
  }

  // Generate campaign name if not provided
  if (!params.campaignName) {
    params.campaignName = generateCampaignName(params);
  }

  // Generate description
  if (!params.description) {
    params.description = generateCampaignDescription(params);
  }

  // Set default dates (start today, end in 30 days)
  if (!params.startDate) {
    params.startDate = new Date().toISOString().split("T")[0];
  }

  if (!params.endDate) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    params.endDate = endDate.toISOString().split("T")[0];
  }

  // Set campaign type
  params.campaignType = "Advertising";

  return params;
}

/**
 * Validate campaign parameters
 */
function validateCampaignParameters(params: AdCreationParams): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = ["campaignName", "description", "budget"];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!params[field as keyof AdCreationParams]) {
      missingFields.push(field);
    }
  }

  // Validate budget range
  if (params.budget && (params.budget < 50 || params.budget > 100000)) {
    missingFields.push("budget (must be between $50 and $100,000)");
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Handle missing parameters by asking for clarification
 */
async function handleMissingParameters(
  state: KigoProAgentState,
  missingFields: string[],
  params: AdCreationParams
): Promise<Partial<KigoProAgentState>> {
  const { messages } = state;

  let clarificationMessage =
    "I'd be happy to help you create that campaign! I need a bit more information:\n\n";

  const fieldPrompts = {
    campaignName: "• What would you like to name your campaign?",
    description:
      "• Could you provide a brief description of what this campaign is for?",
    budget: "• What's your budget for this campaign? (minimum $50)",
    businessType: "• What type of business is this for?",
    targetAudience: "• Who is your target audience?",
  };

  for (const field of missingFields) {
    const cleanField = field.split(" ")[0]; // Remove validation notes
    if (fieldPrompts[cleanField as keyof typeof fieldPrompts]) {
      clarificationMessage +=
        fieldPrompts[cleanField as keyof typeof fieldPrompts] + "\n";
    }
  }

  // Show what we've already captured
  const captured = [];
  if (params.budget) captured.push(`Budget: $${params.budget}`);
  if (params.businessType) captured.push(`Business: ${params.businessType}`);
  if (params.targetAudience)
    captured.push(`Audience: ${params.targetAudience}`);

  if (captured.length > 0) {
    clarificationMessage += `\nI've already captured: ${captured.join(", ")}`;
  }

  const response = new AIMessage({
    content: clarificationMessage,
  });

  return {
    messages: [...messages, response],
    workflowData: {
      ...state.workflowData,
      pendingParams: params,
      awaitingInput: missingFields,
    },
  };
}

/**
 * Generate campaign creation response
 */
async function generateCampaignCreationResponse(
  params: AdCreationParams
): Promise<AIMessage> {
  const content = `Perfect! I'll create your "${params.campaignName}" campaign with the following details:

📊 **Campaign Overview:**
• Name: ${params.campaignName}
• Description: ${params.description}
• Budget: $${params.budget?.toLocaleString()}
• Duration: ${params.startDate} to ${params.endDate}

🎯 **Targeting:**
• Business Type: ${params.businessType || "General"}
• Target Audience: ${params.targetAudience || "General audience"}

📱 **Media Types:**
• ${params.mediaTypes?.join(", ") || "Display, Social"}

I'll now set up your campaign in the system. Would you like me to:
1. ✅ Create the campaign now
2. 📝 Suggest specific ad copy for your ${params.businessType} business
3. 🎨 Recommend creative assets
4. 📍 Configure location targeting

Just let me know how you'd like to proceed!`;

  return new AIMessage({
    content,
    additional_kwargs: {
      campaignParams: params,
      actionType: "createCampaign",
      readyToExecute: true,
    },
  });
}

/**
 * Generate campaign name based on parameters
 */
function generateCampaignName(params: AdCreationParams): string {
  const businessType = params.businessType || "Business";
  const audience = params.targetAudience || "Customer";
  const date = new Date().toISOString().split("T")[0];

  return `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} ${audience.charAt(0).toUpperCase() + audience.slice(1)} Campaign ${date}`;
}

/**
 * Generate campaign description based on parameters
 */
function generateCampaignDescription(params: AdCreationParams): string {
  const businessType = params.businessType || "business";
  const audience = params.targetAudience || "customers";

  return `Promotional campaign for ${businessType} targeting ${audience}`;
}

export default adCreationAgent;
