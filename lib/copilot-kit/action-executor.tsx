"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../redux/hooks";
import {
  setCurrentPage,
  addNotification,
  setActiveModal,
} from "../redux/slices/uiSlice";
import { addAd } from "../redux/slices/campaignSlice";

interface LangGraphAction {
  action_name: string;
  parameters: Record<string, any>;
  description?: string;
}

/**
 * Frontend Action Executor
 *
 * This component executes actions returned by the Python LangGraph backend.
 * Since CopilotKit actions are disabled, we handle execution directly here.
 */
function ActionExecutor() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Listen for actions from the Python backend
    const executeAction = (action: LangGraphAction) => {
      console.log(
        "[ActionExecutor] 🎯 Executing action from Python backend:",
        action
      );

      switch (action.action_name) {
        case "navigateToAdCreation":
          handleNavigateToAdCreation(action.parameters as { adType?: string });
          break;

        case "navigateToAnalytics":
          handleNavigateToAnalytics();
          break;

        case "createAd":
          handleCreateAd(
            action.parameters as {
              adName: string;
              merchant: string;
              offer: string;
              mediaType?: string;
              costPerActivation?: number;
              costPerRedemption?: number;
            }
          );
          break;

        case "requestApproval":
          handleRequestApproval(
            action.parameters as {
              actionType: string;
              details: string;
              amount?: number;
            }
          );
          break;

        case "getCurrentPageInfo":
          handleGetCurrentPageInfo();
          break;

        default:
          console.warn(
            "[ActionExecutor] ⚠️ Unknown action:",
            action.action_name
          );
      }
    };

    // Check for queued actions from the API route
    const checkForQueuedActions = () => {
      if (typeof window !== "undefined" && (global as any).queuedActions) {
        const actions = (global as any).queuedActions;
        console.log("[ActionExecutor] 📋 Found queued actions:", actions);

        actions.forEach((actionResult: any) => {
          if (actionResult.executeOnFrontend && actionResult.action) {
            executeAction(actionResult.action);
          }
        });

        // Clear the queue
        delete (global as any).queuedActions;
      }
    };

    // Check immediately and then poll
    checkForQueuedActions();
    const interval = setInterval(checkForQueuedActions, 500);

    return () => clearInterval(interval);
  }, [router, dispatch]);

  // Action Handlers - Same logic as the original frontend actions

  const handleNavigateToAdCreation = (params: { adType?: string }) => {
    const adType = params.adType || "display";

    console.log("[ActionExecutor] 🚀 Navigating to ad creation:", adType);

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
  };

  const handleNavigateToAnalytics = () => {
    console.log("[ActionExecutor] 📊 Navigating to analytics");

    dispatch(setCurrentPage("/analytics"));
    router.push("/analytics");

    dispatch(
      addNotification({
        message: "Let's analyze your campaign performance!",
        type: "info",
      })
    );
  };

  const handleCreateAd = (params: {
    adName: string;
    merchant: string;
    offer: string;
    mediaType?: string;
    costPerActivation?: number;
    costPerRedemption?: number;
  }) => {
    console.log("[ActionExecutor] 📝 Creating ad:", params);

    const {
      adName,
      merchant,
      offer,
      mediaType = "image",
      costPerActivation = 0.5,
      costPerRedemption = 2.0,
    } = params;

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
  };

  const handleRequestApproval = (params: {
    actionType: string;
    details: string;
    amount?: number;
  }) => {
    console.log("[ActionExecutor] ✋ Requesting approval:", params);

    const { actionType, details, amount } = params;

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
  };

  const handleGetCurrentPageInfo = () => {
    const currentPath = window.location.pathname;
    console.log(
      "[ActionExecutor] 📍 Current page info requested:",
      currentPath
    );

    // This action is typically used for context, so we'll just log it
    // The Python backend already has access to this info via context
  };

  // This component doesn't render anything
  return null;
}

export default ActionExecutor;
