"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotActions } from "../hooks/useCopilotActions";
import { useAppSelector } from "../redux/hooks";
import { ApprovalWorkflowUI } from "../../components/ui/ApprovalWorkflowUI";

interface CopilotKitProviderProps {
  children: ReactNode;
}

// Navigation Bridge - Registers all CopilotKit actions and provides context
function NavigationBridge() {
  const pathname = usePathname();
  const uiState = useAppSelector((state) => state.ui);
  const campaignState = useAppSelector((state) => state.campaign);

  console.log("[NavigationBridge] 🚀 Current context:", {
    pathname,
    isLoading: uiState.isLoading,
    hasAds: campaignState.formData?.ads?.length || 0,
  });

  // Register all CopilotKit actions
  useCopilotActions();

  // Provide comprehensive context to CopilotKit
  useCopilotReadable({
    description:
      "Complete application state and user context for intelligent assistance",
    value: {
      currentPage: pathname,
      userRole: "admin",
      isLoading: uiState.isLoading,
      notifications: uiState.notifications || [],
      activeModal: uiState.activeModal,

      // Campaign data
      campaignData: {
        currentStep: campaignState.currentStep,
        ads: campaignState.formData?.ads || [],
        budget: campaignState.formData?.budget,
        basicInfo: campaignState.formData?.basicInfo,
      },

      // Available actions based on current page
      availableActions: getAvailableActions(pathname),

      // Page-specific context
      pageContext: getPageContext(pathname),
    },
  });

  return <ApprovalWorkflowUI />;
}

// Get available actions based on current page
function getAvailableActions(currentPath: string) {
  switch (currentPath) {
    case "/":
      return [
        "navigateToAdCreation",
        "navigateToAnalytics",
        "navigateToFilters",
      ];
    case "/campaign-manager/ads-create":
      return ["createAd", "getCurrentPageInfo"];
    case "/analytics":
      return ["getCurrentPageInfo"];
    case "/campaigns/product-filters":
      return ["getCurrentPageInfo"];
    default:
      return [
        "navigateToAdCreation",
        "navigateToAnalytics",
        "getCurrentPageInfo",
      ];
  }
}

// Get contextual data based on current page
function getPageContext(currentPath: string) {
  switch (currentPath) {
    case "/":
      return {
        pageType: "dashboard",
        description: "Main dashboard with campaign overview",
      };
    case "/campaign-manager/ads-create":
      return {
        pageType: "ad_creation",
        description:
          "Ad creation form where users build new advertising campaigns",
        supportedAdTypes: ["display", "video", "social"],
        availableMerchants: ["McDonald's", "Starbucks", "Target", "CVS"],
      };
    case "/analytics":
      return {
        pageType: "analytics",
        description: "Analytics dashboard with campaign performance metrics",
        availableMetrics: ["impressions", "clicks", "conversions", "roi"],
      };
    case "/campaigns/product-filters":
      return {
        pageType: "filters",
        description: "Product filters management for campaign targeting",
      };
    default:
      return {
        pageType: "unknown",
        description: "Current page context",
      };
  }
}

function CopilotKitProviderContent({ children }: CopilotKitProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration errors
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <CopilotKit
      runtimeUrl={
        process.env.NEXT_PUBLIC_COPILOT_RUNTIME_URL || "/api/copilotkit"
      }
      showDevConsole={false}
    >
      {children}

      <NavigationBridge />

      {isEnabled && (
        <CopilotSidebar
          instructions={`You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network.

🎯 **Core Capabilities:**
You have direct access to powerful actions that allow you to help users immediately:

🚀 **IMMEDIATE ACTIONS (Always Use These):**
When users want to do something, IMMEDIATELY call the appropriate action:

• "I want to create an ad" → CALL navigateToAdCreation
• "Create catalog filter" → CALL navigateToFilters  
• "Show me analytics" → CALL navigateToAnalytics
• "Where am I?" → CALL getCurrentPageInfo

💡 **Advanced Actions:**
• createAd - Actually create ads with all details (name, merchant, offer, costs)
• requestApproval - Request user approval for important decisions

🎨 **User Experience Guidelines:**
- Always be proactive - when users request actions, DO THEM immediately
- Use the actions to navigate and create things, don't just describe what you can do
- Provide helpful context and guidance after taking actions
- Be conversational and friendly while being highly functional

**CRITICAL**: Don't just talk about what you can do - actively USE the available actions to help users accomplish their goals immediately!`}
          labels={{
            title: "AI Assistant",
            initial:
              "Hi! I'm your Kigo Pro assistant. I can help you create ads, analyze campaigns, and manage filters. What would you like to work on?",
          }}
          defaultOpen={false}
          clickOutsideToClose={true}
        />
      )}
    </CopilotKit>
  );
}

// Export as dynamic component to prevent SSR
export const CopilotKitProvider = dynamic(
  () => Promise.resolve(CopilotKitProviderContent),
  {
    ssr: false,
    loading: () => <div>{/* Loading placeholder */}</div>,
  }
);
