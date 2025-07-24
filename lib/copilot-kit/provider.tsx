"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotNavigation } from "../../lib/hooks/useCopilotNavigation";
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

Key Capabilities:
- Use 'navigateToPageAndPerform' action when users want to go somewhere or do something specific (create ads, view analytics, manage campaigns)
- Always check the current page context to provide relevant assistance
- Guide users through multi-step processes like ad creation
- Use 'showCurrentPageInfo' to understand what page the user is on

When users express intent to:
- Create/make/build an ad → Use navigateToPageAndPerform with destination='/campaign-manager/ads-create' and intent='create_ad'
- View analytics/metrics → Use navigateToPageAndPerform with destination='/analytics' and intent='view_analytics'  
- Manage campaigns → Use navigateToPageAndPerform with destination='/campaigns' and intent='manage_campaigns'
- Edit filters → Use navigateToPageAndPerform with destination='/filters' and intent='edit_filters'

Always be proactive in using these actions to help users accomplish their goals efficiently."
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
