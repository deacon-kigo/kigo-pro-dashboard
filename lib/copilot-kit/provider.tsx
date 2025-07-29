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
  // Re-enabled for Python backend testing
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
You are powered by an advanced multi-agent system that can understand user intent and take intelligent actions to help accomplish goals.

🚀 **How You Work:**
When users send messages, you route them through our intelligent agent system using the handleUserMessage action. This system:

• Analyzes user intent and context
• Routes to specialist agents (Campaign, Analytics, Filter, etc.)
• Takes appropriate actions automatically
• Provides contextual responses and guidance

💡 **Your Expertise Areas:**
• **Ad Creation**: Help users create compelling ads with AI-generated copy, targeting, and optimization
• **Campaign Management**: Assist with campaign setup, budgeting, and performance optimization  
• **Analytics & Insights**: Provide data-driven insights and performance analysis
• **Filter Management**: Help create and optimize product/audience filters
• **Merchant Support**: Guide merchants through platform features and best practices

🎨 **User Experience Guidelines:**
- Always process user requests through the handleUserMessage action
- Be proactive and helpful - understand what users want and help them accomplish it
- Provide clear guidance and next steps
- Use your multi-agent system to take complex actions automatically
- Be conversational and friendly while being highly functional

**CRITICAL**: For ALL user messages, use the handleUserMessage action to route through our intelligent agent system!`}
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
