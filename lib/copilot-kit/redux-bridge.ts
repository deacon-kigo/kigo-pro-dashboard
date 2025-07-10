"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { RootState } from "../redux/store";
import {
  updateBasicInfo,
  updateBudget,
  updateTargeting,
  addAd,
  updateAd,
  applyCampaignUpdate,
} from "../redux/slices/campaignSlice";

/**
 * Redux-CopilotKit Bridge Hook
 *
 * This hook creates a bidirectional bridge between Redux state and CopilotKit:
 * - Makes Redux state readable by CopilotKit agents
 * - Provides CopilotKit actions that dispatch Redux actions
 * - Maintains Redux as the single source of truth
 */
export function useCopilotReduxBridge() {
  const dispatch = useDispatch();

  // Get current Redux state
  const campaignState = useSelector((state: RootState) => state.campaign);
  const userState = useSelector((state: RootState) => state.user);
  const uiState = useSelector((state: RootState) => state.ui);
  const demoState = useSelector((state: RootState) => state.demo);

  // Make Redux state readable by CopilotKit
  useCopilotReadable({
    description: "Current campaign creation state and form data",
    value: {
      campaign: {
        currentStep: campaignState.currentStep,
        formData: campaignState.formData,
        stepValidation: campaignState.stepValidation,
        isGenerating: campaignState.isGenerating,
      },
      user: {
        role: userState.role,
        currentDemo: demoState.currentDemo,
        context: userState.context,
      },
      ui: {
        currentPage: uiState.currentPage,
        chatOpen: uiState.chatOpen,
      },
    },
  });

  // CopilotKit Action: Create Campaign
  useCopilotAction({
    name: "createCampaign",
    description: "Create a new advertising campaign with the provided details",
    parameters: [
      {
        name: "campaignName",
        type: "string",
        description: "The name of the campaign (max 50 characters)",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Campaign description (max 100 characters)",
        required: true,
      },
      {
        name: "budget",
        type: "number",
        description: "Maximum budget for the campaign in USD",
        required: true,
      },
      {
        name: "startDate",
        type: "string",
        description: "Campaign start date in YYYY-MM-DD format",
        required: true,
      },
      {
        name: "endDate",
        type: "string",
        description: "Campaign end date in YYYY-MM-DD format",
        required: true,
      },
      {
        name: "mediaTypes",
        type: "array",
        description:
          "Array of media types (e.g., ['display', 'social', 'video'])",
        required: false,
      },
      {
        name: "targetAudience",
        type: "object",
        description:
          "Targeting parameters including demographics, location, etc.",
        required: false,
      },
    ],
    handler: async (params) => {
      try {
        // Dispatch Redux actions to update campaign state
        dispatch(
          updateBasicInfo({
            name: params.campaignName,
            description: params.description,
            startDate: params.startDate,
            endDate: params.endDate,
            campaignType: "Advertising",
          })
        );

        dispatch(
          updateBudget({
            maxBudget: params.budget,
          })
        );

        if (params.targetAudience) {
          dispatch(updateTargeting(params.targetAudience));
        }

        // If media types are provided, create initial ad
        if (params.mediaTypes && params.mediaTypes.length > 0) {
          dispatch(
            addAd({
              id: `ad-${Date.now()}`,
              name: `${params.campaignName} - Primary Ad`,
              mediaTypes: params.mediaTypes,
              assets: [],
              costPerActivation: 0,
              costPerRedemption: 0,
            })
          );
        }

        // Apply campaign update for analytics
        dispatch(
          applyCampaignUpdate({
            type: "ai_creation",
            timestamp: new Date().toISOString(),
            data: params,
          })
        );

        return {
          success: true,
          message: `Campaign "${params.campaignName}" created successfully! Budget: $${params.budget}, Duration: ${params.startDate} to ${params.endDate}`,
          campaignId: `campaign-${Date.now()}`,
          nextSteps: [
            "Review campaign details",
            "Add creative assets",
            "Configure targeting",
            "Launch campaign",
          ],
        };
      } catch (error) {
        console.error("Error creating campaign:", error);
        return {
          success: false,
          message: "Failed to create campaign. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });

  // CopilotKit Action: Update Campaign
  useCopilotAction({
    name: "updateCampaign",
    description: "Update an existing campaign with new information",
    parameters: [
      {
        name: "updates",
        type: "object",
        description: "Object containing the fields to update",
        required: true,
      },
    ],
    handler: async (params) => {
      try {
        const { updates } = params;

        // Apply updates based on the type of information
        if (updates.basicInfo) {
          dispatch(updateBasicInfo(updates.basicInfo));
        }

        if (updates.budget) {
          dispatch(updateBudget(updates.budget));
        }

        if (updates.targeting) {
          dispatch(updateTargeting(updates.targeting));
        }

        return {
          success: true,
          message: "Campaign updated successfully!",
          updatedFields: Object.keys(updates),
        };
      } catch (error) {
        console.error("Error updating campaign:", error);
        return {
          success: false,
          message: "Failed to update campaign. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  });

  // CopilotKit Action: Get Campaign Analytics
  useCopilotAction({
    name: "getCampaignAnalytics",
    description: "Get analytics and insights for the current campaign",
    parameters: [],
    handler: async () => {
      const currentCampaign = campaignState.formData;

      return {
        campaign: {
          name: currentCampaign.basicInfo?.name || "Untitled Campaign",
          status: campaignState.currentStep < 5 ? "Draft" : "Ready to Launch",
          budget: currentCampaign.budget?.maxBudget || 0,
          ads: currentCampaign.ads?.length || 0,
          completionPercentage: Math.round(
            (campaignState.currentStep / 5) * 100
          ),
        },
        recommendations: [
          "Consider A/B testing different ad variations",
          "Review targeting parameters for optimal reach",
          "Set up conversion tracking for better ROI measurement",
        ],
        nextSteps:
          campaignState.currentStep < 5
            ? [
                "Complete campaign setup",
                "Add creative assets",
                "Launch campaign",
              ]
            : [
                "Launch campaign",
                "Monitor performance",
                "Optimize based on results",
              ],
      };
    },
  });

  return {
    // Expose current state for components that need it
    campaignState,
    userState,
    uiState,
    demoState,
  };
}
