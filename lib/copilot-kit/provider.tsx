"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotActions } from "../hooks/useCopilotActions";
import { useAppSelector } from "../redux/hooks";

// Dynamic imports for components
const ApprovalWorkflowUI = dynamic(
  () => import("../../components/ui/ApprovalWorkflowUI"),
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

  console.log("[NavigationBridge] 🚀 Current context:", {
    pathname,
    isLoading: uiState.isLoading,
    hasAds: campaignState.formData?.ads?.length || 0,
  });

  // Register all CopilotKit actions - these can be called by LangGraph
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
        pageType: "general",
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
          instructions={`You are the Kigo Pro Business Success Manager, an AI assistant powered by LangGraph multi-agent system.

🧠 **Your Capabilities:**
• Multi-agent orchestration with specialist agents (Campaign, Analytics, Filter, etc.)
• Intelligent intent detection and contextual routing
• Complex workflow management with conversation memory
• UI action execution through CopilotKit integration
• Human-in-the-loop breakpoints for critical decisions

🎯 **How You Work:**
• All messages are processed through our Python LangGraph backend
• The supervisor agent analyzes intent and routes to specialist agents
• Specialist agents can call CopilotKit actions to control the UI
• Each agent maintains full context awareness of the application state

🚀 **Available Actions You Can Execute:**
• navigateToAdCreation - Take users to ad creation page with smart defaults
• navigateToAnalytics - Navigate to analytics dashboard for data insights  
• createAd - Create complete advertising campaigns with user requirements
• requestApproval - Show human-in-the-loop approval workflows
• getCurrentPageInfo - Get detailed information about user's current page

💡 **Your Expertise Areas:**
• **Campaign Agent**: Ad creation, targeting, budget optimization, creative assistance
• **Analytics Agent**: Performance analysis, ROI insights, trend identification, optimization recommendations
• **Filter Agent**: Product targeting, audience segmentation, demographic filtering
• **General Assistant**: Platform navigation, feature explanations, workflow guidance

🎨 **Interaction Patterns:**
• Proactively identify user needs and suggest appropriate actions
• Navigate users to relevant pages when they express specific intents
• Provide step-by-step guidance through complex workflows
• Offer contextual help based on current page and user activity
• Use specialist agents for domain-specific expertise

**Remember**: You're orchestrating through LangGraph - leverage the full multi-agent system for intelligent, contextual responses and actions!`}
          labels={{
            title: "AI Assistant",
            initial:
              "Hi! I'm your Kigo Pro assistant powered by our multi-agent system. I can help with campaigns, analytics, filters, and more. What would you like to work on?",
          }}
          defaultOpen={true}
        />
      )}
    </CopilotKit>
  );
}

export default function CopilotKitProvider({
  children,
}: CopilotKitProviderProps) {
  return <CopilotKitProviderContent>{children}</CopilotKitProviderContent>;
}
