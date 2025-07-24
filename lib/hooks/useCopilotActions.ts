/**
 * CopilotKit Actions Hook
 *
 * This centralizes all CopilotKit actions that the AI can call directly.
 * Based on the demo-banking pattern where frontend actions are registered
 * for direct AI interaction, not backend routing.
 */

import { useCopilotAction } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../redux/hooks";
import {
  setCurrentPage,
  addNotification,
  setActiveModal,
} from "../redux/slices/uiSlice";
import { addAd } from "../redux/slices/campaignSlice";

export function useCopilotActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Navigation Action - AI can call this directly
  useCopilotAction({
    name: "navigateToAdCreation",
    description:
      "Navigate user to the ad creation page and start the ad creation process",
    parameters: [
      {
        name: "adType",
        type: "string",
        description:
          "Type of ad to create (e.g., 'display', 'video', 'social')",
        required: false,
      },
    ],
    handler: async ({ adType = "display" }) => {
      console.log("[CopilotActions] 🚀 Navigating to ad creation:", adType);

      // Update Redux state
      dispatch(setCurrentPage("/campaign-manager/ads-create"));

      // Navigate using Next.js router
      router.push("/campaign-manager/ads-create");

      // Show helpful notification
      dispatch(
        addNotification({
          message: `Let's create your ${adType} ad! I'll guide you through each step.`,
          type: "info",
        })
      );

      return `Perfect! I've taken you to the ad creation page. Now I can help you build your ${adType} ad step by step. What would you like to name your ad?`;
    },
  });

  // Create Ad Action - AI can call this to actually create ads
  useCopilotAction({
    name: "createAd",
    description:
      "Create a new advertising campaign ad with the provided details",
    parameters: [
      {
        name: "adName",
        type: "string",
        description: "Name of the ad",
        required: true,
      },
      {
        name: "merchant",
        type: "string",
        description: "Merchant/business name for the ad",
        required: true,
      },
      {
        name: "offer",
        type: "string",
        description: "The promotional offer or deal",
        required: true,
      },
      {
        name: "mediaType",
        type: "string",
        description: "Type of media (image, video, both)",
        required: false,
      },
      {
        name: "costPerActivation",
        type: "number",
        description: "Cost per activation in dollars",
        required: false,
      },
      {
        name: "costPerRedemption",
        type: "number",
        description: "Cost per redemption in dollars",
        required: false,
      },
    ],
    handler: async ({
      adName,
      merchant,
      offer,
      mediaType = "image",
      costPerActivation = 0.5,
      costPerRedemption = 2.0,
    }) => {
      console.log("[CopilotActions] 📝 Creating ad:", {
        adName,
        merchant,
        offer,
      });

      // Create the ad object
      const newAd = {
        id: `ad_${Date.now()}`,
        name: adName,
        merchantId: "default",
        merchantName: merchant,
        offerId: "default",
        mediaType: [mediaType],
        mediaAssets: [],
        costPerActivation,
        costPerRedemption,
      };

      // Add to Redux store
      dispatch(addAd(newAd));

      // Show success notification
      dispatch(
        addNotification({
          message: `🎉 Successfully created "${adName}" for ${merchant}!`,
          type: "success",
        })
      );

      return `🎉 Excellent! I've successfully created your ad "${adName}" for ${merchant}!

**Ad Details:**
• **Name**: ${adName}
• **Merchant**: ${merchant}  
• **Offer**: ${offer}
• **Media Type**: ${mediaType}
• **Cost per Activation**: $${costPerActivation}
• **Cost per Redemption**: $${costPerRedemption}

Your ad is now ready and has been added to your campaigns. You can preview it, set targeting options, or launch it when ready!`;
    },
  });

  // Analytics Navigation Action
  useCopilotAction({
    name: "navigateToAnalytics",
    description:
      "Navigate user to the analytics dashboard to view campaign performance data",
    parameters: [],
    handler: async () => {
      console.log("[CopilotActions] 📊 Navigating to analytics");

      dispatch(setCurrentPage("/analytics"));
      router.push("/analytics");

      dispatch(
        addNotification({
          message: "Let's analyze your campaign performance!",
          type: "info",
        })
      );

      return "Perfect! I've taken you to the analytics dashboard where you can view your campaign performance, ROI metrics, and optimization opportunities. What specific metrics would you like to analyze?";
    },
  });

  // Filter Management Action
  useCopilotAction({
    name: "navigateToFilters",
    description:
      "Navigate user to product filters page to create or manage targeting filters",
    parameters: [],
    handler: async () => {
      console.log("[CopilotActions] 🎯 Navigating to filters");

      dispatch(setCurrentPage("/campaigns/product-filters"));
      router.push("/campaigns/product-filters");

      dispatch(
        addNotification({
          message: "Let's set up your product targeting filters!",
          type: "info",
        })
      );

      return "Great! I've taken you to the product filters page where you can create precise targeting criteria for your campaigns. What type of filter would you like to create?";
    },
  });

  // Human-in-the-Loop Approval Action
  useCopilotAction({
    name: "requestApproval",
    description:
      "Request user approval for important actions like budget changes or campaign launches",
    parameters: [
      {
        name: "actionType",
        type: "string",
        description:
          "Type of action requiring approval (campaign_launch, budget_change, ad_creation, etc.)",
        required: true,
      },
      {
        name: "details",
        type: "string",
        description: "Details about what needs approval",
        required: true,
      },
      {
        name: "amount",
        type: "number",
        description: "Dollar amount if this involves budget/costs",
        required: false,
      },
    ],
    handler: async ({ actionType, details, amount }) => {
      console.log("[CopilotActions] ✋ Requesting approval:", actionType);

      // Show approval modal
      dispatch(
        setActiveModal({
          type: "approval",
          data: {
            actionType,
            details,
            amount,
            timestamp: new Date().toISOString(),
          },
        })
      );

      let approvalMessage = `I need your approval for this ${actionType.replace("_", " ")}:\n\n${details}`;

      if (amount) {
        approvalMessage += `\n\n💰 **Amount**: $${amount}`;
      }

      approvalMessage +=
        "\n\nPlease review the details and let me know if you approve this action.";

      return approvalMessage;
    },
  });

  // Current Page Info Action
  useCopilotAction({
    name: "getCurrentPageInfo",
    description: "Get information about the current page the user is viewing",
    parameters: [],
    handler: async () => {
      const currentPath = window.location.pathname;

      const pageInfo = {
        "/": "Dashboard - Overview of your campaigns and key metrics",
        "/campaign-manager/ads-create":
          "Ad Creation Page - Build and configure new ads",
        "/analytics":
          "Analytics Dashboard - View performance data and insights",
        "/campaigns":
          "Campaign Manager - Manage all your advertising campaigns",
        "/campaigns/product-filters":
          "Product Filters - Create and manage targeting criteria",
      };

      const info = pageInfo[currentPath] || `${currentPath} - Current page`;

      return `You are currently on: ${info}. How can I help you with this page?`;
    },
  });
}
