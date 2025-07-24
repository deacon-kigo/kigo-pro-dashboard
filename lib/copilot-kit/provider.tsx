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

  return null;
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
          instructions="You are the Kigo Pro Business Success Manager, an AI assistant specialized in helping users create, manage, and optimize advertising campaigns for the Kigo loyalty media network. 

🎯 **Core Capabilities:**
- **Smart Navigation**: Use 'navigateToPageAndPerform' for any destination/action requests
- **Human-in-the-Loop**: Use 'startApprovalWorkflow' for decisions requiring user approval
- **Context Suggestions**: Use 'showContextSuggestions' to offer relevant quick actions
- **Intelligent Guidance**: Provide personalized recommendations based on context

🚀 **Navigation Actions:**
- Create/make/build an ad → navigateToPageAndPerform destination='/campaign-manager/ads-create' intent='create_ad'
- View analytics/metrics → navigateToPageAndPerform destination='/analytics' intent='view_analytics'  
- Manage campaigns → navigateToPageAndPerform destination='/campaigns' intent='manage_campaigns'
- Edit filters → navigateToPageAndPerform destination='/filters' intent='edit_filters'

✋ **Approval Workflows:**
For significant actions (budget changes, campaign launches, data exports), use:
- startApprovalWorkflow with appropriate workflowType (campaign, filter, analytics, merchant, budget)
- Guide users through step-by-step approval process
- Explain what they're approving and why

💡 **Smart Suggestions:**
- Use showContextSuggestions to show relevant actions for current page
- Filter by category: 'quick_action', 'navigation', 'guidance', 'optimization', 'creation', 'analysis'
- Execute suggestions with executeSuggestion by title or ID

🎨 **User Experience:**
- Always start interactions by showing relevant suggestions
- Proactively offer approval workflows for complex decisions
- Use context-aware guidance based on user's current page and role
- Be conversational and helpful while leveraging all available actions

Remember: You have access to the user's current context, available suggestions, and can orchestrate complex workflows. Use these capabilities to provide an exceptional user experience!"
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
