"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotActions } from "../hooks/useCopilotActions";
import { useAppSelector } from "../redux/hooks";
import ActionExecutor from "./action-executor";
import { useApprovalFlow } from "../hooks/useApprovalFlow";

// Dynamic imports for components
const ApprovalDialog = dynamic(
  () =>
    import("../../components/ui/ApprovalDialog").then((mod) => ({
      default: mod.ApprovalDialog,
    })),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

interface CopilotKitProviderProps {
  children: ReactNode;
}

// Navigation Bridge - Registers all CopilotKit actions and provides context
function NavigationBridge() {
  const pathname = usePathname();
  const uiState = useAppSelector((state) => state.ui);
  const campaignState = useAppSelector((state) => state.campaign);
  const { approval, handleApprove, handleReject, closeApproval } =
    useApprovalFlow();

  console.log("[NavigationBridge] 🚀 Current context:", {
    pathname,
    isLoading: uiState.isLoading,
    hasAds: campaignState.formData?.ads?.length || 0,
  });

  // DEMO MODE: Re-enable frontend actions for demo presentation
  useCopilotActions(); // Re-enabled for demo - provides immediate action execution

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

  return (
    <ApprovalDialog
      isOpen={approval.isOpen}
      pendingAction={
        approval.pendingAction || {
          action_name: "",
          parameters: {},
          description: "",
        }
      }
      message={approval.message}
      threadId={approval.threadId}
      onApprove={handleApprove}
      onReject={handleReject}
      onClose={closeApproval}
    />
  );
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
        pageType: "general",
        description: "Current page context",
      };
  }
}

function CopilotKitProviderContent({ children }: CopilotKitProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  // REMOVED: Feature flag check - CopilotKit now always enabled
  // const isEnabled = process.env.NEXT_PUBLIC_FEATURE_COPILOT_CHAT === "true";

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
      showDevConsole={false} // Hidden completely
    >
      {children}

      <NavigationBridge />
      <ActionExecutor />

      {/* ALWAYS ENABLED: CopilotKit UI now available in production */}
      <CopilotSidebar
        instructions={`🚀 **Kigo Pro AI Assistant** - Powered by Python LangGraph Multi-Agent System

You are directly connected to our Python LangGraph backend with:

🧠 **Intelligent Agents:**
• **Supervisor**: Routes your requests to the right specialist
• **Campaign Agent**: Handles ad creation with human approval workflows  
• **Analytics Agent**: Provides performance insights and recommendations
• **Filter Agent**: Manages product targeting and audience segmentation
• **Merchant Agent**: Assists with merchant-specific workflows

🎯 **How It Works:**
• All messages go through Python LangGraph supervisor
• Context-aware routing to appropriate specialist agents
• Human-in-the-loop approvals for critical actions
• Conversation memory across all interactions

🔧 **Available Actions:**
• Create ads with guided workflows
• Navigate to different dashboard sections  
• Analyze campaign performance
• Set up product filters and targeting
• Request approvals for budget/campaign changes

💬 **Just Ask:**
• "Create an ad for McDonald's"
• "Show me my analytics" 
• "Help me set up filters"
• "I need approval for a budget change"

**All powered by sophisticated multi-agent workflows with full conversation memory!**`}
        labels={{
          title: "AI Assistant",
          initial:
            "Hi! I'm your Kigo Pro assistant powered by our multi-agent system. I can help with campaigns, analytics, filters, and more. What would you like to work on?",
        }}
        defaultOpen={true}
      />
    </CopilotKit>
  );
}

export default function CopilotKitProvider({
  children,
}: CopilotKitProviderProps) {
  return <CopilotKitProviderContent>{children}</CopilotKitProviderContent>;
}
