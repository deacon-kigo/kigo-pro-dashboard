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
import { Templates, ResponseTemplate } from "../ai/response-templates";

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

// Available merchants and offers
const AVAILABLE_MERCHANTS = ["McDonald's", "Starbucks", "Target", "CVS"];
const AVAILABLE_OFFERS: Record<string, string[]> = {
  "McDonald's": ["Buy 1 Get 1 Free", "20% Off Meals", "$5 Off $20"],
  Starbucks: ["Free Drink with Purchase", "BOGO Drinks", "25% Off"],
  Target: ["15% Off Store-wide", "Buy 2 Get 1 Free", "$10 Off $50"],
  CVS: ["ExtraBucks Rewards", "30% Off Beauty", "Free Delivery"],
};

// Helper function to convert template to AI message
function templateToAIMessage(template: ResponseTemplate): AIMessage {
  return new AIMessage({
    content: template.template,
    additional_kwargs: {
      templateId: template.id,
      actions: template.actions,
      context: template.context,
    },
  });
}

/**
 * Campaign Agent
 *
 * Uses structured templates for consistent, professional responses
 * with proper variable interpolation and action coordination.
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
      // Use structured template for navigation
      const template = Templates.navigateToAdCreation({
        adType: "new",
        merchant: "your business",
      });

      const response = templateToAIMessage(template);

      return {
        messages: [...messages, response],
        workflowData: {
          ...state.workflowData,
          actionToCall: "navigateToPageAndPerform",
          actionParams: {
            destination: "/campaign-manager/ads-create",
            intent: "create_ad",
            context: template.actions?.[0]?.parameters?.context || "{}",
            preActions: "",
            postActions: "",
          },
          followUpAction: "showPostResponseSuggestions",
          followUpParams: {
            context: "ad_creation",
          },
        },
      };
    }

    // If already on ad creation page, help with the form
    if (context.currentPage === "/campaign-manager/ads-create") {
      const requirements = extractAdRequirements(userInput);
      const nextStep = determineNextConversationStep(requirements);

      let template: ResponseTemplate;

      switch (nextStep) {
        case "ask_for_name":
        case "ask_for_merchant":
        case "ask_for_offer":
        case "ask_for_media_type":
        case "ask_for_costs":
        case "help":
          template = Templates.showAdHelp({
            availableMerchants: AVAILABLE_MERCHANTS.join(", "),
            currentProgress: generateProgressMessage(requirements, nextStep),
          });
          break;

        case "show_preview":
          if (
            requirements.adName &&
            requirements.merchant &&
            requirements.offer
          ) {
            template = Templates.showAdPreview({
              adName: requirements.adName,
              merchant: requirements.merchant,
              offer: requirements.offer,
              mediaType: requirements.mediaType?.join(", ") || "Image",
              costPerActivation: requirements.costPerActivation || 0.5,
              costPerRedemption: requirements.costPerRedemption || 2.0,
            });
          } else {
            template = Templates.showAdHelp({
              availableMerchants: AVAILABLE_MERCHANTS.join(", "),
              currentProgress: "Let's complete the missing details:",
            });
          }
          break;

        case "create_ad":
          return await handleAdCreation(requirements, messages);

        default:
          template = Templates.showAdHelp({
            availableMerchants: AVAILABLE_MERCHANTS.join(", "),
            currentProgress: "Let's start with the basics:",
          });
      }

      const response = templateToAIMessage(template);
      return { messages: [...messages, response] };
    }

    // General campaign assistance using template
    const template = Templates.showAdHelp({
      availableMerchants: AVAILABLE_MERCHANTS.join(", "),
      currentProgress:
        "What would you like to work on today? I can help you:\n\n• **Create new ads** - I'll guide you through the entire process\n• **Optimize campaigns** - Improve performance and targeting\n• **Manage existing ads** - Edit or update your current ads\n\nIf you'd like to create an ad, just let me know and I'll navigate you to the ad creation page!",
    });

    const response = templateToAIMessage(template);
    return {
      messages: [...messages, response],
    };
  }
);

// Helper function to generate progress message based on current step
function generateProgressMessage(
  requirements: AdRequirements,
  nextStep: string
): string {
  const completed: string[] = [];
  const remaining: string[] = [];

  if (requirements.adName) completed.push("✅ Ad Name");
  else remaining.push("📝 Ad Name");

  if (requirements.merchant) completed.push("✅ Merchant");
  else remaining.push("📝 Merchant");

  if (requirements.offer) completed.push("✅ Offer");
  else remaining.push("📝 Offer");

  if (requirements.mediaType) completed.push("✅ Media Type");
  else remaining.push("📝 Media Type");

  if (requirements.costPerActivation && requirements.costPerRedemption) {
    completed.push("✅ Costs");
  } else {
    remaining.push("📝 Costs");
  }

  let message = "";
  if (completed.length > 0) {
    message += `**Completed:** ${completed.join(", ")}\n\n`;
  }
  if (remaining.length > 0) {
    message += `**Still needed:** ${remaining.join(", ")}\n\n`;
  }

  // Add specific guidance based on next step
  switch (nextStep) {
    case "ask_for_name":
      message += "Let's start with naming your ad:";
      break;
    case "ask_for_merchant":
      message += "Great! Now let's choose the merchant:";
      break;
    case "ask_for_offer":
      message += "Perfect! What offer should we feature?";
      break;
    case "ask_for_media_type":
      message += "Excellent! What type of media will you use?";
      break;
    case "ask_for_costs":
      message += "Almost done! Let's set the costs:";
      break;
    default:
      message += "Let's continue building your ad:";
  }

  return message;
}

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
