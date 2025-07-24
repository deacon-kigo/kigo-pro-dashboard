import { BaseMessage, AIMessage } from "@langchain/core/messages";
import { createTracedFunction } from "../../lib/copilot-kit/langsmith-config";
import { KigoProAgentState } from "./supervisor";
import { store } from "../../lib/redux/store";
import {
  setLoading,
  addNotification,
  setCurrentPage,
  highlightComponent,
} from "../../lib/redux/slices/uiSlice";
import { addAd } from "../../lib/redux/slices/campaignSlice";

// Ad requirements interface
interface AdRequirements {
  adName?: string;
  merchant?: string;
  offer?: string;
  mediaType?: string[];
  costPerActivation?: number;
  costPerRedemption?: number;
  completeness: number;
}

// Mock data for merchants and offers
const AVAILABLE_MERCHANTS = [
  "Starbucks",
  "McDonald's",
  "Target",
  "Best Buy",
  "Nike",
];
const AVAILABLE_OFFERS = {
  Starbucks: [
    "20% off any drink",
    "Buy one get one free",
    "Free pastry with drink",
  ],
  "McDonald's": ["$1 off Big Mac", "Free fries with purchase", "20% off meal"],
  Target: ["10% off electronics", "15% off clothing", "Free shipping"],
  "Best Buy": ["$50 off laptops", "20% off accessories", "Extended warranty"],
  Nike: ["25% off shoes", "Free shipping", "15% off athletic wear"],
};

/**
 * Campaign Agent
 *
 * Specialized agent for ad creation, campaign management, and optimization.
 * Enhanced to leverage CopilotKit SDK actions for navigation and UI control.
 */
const campaignAgent = createTracedFunction(
  "campaign_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages, context } = state;

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    const userInput = latestMessage.content as string;

    // Analyze user input for ad creation intent
    const analysis = analyzeUserInputForAdCreation(userInput);

    // Check if user wants to create an ad and is not on the ad creation page
    if (
      analysis.intent === "create_ad" &&
      context.currentPage !== "/campaign-manager/ads-create"
    ) {
      const response = new AIMessage({
        content: `I'd be happy to help you create an ad! Let me navigate you to the ad creation page where we can build your ad together step by step.

I'll use the navigateToPageAndPerform action to take you there and provide guidance along the way.`,
      });

      return {
        messages: [...messages, response],
        workflowData: {
          ...state.workflowData,
          suggestedAction: "navigateToPageAndPerform",
          actionParams: {
            destination: "/campaign-manager/ads-create",
            intent: "create_ad",
            context: {
              source: "campaign_agent",
              userIntent: "ad_creation",
            },
            preActions: "showGuidance",
            postActions: "highlightField",
          },
        },
      };
    }

    // If already on ad creation page, help with the form
    if (context.currentPage === "/campaign-manager/ads-create") {
      const requirements = extractAdRequirements(userInput);
      const nextStep = determineNextConversationStep(requirements);

      let responseContent = "";

      switch (nextStep) {
        case "ask_for_name":
          responseContent = generateQuestionResponse("adName", requirements);
          break;
        case "ask_for_merchant":
          responseContent = generateQuestionResponse("merchant", requirements);
          break;
        case "ask_for_offer":
          responseContent = generateQuestionResponse("offer", requirements);
          break;
        case "ask_for_media_type":
          responseContent = generateQuestionResponse("mediaType", requirements);
          break;
        case "ask_for_costs":
          responseContent = generateQuestionResponse("costs", requirements);
          break;
        case "show_preview":
          responseContent = generatePreviewResponse(requirements);
          break;
        case "create_ad":
          return await handleAdCreation(requirements, messages);
        case "help":
        default:
          responseContent = generateHelpResponse();
      }

      const response = new AIMessage({ content: responseContent });
      return { messages: [...messages, response] };
    }

    // General campaign assistance
    const response = new AIMessage({
      content: `I'm here to help with your campaigns and ads! I can assist you with:

• **Creating new ads** - I'll guide you through the entire process
• **Optimizing campaigns** - Improve performance and targeting  
• **Managing existing ads** - Edit or update your current ads

What would you like to work on today? If you'd like to create an ad, just let me know and I'll navigate you to the ad creation page!`,
    });

    return {
      messages: [...messages, response],
    };
  }
);

// Helper functions (keeping the existing logic but simplified)

function analyzeUserInputForAdCreation(input: string): {
  intent: string;
  confidence: number;
} {
  const createAdKeywords = [
    "create ad",
    "new ad",
    "make ad",
    "build ad",
    "add ad",
    "creating an ad",
  ];
  const normalizedInput = input.toLowerCase();

  for (const keyword of createAdKeywords) {
    if (normalizedInput.includes(keyword)) {
      return { intent: "create_ad", confidence: 0.9 };
    }
  }

  return { intent: "general", confidence: 0.5 };
}

