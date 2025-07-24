import { AIMessage } from "@langchain/core/messages";
import {
  createTracedFunction,
  logAgentInteraction,
} from "../../lib/copilot-kit/langsmith-config";
import { KigoProAgentState } from "./supervisor";
import { store } from "../../lib/redux/store";
import { addAd, updateBasicInfo } from "../../lib/redux/slices/campaignSlice";
import {
  setCurrentPage,
  addNotification,
  highlightComponent,
  setLoading,
} from "../../lib/redux/slices/uiSlice";

/**
 * Campaign Agent
 *
 * Specialized agent for ad creation through conversational interface.
 * Handles requirements capture, image uploads, form pre-filling, and navigation.
 */

interface AdRequirements {
  adName?: string;
  merchantId?: string;
  merchantName?: string;
  offerId?: string;
  offerName?: string;
  mediaTypes?: string[];
  mediaAssets?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    mediaType: string;
  }>;
  costPerActivation?: number;
  costPerRedemption?: number;
  collectionStatus?: "complete" | "partial" | "started";
}

// Mock data for merchants and offers (would come from API in real app)
const MOCK_MERCHANTS = [
  { id: "m1", name: "Starbucks Coffee", dba: "Starbucks" },
  { id: "m2", name: "McDonald's Corporation", dba: "McDonald's" },
  { id: "m3", name: "Target Corporation", dba: "Target" },
  { id: "m4", name: "Best Buy Co., Inc.", dba: "Best Buy" },
  { id: "m5", name: "Nike, Inc.", dba: "Nike" },
];

const MOCK_OFFERS = {
  m1: [
    {
      id: "mcm_o1_2023",
      name: "Buy one get one free coffee",
      shortText: "BOGO Coffee",
    },
    { id: "mcm_o2_2023", name: "$5 off orders $20+", shortText: "$5 off $20+" },
  ],
  m2: [
    {
      id: "mcm_o3_2023",
      name: "Free fries with any burger",
      shortText: "Free Fries",
    },
    {
      id: "mcm_o4_2023",
      name: "20% off Happy Meals",
      shortText: "20% off Happy Meals",
    },
  ],
  m3: [
    {
      id: "mcm_o5_2023",
      name: "15% off clothing",
      shortText: "15% off Clothing",
    },
    {
      id: "mcm_o6_2023",
      name: "Free shipping on $35+",
      shortText: "Free Shipping",
    },
  ],
  m4: [
    {
      id: "mcm_o7_2023",
      name: "$100 off laptops",
      shortText: "$100 off Laptops",
    },
    {
      id: "mcm_o8_2023",
      name: "Extended warranty included",
      shortText: "Extended Warranty",
    },
  ],
  m5: [
    {
      id: "mcm_o9_2023",
      name: "Buy 2 get 1 free shoes",
      shortText: "B2G1 Shoes",
    },
    {
      id: "mcm_o10_2023",
      name: "Free Nike+ membership",
      shortText: "Free Nike+",
    },
  ],
};

const MEDIA_TYPES = [
  {
    id: "display_banner",
    label: "Display Banner",
    dimensions: "728x90",
    requiresAsset: true,
  },
  {
    id: "double_decker",
    label: "Double Decker",
    dimensions: "728x180",
    requiresAsset: true,
  },
  {
    id: "native",
    label: "Native (Text Only)",
    dimensions: "Text Only",
    requiresAsset: false,
  },
];

/**
 * Main Campaign Agent Function
 */
