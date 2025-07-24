"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotNavigation } from "../../lib/hooks/useCopilotNavigation";
import { useHumanInTheLoop } from "../../lib/hooks/useHumanInTheLoop";
import { useSuggestionPills } from "../../lib/hooks/useSuggestionPills";
import { useAppSelector } from "../redux/hooks";
import { ApprovalWorkflowUI } from "../../components/ui/ApprovalWorkflowUI";

interface CopilotKitProviderProps {
  children: ReactNode;
}

// Enhanced Navigation Hook Component with Rich Context
function NavigationBridge() {
  const pathname = usePathname();
  const uiState = useAppSelector((state) => state.ui);
  const campaignState = useAppSelector((state) => state.campaign);
  const userState = useAppSelector((state) => state.user);

  console.log("[NavigationBridge] 🚀 Enhanced context:", {
    pathname,
    uiState,
    campaignState,
  });

  // Get available actions based on current page
  const getAvailableActions = (currentPath: string) => {
    switch (currentPath) {
      case "/campaigns":
        return [
          "create_campaign",
          "view_campaign",
          "edit_campaign",
          "navigate_to_ads",
        ];
      case "/campaign-manager/ads-create":
        return ["save_ad", "preview_ad", "cancel_creation", "upload_media"];
      case "/analytics":
        return ["view_metrics", "export_data", "filter_data"];
      case "/filters":
        return ["create_filter", "edit_filter", "test_filter"];
      default:
        return ["navigate_to_page", "get_help"];
    }
  };

  // Get contextual data based on current page
  const getPageContext = (currentPath: string) => {
    const baseContext = {
      currentPage: currentPath,
      userRole: "admin", // TODO: Get from actual user state
      isLoading: uiState.isLoading,
      activeModals: uiState.activeModal ? [uiState.activeModal.type] : [],
      notifications: uiState.notifications || [],
    };

    switch (currentPath) {
      case "/campaigns":
        return {
          ...baseContext,
          pageType: "campaign_management",
          availableAds: campaignState.formData?.ads || [],
          canCreateCampaign: true,
        };
      case "/campaign-manager/ads-create":
        return {
          ...baseContext,
          pageType: "ad_creation",
          formData: campaignState.formData || {},
          hasUnsavedChanges: !!(
            campaignState.formData?.basicInfo?.name ||
            campaignState.formData?.ads?.length
          ),
          supportedMediaTypes: ["image", "video"],
        };
      case "/analytics":
        return {
          ...baseContext,
          pageType: "analytics_dashboard",
          availableMetrics: ["impressions", "clicks", "conversions", "roi"],
          dateRange: "30d", // TODO: Get from analytics state
        };
      default:
        return baseContext;
    }
  };

  // Provide comprehensive context to CopilotKit
  useCopilotReadable({
    description:
      "Complete application state and user context for intelligent assistance",
    value: {
      ...getPageContext(pathname),
      availableActions: getAvailableActions(pathname),
      navigation: {
        currentPath: pathname,
        canNavigateBack: window?.history?.length > 1,
        breadcrumbs: pathname.split("/").filter(Boolean),
      },
      capabilities: {
        canCreateAds: true,
        canManageCampaigns: true,
        canViewAnalytics: true,
        canManageFilters: true,
      },
    },
  });

  useCopilotNavigation(); // Enable navigation
  useHumanInTheLoop(); // Enable approval workflows
  const { suggestions, suggestionContext } = useSuggestionPills(); // Enable suggestions

  // Provide suggestion context to CopilotKit
  useCopilotReadable({
    description: "Available context-aware suggestions for the user",
    value: {
      suggestions: suggestions.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        priority: s.priority,
        icon: s.icon,
        badge: s.badge,
      })),
      context: suggestionContext,
    },
  });

  return <ApprovalWorkflowUI />;
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
- **Smart Navigation**: Use 'navigateToPageAndPerform' for any destination/action requests
- **Human-in-the-Loop**: Use 'startApprovalWorkflow' for decisions requiring user approval
- **Context Suggestions**: Use 'showContextSuggestions' to offer relevant quick actions
- **Intelligent Guidance**: Provide personalized recommendations based on context

🚀 **Navigation Actions (ALWAYS USE THESE):**
When users want to go somewhere or do something, IMMEDIATELY call the appropriate action:
- Create/make/build an ad → CALL navigateToPageAndPerform with destination='/campaign-manager/ads-create' intent='create_ad'
- View analytics/metrics → CALL navigateToPageAndPerform with destination='/analytics' intent='view_analytics'  
- Manage campaigns → CALL navigateToPageAndPerform with destination='/campaigns' intent='manage_campaigns'
- Edit filters → CALL navigateToPageAndPerform with destination='/filters' intent='edit_filters'

✋ **Approval Workflows:**
For significant actions (budget changes, campaign launches, data exports), use:
- startApprovalWorkflow with appropriate workflowType (campaign, filter, analytics, merchant, budget)
- Guide users through step-by-step approval process
- Explain what they're approving and why

💡 **Smart Suggestions (USE THESE FREQUENTLY):**
- After navigation actions → CALL showPostResponseSuggestions with context='navigation'
- After helping with ad creation → CALL showPostResponseSuggestions with context='ad_creation'  
- After showing analytics → CALL showPostResponseSuggestions with context='analytics'
- For general page help → CALL showContextSuggestions to show current page actions
- Execute any suggestion → CALL executeSuggestion with the suggestion ID or title

🎨 **User Experience (DEMO-BANKING STYLE):**
- When users request actions (like "create an ad") → IMMEDIATELY call the navigation action
- After every navigation → IMMEDIATELY call showPostResponseSuggestions 
- For complex actions → Use startApprovalWorkflow for human-in-the-loop confirmation
- Always be proactive with action calling - don't just describe what you can do, DO IT
- Use suggestion pills frequently to guide users to next steps

**CRITICAL**: Don't just talk about actions - CALL THEM! Users expect interactive assistance, not descriptions.

Remember: You have access to navigation, approval workflows, and suggestions. Use them actively to provide the engaging, interactive experience users expect!`}
          labels={{
            title: "AI Assistant",
            initial:
              "Hi! I'm your Kigo Pro assistant. I can see you're currently on the platform and I'm here to help with campaigns, analytics, and more. What would you like to work on?",
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
