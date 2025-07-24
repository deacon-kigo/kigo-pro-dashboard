/**
 * CopilotKit Navigation Hook
 *
 * This hook registers navigation actions with CopilotKit SDK
 * for intelligent, context-aware navigation throughout the app.
 */

import { useCallback } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setCurrentPage,
  addNotification,
  setActiveModal,
  highlightComponent,
} from "../redux/slices/uiSlice";
import { useRouter } from "next/navigation";

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
        return "I've navigated you to the ad creation page. Let's build your ad together!";
      case "view_analytics":
        return "Here's your analytics dashboard. What metrics would you like to explore?";
      case "manage_campaigns":
        return "Welcome to campaign management. How can I help you today?";
      case "edit_filters":
        return "Let's work on your filters. What changes would you like to make?";
      default:
        return `I've brought you to ${destination.replace("/", "").replace("-", " ")}. What would you like to do here?`;
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
      await navigateWithIntent({
        destination,
        intent,
        context,
        preActions: preActions
          ? preActions.split(",").map((s) => s.trim())
          : [],
        postActions: postActions
          ? postActions.split(",").map((s) => s.trim())
          : [],
      });

      return `Successfully navigated to ${destination} for ${intent}. ${getIntentMessage(intent, destination)}`;
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
}