const campaignAgent = createTracedFunction(
  "campaign_agent",
  async (state: KigoProAgentState): Promise<Partial<KigoProAgentState>> => {
    const { messages, workflowData, context } = state;
    const latestMessage = messages[messages.length - 1];
    const userInput = latestMessage.content as string;

    try {
      // Extract or initialize ad requirements from workflow data
      const adRequirements: AdRequirements = workflowData.adRequirements || {
        collectionStatus: "started",
      };

      // Analyze what information we need to collect
      const analysisResult = await analyzeUserInputForAdCreation(
        userInput,
        adRequirements
      );

      // Update requirements based on analysis
      const updatedRequirements = {
        ...adRequirements,
        ...analysisResult.extractedData,
      };

      // Determine next step in the conversation
      const conversationFlow =
        determineNextConversationStep(updatedRequirements);

      let response: AIMessage;

      if (conversationFlow.action === "ask_questions") {
        response = await generateQuestionResponse(
          conversationFlow.questions || [],
          updatedRequirements
        );
      } else if (conversationFlow.action === "show_preview") {
        response = await generatePreviewResponse(updatedRequirements);
      } else if (conversationFlow.action === "create_ad") {
        response = await handleAdCreation(updatedRequirements);
      } else {
        response = await generateHelpResponse();
      }

      // Log interaction for observability
      logAgentInteraction(
        "campaign_agent",
        { userInput, currentRequirements: adRequirements },
        {
          response: response.content,
          updatedRequirements,
          nextAction: conversationFlow.action,
        },
        {
          step: conversationFlow.action,
          completeness: calculateCompleteness(updatedRequirements),
        }
      );

      return {
        messages: [...messages, response],
        workflowData: {
          ...workflowData,
          adRequirements: updatedRequirements,
          conversationFlow,
        },
      };
    } catch (error) {
      console.error("Campaign agent error:", error);

      const errorResponse = new AIMessage({
        content: `I apologize, but I encountered an error while processing your ad creation request. Let me help you start over.

What type of ad would you like to create? I can help you with:
• Display Banner ads
• Double Decker ads  
• Native text ads

Just tell me what you have in mind!`,
      });

      return {
        messages: [...messages, errorResponse],
        workflowData: {
          ...workflowData,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
);

/**
 * Analyze user input to extract ad creation information
 */
async function analyzeUserInputForAdCreation(
  userInput: string,
  currentRequirements: AdRequirements
): Promise<{ extractedData: Partial<AdRequirements>; confidence: number }> {
  const input = userInput.toLowerCase();
  const extractedData: Partial<AdRequirements> = {};

  // Extract ad name
  const adNamePatterns = [
    /(?:ad|campaign) (?:name|called|named) (?:is |would be )?["""]?([^"""]+)["""]?/i,
    /(?:call|name) (?:it|this|the ad) ["""]?([^"""]+)["""]?/i,
    /["""]([^"""]+)["""] (?:ad|campaign)/i,
  ];

  for (const pattern of adNamePatterns) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      extractedData.adName = match[1].trim();
      break;
    }
  }

  // Extract merchant information
  const mentionedMerchants = MOCK_MERCHANTS.filter(
    (merchant) =>
      input.includes(merchant.name.toLowerCase()) ||
      input.includes(merchant.dba.toLowerCase())
  );

  if (mentionedMerchants.length === 1) {
    extractedData.merchantId = mentionedMerchants[0].id;
    extractedData.merchantName = mentionedMerchants[0].dba;
  }

  // Extract media type preferences
  if (input.includes("banner") && !input.includes("double")) {
    extractedData.mediaTypes = ["display_banner"];
  } else if (
    input.includes("double decker") ||
    input.includes("double-decker")
  ) {
    extractedData.mediaTypes = ["double_decker"];
  } else if (input.includes("text") || input.includes("native")) {
    extractedData.mediaTypes = ["native"];
  } else if (input.includes("image") || input.includes("visual")) {
    extractedData.mediaTypes = ["display_banner", "double_decker"];
  }

  // Extract budget/cost information
  const budgetMatch = userInput.match(/\$?(\d+(?:\.\d{2})?)/);
  if (budgetMatch) {
    const amount = parseFloat(budgetMatch[1]);
    if (input.includes("activation") || input.includes("click")) {
      extractedData.costPerActivation = amount;
    } else if (input.includes("redemption") || input.includes("conversion")) {
      extractedData.costPerRedemption = amount;
    }
  }

  return {
    extractedData,
    confidence: Object.keys(extractedData).length > 0 ? 0.8 : 0.3,
  };
}

/**
 * Determine what questions to ask next
 */
function determineNextConversationStep(requirements: AdRequirements): {
  action: "ask_questions" | "show_preview" | "create_ad" | "help";
  questions?: string[];
  missingFields?: string[];
} {
  const missingFields: string[] = [];

  if (!requirements.adName) missingFields.push("adName");
  if (!requirements.merchantId) missingFields.push("merchantId");
  if (!requirements.offerId) missingFields.push("offerId");
  if (!requirements.mediaTypes || requirements.mediaTypes.length === 0)
    missingFields.push("mediaTypes");
  if (!requirements.costPerActivation) missingFields.push("costPerActivation");
  if (!requirements.costPerRedemption) missingFields.push("costPerRedemption");

  // Check if media assets are needed
  const needsAssets =
    requirements.mediaTypes?.some(
      (type) => MEDIA_TYPES.find((mt) => mt.id === type)?.requiresAsset
    ) || false;

  if (
    needsAssets &&
    (!requirements.mediaAssets || requirements.mediaAssets.length === 0)
  ) {
    missingFields.push("mediaAssets");
  }

  if (missingFields.length === 0) {
    return { action: "show_preview" };
  }

  if (missingFields.length <= 2) {
    return {
      action: "ask_questions",
      questions: generateQuestionsForFields(missingFields),
      missingFields,
    };
  }

  return {
    action: "ask_questions",
    questions: generateQuestionsForFields(missingFields.slice(0, 2)),
    missingFields,
  };
}

/**
 * Generate specific questions for missing fields
 */
function generateQuestionsForFields(fields: string[]): string[] {
  const questionMap: Record<string, string> = {
    adName: "What would you like to name this ad?",
    merchantId: `Which merchant is this ad for? I can help with: ${MOCK_MERCHANTS.map((m) => m.dba).join(", ")}`,
    offerId: "Which specific offer would you like to promote?",
    mediaTypes:
      "What type of ad format would you prefer?\n• **Display Banner** (728x90) - Standard banner with image\n• **Double Decker** (728x180) - Larger banner with more space\n• **Native** - Text-only ad that blends with content",
    costPerActivation:
      "What would you like to pay per click/activation? (e.g., $2.50)",
    costPerRedemption:
      "What would you like to pay per redemption/conversion? (e.g., $5.00)",
    mediaAssets:
      "I'll need you to upload an image for your banner ad. Please upload your creative asset when you're ready.",
  };

  return fields.map((field) => questionMap[field] || `Please provide ${field}`);
}

/**
 * Generate response with questions
 */
async function generateQuestionResponse(
  questions: string[],
  requirements: AdRequirements
): Promise<AIMessage> {
  const progress = calculateCompleteness(requirements);
  const progressBar =
    "▓".repeat(Math.floor(progress * 10)) +
    "░".repeat(10 - Math.floor(progress * 10));

  let content = `🎯 **Creating Your Ad** (${Math.round(progress * 100)}% complete)\n${progressBar}\n\n`;

  if (questions.length === 1) {
    content += questions[0];
  } else {
    content += "I need a few more details:\n\n";
    questions.forEach((question, index) => {
      content += `${index + 1}. ${question}\n`;
    });
  }

  // Add context about current requirements
  if (requirements.adName) {
    content += `\n📝 **Ad Name:** ${requirements.adName}`;
  }
  if (requirements.merchantName) {
    content += `\n🏪 **Merchant:** ${requirements.merchantName}`;
  }
  if (requirements.mediaTypes && requirements.mediaTypes.length > 0) {
    content += `\n🎨 **Format:** ${requirements.mediaTypes
      .map((type) => MEDIA_TYPES.find((mt) => mt.id === type)?.label)
      .join(", ")}`;
  }

  return new AIMessage({ content });
}

/**
 * Generate preview response when all requirements are collected
 */
async function generatePreviewResponse(
  requirements: AdRequirements
): Promise<AIMessage> {
  const merchant = MOCK_MERCHANTS.find((m) => m.id === requirements.merchantId);
  const offers =
    MOCK_OFFERS[requirements.merchantId as keyof typeof MOCK_OFFERS] || [];
  const offer = offers.find((o) => o.id === requirements.offerId);

  const content = `🎉 **Perfect! Your ad is ready to create:**

📱 **Ad Details:**
• **Name:** ${requirements.adName}
• **Merchant:** ${merchant?.dba}
• **Offer:** ${offer?.name || "Selected offer"}
• **Format:** ${requirements.mediaTypes
    ?.map((type) => MEDIA_TYPES.find((mt) => mt.id === type)?.label)
    .join(", ")}
• **Cost per Activation:** $${requirements.costPerActivation}
• **Cost per Redemption:** $${requirements.costPerRedemption}

🚀 **Next Steps:**
Would you like me to:
1. **Create this ad now** - I'll navigate you to the ad creation page and fill everything out
2. **Make changes** - Modify any details before creating
3. **Start over** - Begin with a different ad

Just let me know what you'd prefer!`;

  return new AIMessage({ content });
}

/**
 * Handle the actual ad creation process
 */
async function handleAdCreation(
  requirements: AdRequirements
): Promise<AIMessage> {
  try {
    // Dispatch loading state
    store.dispatch(
      setLoading({ isLoading: true, message: "Creating your ad..." })
    );

    // Create the ad object
    const newAd = {
      id: `ad_${Date.now()}`,
      name: requirements.adName!,
      merchantId: requirements.merchantId!,
      merchantName: requirements.merchantName!,
      offerId: requirements.offerId!,
      mediaType: requirements.mediaTypes!,
      mediaAssets: (requirements.mediaAssets || []).map((asset) => ({
        ...asset,
        previewUrl: asset.url, // Add missing previewUrl field
      })),
      costPerActivation: requirements.costPerActivation!,
      costPerRedemption: requirements.costPerRedemption!,
    };

    // Add to Redux store
    store.dispatch(addAd(newAd));

    // Show success notification
    store.dispatch(
      addNotification({
        message: `Ad "${requirements.adName}" created successfully!`,
        type: "success",
      })
    );

    // Navigate to ad creation page with pre-filled form
    setTimeout(() => {
      store.dispatch(setCurrentPage("/ads/create"));
      store.dispatch(highlightComponent("ad-form"));
      store.dispatch(setLoading({ isLoading: false, message: "" }));
    }, 1500);

    return new AIMessage({
      content: `🎉 **Success!** 

I've created your ad "${requirements.adName}" and I'm taking you to the ad creation page where everything will be pre-filled for you.

You'll be able to review all the details and make any final adjustments before publishing.

*Navigating to ad creation page...*`,
    });
  } catch (error) {
    store.dispatch(setLoading({ isLoading: false, message: "" }));
    console.error("Error creating ad:", error);

    return new AIMessage({
      content: `❌ I encountered an error while creating your ad. Please try again or let me know if you'd like to start over.`,
    });
  }
}

/**
 * Generate help response
 */
async function generateHelpResponse(): Promise<AIMessage> {
  return new AIMessage({
    content: `👋 **I'm here to help you create ads!**

I can guide you through creating:
• **Display Banner ads** (728x90 with images)
• **Double Decker ads** (728x180 with images)  
• **Native ads** (text-only)

Just tell me:
• What type of ad you want
• Which merchant it's for
• Any other details you have in mind

I'll ask you questions to gather everything we need and then create the ad for you!

**Example:** "I want to create a banner ad for Starbucks promoting their coffee deal"`,
  });
}

/**
 * Calculate completeness percentage
 */
function calculateCompleteness(requirements: AdRequirements): number {
  const requiredFields = [
    "adName",
    "merchantId",
    "offerId",
    "mediaTypes",
    "costPerActivation",
    "costPerRedemption",
  ];
  const completedFields = requiredFields.filter((field) => {
    const value = requirements[field as keyof AdRequirements];
    return value !== undefined && value !== null && value !== "";
  });

  // Check media assets if required
  const needsAssets = requirements.mediaTypes?.some(
    (type) => MEDIA_TYPES.find((mt) => mt.id === type)?.requiresAsset
  );

  if (needsAssets) {
    requiredFields.push("mediaAssets");
    if (requirements.mediaAssets && requirements.mediaAssets.length > 0) {
      completedFields.push("mediaAssets");
    }
  }

  return completedFields.length / requiredFields.length;
}

export default campaignAgent;
