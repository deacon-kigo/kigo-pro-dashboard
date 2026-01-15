/**
 * CopilotKit Navigation Hook
 *
 * This hook registers navigation actions with CopilotKit SDK
 * for intelligent, context-aware navigation throughout the app.
 */

import { useCallback } from "react";
import { useCopilotAction, useCopilotChat } from "@/lib/copilot-stubs";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setCurrentPage,
  addNotification,
  setActiveModal,
  highlightComponent,
} from "../redux/slices/uiSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { NavigationConfirmation } from "../../components/ui/NavigationConfirmation";
import { PostResponseSuggestions } from "../../components/ui/PostResponseSuggestions";

// Intent-based navigation interface
interface NavigationIntent {
  destination: string;
  intent: string;
  context?: Record<string, any>;
  preActions?: string[];
  postActions?: string[];
}

export function useCopilotNavigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentPage = useAppSelector((state) => state.ui.currentPage);
  const { appendMessage } = useCopilotChat();

  // Intent-based navigation function
  const navigateWithIntent = useCallback(
    async (navIntent: NavigationIntent) => {
      const {
        destination,
        intent,
        context = {},
        preActions = [],
        postActions = [],
      } = navIntent;

      console.log("[CopilotNavigation] 🎯 Intent-based navigation:", navIntent);

      // Execute pre-actions before navigation
      for (const action of preActions) {
        await executeAction(action, context);
      }

      // Perform navigation
      console.log("[CopilotNavigation] ✅ Navigating to:", destination);
      dispatch(setCurrentPage(destination));
      router.push(destination);

      // Execute post-actions after navigation
      setTimeout(async () => {
        for (const action of postActions) {
          await executeAction(action, context);
        }
      }, 100); // Small delay to ensure navigation completes

      // Show contextual notification
      dispatch(
        addNotification({
          message: getIntentMessage(intent, destination),
          type: "info",
        })
      );
    },
    [dispatch, router]
  );

  // Execute specific actions based on type
  const executeAction = async (
    action: string,
    context: Record<string, any>
  ) => {
    console.log("[CopilotNavigation] 🔧 Executing action:", action, context);

    switch (action) {
      case "populateForm":
        if (context.formData) {
          // TODO: Dispatch form population action
          console.log(
            "[CopilotNavigation] 📝 Form population requested:",
            context.formData
          );
        }
        break;

      case "showGuidance":
        dispatch(
          setActiveModal({
            type: "guidance",
            data: {
              title: "Getting Started",
              content:
                context.guidanceMessage ||
                "Let me help you get started with this task.",
            },
          })
        );
        break;

      case "highlightField":
        if (context.fieldId) {
          dispatch(highlightComponent(context.fieldId));
        }
        break;

      case "openModal":
        if (context.modalType) {
          dispatch(
            setActiveModal({
              type: context.modalType,
              data: context.modalData || {},
            })
          );
        }
        break;

      default:
        console.log("[CopilotNavigation] ⚠️ Unknown action:", action);
    }
  };

  // Get contextual message for different intents
  const getIntentMessage = (intent: string, destination: string) => {
    switch (intent) {
      case "create_ad":
        return "I'll help you build your ad step by step with AI-powered suggestions.";
      case "view_analytics":
        return "Let's explore your campaign performance and key metrics.";
      case "manage_campaigns":
        return "You can view, edit, and optimize your campaigns here.";
      case "edit_filters":
        return "I'll help you create and manage product filters.";
      default:
        return `Navigate to ${destination.replace("/", "").replace("-", " ")} to continue.`;
    }
  };

  // Get friendly page titles
  const getPageTitle = (destination: string) => {
    const titles: Record<string, string> = {
      "/campaign-manager/ads-create": "Ad Creation Page",
      "/analytics": "Analytics Dashboard",
      "/campaigns": "Campaign Manager",
      "/filters": "Product Filters",
      "/dashboard": "Dashboard",
    };
    return titles[destination] || destination;
  };

  // Get navigation guidance
  const getNavigationGuidance = (intent: string, destination: string) => {
    switch (intent) {
      case "create_ad":
        return "I'll guide you through the ad creation process and suggest optimizations.";
      case "view_analytics":
        return "I can help you interpret data and find optimization opportunities.";
      case "manage_campaigns":
        return "I can help you manage and optimize your campaign performance.";
      case "edit_filters":
        return "I'll help you create precise targeting filters for your campaigns.";
      default:
        return "I'll provide contextual assistance on this page.";
    }
  };

  // Register CopilotKit action for intent-based navigation
  useCopilotAction({
    name: "navigateToPageAndPerform",
    description:
      "Navigate to a specific page with context and perform related actions. Use this when users request to go somewhere and do something specific like creating ads, viewing analytics, or managing campaigns.",
    parameters: [
      {
        name: "destination",
        type: "string",
        description:
          "The page path to navigate to (e.g., '/campaign-manager/ads-create', '/analytics', '/campaigns')",
        required: true,
      },
      {
        name: "intent",
        type: "string",
        description:
          "The user's intent (e.g., 'create_ad', 'view_analytics', 'manage_campaigns', 'edit_filters')",
        required: true,
      },
      {
        name: "context",
        type: "object",
        description:
          "Additional context data like form values, IDs, or configuration",
        required: false,
      },
      {
        name: "preActions",
        type: "string",
        description:
          "Comma-separated actions to perform before navigation (e.g., 'populateForm,showGuidance')",
        required: false,
      },
      {
        name: "postActions",
        type: "string",
        description:
          "Comma-separated actions to perform after navigation (e.g., 'highlightField,openModal')",
        required: false,
      },
    ],
    handler: async ({
      destination,
      intent,
      context = {},
      preActions = "",
      postActions = "",
    }) => {
      console.log("[CopilotNavigation] 🎯 Navigation requested:", {
        destination,
        intent,
      });

      const navIntent: NavigationIntent = {
        destination,
        intent,
        context,
        preActions: preActions
          ? preActions.split(",").map((s) => s.trim())
          : [],
        postActions: postActions
          ? postActions.split(",").map((s) => s.trim())
          : [],
      };

      // Create navigation confirmation handlers
      const confirmNavigation = () => {
        navigateWithIntent(navIntent);

        // Show post-navigation suggestions
        // TODO: Implement post-navigation suggestions in chat
        console.log(
          "[CopilotNavigation] ✅ Navigation completed, showing suggestions"
        );
      };

      const cancelNavigation = () => {
        dispatch(
          addNotification({
            message: "Navigation cancelled",
            type: "info",
          })
        );
      };

      // For now, just navigate directly (TODO: Implement generative UI confirmation)
      await navigateWithIntent(navIntent);

      return `I'd like to take you to the ${getPageTitle(destination)}. ${getIntentMessage(intent, destination)}`;
    },
  });

  // Register additional helpful actions
  useCopilotAction({
    name: "showCurrentPageInfo",
    description: "Get information about the current page and available actions",
    parameters: [],
    handler: async () => {
      return `You are currently on: ${currentPage || "unknown page"}. This page offers various features and actions you can perform. What would you like to do here?`;
    },
  });

  // Register action for showing post-response suggestions
  useCopilotAction({
    name: "showPostResponseSuggestions",
    description: "Show contextual suggestion pills after responding to user",
    parameters: [
      {
        name: "context",
        type: "string",
        description:
          "Context about what was just discussed (ad_creation, analytics, navigation, etc.)",
        required: true,
      },
      {
        name: "customSuggestions",
        type: "string",
        description: "Optional JSON array of custom suggestions",
        required: false,
      },
    ],
    handler: async ({ context, customSuggestions = "[]" }) => {
      console.log(
        "[CopilotNavigation] 💊 Showing post-response suggestions for:",
        context
      );

      // Parse custom suggestions if provided
      let suggestions = [];
      try {
        suggestions = JSON.parse(customSuggestions);
      } catch (e) {
        console.warn("Failed to parse custom suggestions");
      }

      // Generate context-appropriate suggestions
      const contextMap: Record<string, string[]> = {
        ad_creation: ["Upload creative assets", "Preview ad", "Set budget"],
        analytics: ["Export data", "Create alert", "Schedule report"],
        navigation: ["Get help", "Show tutorials", "Quick actions"],
        campaign: [
          "Optimize targeting",
          "Duplicate campaign",
          "View performance",
        ],
      };

      const suggestionTexts =
        suggestions.length > 0
          ? suggestions.map((s: any) => s.title || s)
          : contextMap[context] || ["Get help", "Show suggestions"];

      return `Here are some quick actions you might want to try:\n\n${suggestionTexts.map((s) => `• ${s}`).join("\n")}\n\nJust tell me what you'd like to do!`;
    },
  });
}