function extractAdRequirements(input: string): AdRequirements {
  const requirements: AdRequirements = { completeness: 0 };

  // Extract ad name
  const nameMatch = input.match(
    /(?:ad (?:name|called)|name.*ad).*?["\']([^"\']+)["\']|(?:call it|name it)\s+([a-zA-Z\s]+)/i
  );
  if (nameMatch) {
    requirements.adName = nameMatch[1] || nameMatch[2];
  }

  // Extract merchant
  for (const merchant of AVAILABLE_MERCHANTS) {
    if (input.toLowerCase().includes(merchant.toLowerCase())) {
      requirements.merchant = merchant;
      break;
    }
  }

  // Calculate completeness
  let fields = 0;
  if (requirements.adName) fields++;
  if (requirements.merchant) fields++;
  if (requirements.offer) fields++;
  if (requirements.mediaType) fields++;

  requirements.completeness = (fields / 4) * 100;

  return requirements;
}

function determineNextConversationStep(requirements: AdRequirements): string {
  if (!requirements.adName) return "ask_for_name";
  if (!requirements.merchant) return "ask_for_merchant";
  if (!requirements.offer) return "ask_for_offer";
  if (!requirements.mediaType) return "ask_for_media_type";
  if (!requirements.costPerActivation || !requirements.costPerRedemption)
    return "ask_for_costs";

  if (requirements.completeness >= 80) return "show_preview";
  return "help";
}

function generateQuestionResponse(
  field: string,
  requirements: AdRequirements
): string {
  switch (field) {
    case "adName":
      return "Great! Let's start creating your ad. What would you like to name this ad?";

    case "merchant":
      return `Perfect! Now, which merchant is this ad for? Please choose from: ${AVAILABLE_MERCHANTS.join(", ")}.`;

    case "offer":
      if (requirements.merchant && AVAILABLE_OFFERS[requirements.merchant]) {
        return `Excellent choice with ${requirements.merchant}! What offer would you like to promote? Here are some options: ${AVAILABLE_OFFERS[requirements.merchant].join(", ")}.`;
      }
      return "What offer or promotion would you like this ad to feature?";

    case "mediaType":
      return "What type of media would you like to use for this ad? Options include: Image, Video, or both.";

    case "costs":
      return "Finally, let's set the costs. What would you like the cost per activation and cost per redemption to be?";

    default:
      return "I need a bit more information to help you create this ad.";
  }
}

function generatePreviewResponse(requirements: AdRequirements): string {
  return `Perfect! Here's a preview of your ad:

**Ad Name:** ${requirements.adName}
**Merchant:** ${requirements.merchant}
**Offer:** ${requirements.offer || "To be determined"}
**Media Type:** ${requirements.mediaType?.join(", ") || "Image"}
**Cost per Activation:** $${requirements.costPerActivation || "0.50"}
**Cost per Redemption:** $${requirements.costPerRedemption || "2.00"}

Does this look good? Say "create it" to proceed with creating the ad!`;
}

async function handleAdCreation(
  requirements: AdRequirements,
  messages: BaseMessage[]
): Promise<Partial<KigoProAgentState>> {
  // Dispatch Redux actions to create the ad
  store.dispatch(
    setLoading({ isLoading: true, message: "Creating your ad..." })
  );

  try {
    // Create new ad object
    const newAd = {
      id: `ad_${Date.now()}`,
      name: requirements.adName || "New Ad",
      merchantId: "default",
      merchantName: requirements.merchant || "Unknown",
      offerId: "default",
      mediaType: requirements.mediaType || ["image"],
      mediaAssets: [],
      costPerActivation: requirements.costPerActivation || 0.5,
      costPerRedemption: requirements.costPerRedemption || 2.0,
    };

    // Add the ad to store
    store.dispatch(addAd(newAd));

    // Show success notification
    store.dispatch(
      addNotification({
        message: `Successfully created ad "${newAd.name}" for ${newAd.merchantName}!`,
        type: "success",
      })
    );

    // Highlight the new ad (if there's a component to highlight)
    store.dispatch(highlightComponent("ad-list"));

    const response = new AIMessage({
      content: `🎉 Excellent! I've successfully created your ad "${requirements.adName}" for ${requirements.merchant}!

Your ad has been added to your campaigns and is ready to go. You can now:
• Preview how it will look to customers
• Set up additional targeting options  
• Launch it when you're ready

Is there anything else you'd like to do with this ad or would you like to create another one?`,
    });

    return {
      messages: [...messages, response],
    };
  } catch (error) {
    store.dispatch(
      addNotification({
        message: "Failed to create ad. Please try again.",
        type: "error",
      })
    );

    const errorResponse = new AIMessage({
      content:
        "I encountered an error while creating your ad. Please try again or let me know if you need assistance.",
    });

    return {
      messages: [...messages, errorResponse],
    };
  } finally {
    store.dispatch(setLoading({ isLoading: false }));
  }
}

function generateHelpResponse(): string {
  return `I'm here to help you create an amazing ad! To get started, I'll need:

1. **Ad Name** - What would you like to call this ad?
2. **Merchant** - Which business is this for? (${AVAILABLE_MERCHANTS.join(", ")})
3. **Offer** - What promotion or offer will you feature?
4. **Media Type** - Will you use images, video, or both?
5. **Costs** - Cost per activation and redemption

Just provide any of these details and I'll guide you through the rest!`;
}

export default campaignAgent;
