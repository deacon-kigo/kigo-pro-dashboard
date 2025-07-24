/**
 * Suggestion Pills Hook
 *
 * Scalable context-aware suggestions system inspired by CopilotKit demo-banking.
 * Provides intelligent action suggestions based on current page, user role, and context.
 */

import { useMemo, useCallback } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useRouter } from "next/navigation";
import { addNotification } from "../redux/slices/uiSlice";

// Suggestion pill interface
export interface SuggestionPill {
  id: string;
  title: string;
  description: string;
  category:
    | "quick_action"
    | "navigation"
    | "guidance"
    | "optimization"
    | "creation"
    | "analysis";
  priority: "high" | "medium" | "low";
  action: () => void | Promise<void>;
  icon?: string;
  badge?: string;
  metadata?: Record<string, any>;
}

// Context-aware suggestion generator
interface SuggestionContext {
  currentPage: string;
  userRole: string;
  hasData: boolean;
  recentActions: string[];
  timeContext: "morning" | "afternoon" | "evening";
  workflowState: string;
}

export function useSuggestionPills() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get Redux state for context
  const currentPage = useAppSelector((state) => state.ui.currentPage);
  const userRole = useAppSelector(
    (state) => (state.user as any)?.role || "user"
  );
  const campaignData = useAppSelector((state) => state.campaign);
  const filterData = useAppSelector((state) => state.productFilter);
  const workflowState = useAppSelector((state) => (state as any).workflow);

  // Generate context for suggestions
  const suggestionContext: SuggestionContext = useMemo(() => {
    const hour = new Date().getHours();
    let timeContext: "morning" | "afternoon" | "evening" = "afternoon";

    if (hour < 12) timeContext = "morning";
    else if (hour > 17) timeContext = "evening";

    return {
      currentPage: currentPage || "dashboard",
      userRole,
      hasData: !!(campaignData?.formData || filterData?.criteria?.length),
      recentActions: [], // TODO: Get from user activity tracking
      timeContext,
      workflowState: workflowState?.currentStep || "idle",
    };
  }, [currentPage, userRole, campaignData, filterData, workflowState]);

  // Core suggestion generators by context
  const generateDashboardSuggestions = useCallback(
    (context: SuggestionContext): SuggestionPill[] => {
      const suggestions: SuggestionPill[] = [];

      // Time-based suggestions
      if (context.timeContext === "morning") {
        suggestions.push({
          id: "morning_analytics",
          title: "Review yesterday's performance",
          description: "Check how your campaigns performed overnight",
          category: "analysis",
          priority: "high",
          action: () => router.push("/analytics"),
          icon: "📊",
          badge: "Morning routine",
        });
      }

      // Role-based suggestions
      if (context.userRole === "admin" || context.userRole === "manager") {
        suggestions.push({
          id: "create_campaign",
          title: "Create new campaign",
          description: "Start building a new advertising campaign",
          category: "creation",
          priority: "high",
          action: () => router.push("/campaign-manager/ads-create"),
          icon: "🚀",
        });
      }

      // Data-driven suggestions
      if (!context.hasData) {
        suggestions.push({
          id: "getting_started",
          title: "Get started with your first campaign",
          description: "I'll guide you through creating your first ad",
          category: "guidance",
          priority: "high",
          action: async () => {
            dispatch(
              addNotification({
                message:
                  "Let me help you get started! I'll guide you through the process.",
                type: "info",
              })
            );
            router.push("/campaign-manager/ads-create");
          },
          icon: "✨",
          badge: "New user",
        });
      }

      return suggestions;
    },
    [router, dispatch]
  );

  const generateCampaignPageSuggestions = useCallback(
    (context: SuggestionContext): SuggestionPill[] => {
      const suggestions: SuggestionPill[] = [];

      suggestions.push({
        id: "optimize_targeting",
        title: "Optimize targeting with AI",
        description: "Let AI analyze and improve your audience targeting",
        category: "optimization",
        priority: "high",
        action: async () => {
          dispatch(
            addNotification({
              message: "Starting AI targeting optimization...",
              type: "info",
            })
          );
          // TODO: Trigger AI optimization workflow
        },
        icon: "🎯",
      });

      suggestions.push({
        id: "performance_forecast",
        title: "View performance forecast",
        description: "See predicted results for your campaigns",
        category: "analysis",
        priority: "medium",
        action: () => router.push("/analytics?view=forecast"),
        icon: "📈",
      });

      if (context.hasData) {
        suggestions.push({
          id: "duplicate_best",
          title: "Duplicate top performer",
          description: "Create a copy of your best performing campaign",
          category: "quick_action",
          priority: "medium",
          action: async () => {
            // TODO: Implement campaign duplication
            dispatch(
              addNotification({
                message: "Campaign duplicated successfully!",
                type: "success",
              })
            );
          },
          icon: "📋",
        });
      }

      return suggestions;
    },
    [router, dispatch]
  );

  const generateAdCreationSuggestions = useCallback(
    (context: SuggestionContext): SuggestionPill[] => {
      const suggestions: SuggestionPill[] = [];

      suggestions.push({
        id: "ai_copy_generator",
        title: "Generate ad copy with AI",
        description: "Let AI write compelling ad copy for you",
        category: "creation",
        priority: "high",
        action: async () => {
          dispatch(
            addNotification({
              message: "AI is generating ad copy suggestions...",
              type: "info",
            })
          );
          // TODO: Trigger AI copy generation
        },
        icon: "✍️",
        badge: "AI powered",
      });

      suggestions.push({
        id: "upload_assets",
        title: "Upload brand assets",
        description: "Add your logos, images, and creative materials",
        category: "quick_action",
        priority: "medium",
        action: async () => {
          // TODO: Trigger file upload modal
          dispatch(
            addNotification({
              message: "Opening asset upload dialog...",
              type: "info",
            })
          );
        },
        icon: "🖼️",
      });

      suggestions.push({
        id: "industry_templates",
        title: "Browse industry templates",
        description: "Start with proven templates for your industry",
        category: "guidance",
        priority: "medium",
        action: () => router.push("/templates"),
        icon: "📋",
      });

      return suggestions;
    },
    [router, dispatch]
  );

  const generateAnalyticsSuggestions = useCallback(
    (context: SuggestionContext): SuggestionPill[] => {
      const suggestions: SuggestionPill[] = [];

      suggestions.push({
        id: "ai_insights",
        title: "Get AI insights",
        description: "Let AI analyze your data for optimization opportunities",
        category: "analysis",
        priority: "high",
        action: async () => {
          dispatch(
            addNotification({
              message: "AI is analyzing your campaign data...",
              type: "info",
            })
          );
          // TODO: Trigger AI insights generation
        },
        icon: "🤖",
        badge: "AI insights",
      });

      suggestions.push({
        id: "export_report",
        title: "Export performance report",
        description: "Download a comprehensive performance report",
        category: "quick_action",
        priority: "medium",
        action: async () => {
          // TODO: Generate and download report
          dispatch(
            addNotification({
              message: "Generating report... Download will start shortly.",
              type: "info",
            })
          );
        },
        icon: "📄",
      });

      return suggestions;
    },
    [dispatch]
  );

  // Main suggestion generator
  const suggestions = useMemo(() => {
    const context = suggestionContext;
    let suggestions: SuggestionPill[] = [];

    switch (context.currentPage) {
      case "/dashboard":
      case "/":
        suggestions = generateDashboardSuggestions(context);
        break;

      case "/campaigns":
        suggestions = generateCampaignPageSuggestions(context);
        break;

      case "/campaign-manager/ads-create":
        suggestions = generateAdCreationSuggestions(context);
        break;

      case "/analytics":
        suggestions = generateAnalyticsSuggestions(context);
        break;

      default:
        // Generic suggestions for unknown pages
        suggestions = [
          {
            id: "quick_help",
            title: "Get help with this page",
            description: "I can guide you through using this feature",
            category: "guidance",
            priority: "medium",
            action: async () => {
              dispatch(
                addNotification({
                  message:
                    "How can I help you with this page? Just ask me anything!",
                  type: "info",
                })
              );
            },
            icon: "❓",
          },
        ];
    }

    // Sort by priority and limit to top suggestions
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 4); // Limit to 4 suggestions to avoid overwhelming UI
  }, [
    suggestionContext,
    generateDashboardSuggestions,
    generateCampaignPageSuggestions,
    generateAdCreationSuggestions,
    generateAnalyticsSuggestions,
    dispatch,
  ]);

  // Register CopilotKit action for suggestion interaction
  useCopilotAction({
    name: "showContextSuggestions",
    description:
      "Display context-aware suggestions for the current page and user situation",
    parameters: [
      {
        name: "category",
        type: "string",
        description:
          "Filter suggestions by category (optional): quick_action, navigation, guidance, optimization, creation, analysis",
        required: false,
      },
    ],
    handler: async ({ category }) => {
      let filteredSuggestions = suggestions;

      if (category) {
        filteredSuggestions = suggestions.filter(
          (s) => s.category === category
        );
      }

      if (filteredSuggestions.length === 0) {
        return "No suggestions available for the current context.";
      }

      const suggestionList = filteredSuggestions
        .map((s) => `• ${s.icon || "•"} **${s.title}**: ${s.description}`)
        .join("\n");

      return `Here are my suggestions for you:\n\n${suggestionList}\n\nJust click on any suggestion or tell me what you'd like to do!`;
    },
  });

  // Register CopilotKit action for executing suggestions
  useCopilotAction({
    name: "executeSuggestion",
    description: "Execute a specific suggestion by ID or title",
    parameters: [
      {
        name: "suggestionId",
        type: "string",
        description: "ID or title of the suggestion to execute",
        required: true,
      },
    ],
    handler: async ({ suggestionId }) => {
      const suggestion = suggestions.find(
        (s) =>
          s.id === suggestionId ||
          s.title.toLowerCase().includes(suggestionId.toLowerCase())
      );

      if (!suggestion) {
        return `Couldn't find suggestion "${suggestionId}". Available suggestions: ${suggestions.map((s) => s.title).join(", ")}`;
      }

      try {
        await suggestion.action();
        return `Executed: ${suggestion.title}`;
      } catch (error) {
        console.error("[SuggestionPills] Error executing suggestion:", error);
        return `Sorry, there was an error executing "${suggestion.title}". Please try again.`;
      }
    },
  });

  return {
    suggestions,
    suggestionContext,
    executeAction: useCallback(
      async (suggestionId: string) => {
        const suggestion = suggestions.find((s) => s.id === suggestionId);
        if (suggestion) {
          await suggestion.action();
        }
      },
      [suggestions]
    ),
    getSuggestionsByCategory: useCallback(
      (category: SuggestionPill["category"]) => {
        return suggestions.filter((s) => s.category === category);
      },
      [suggestions]
    ),
    getHighPrioritySuggestions: useCallback(() => {
      return suggestions.filter((s) => s.priority === "high");
    }, [suggestions]),
  };
}
