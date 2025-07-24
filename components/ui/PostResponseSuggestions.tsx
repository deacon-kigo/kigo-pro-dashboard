/**
 * Post-Response Suggestions Component
 *
 * Suggestion pills that appear after AI responses to provide quick follow-up actions.
 * Inspired by CopilotKit demo-banking conversation flow patterns.
 */

import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  useSuggestionPills,
  type SuggestionPill,
} from "../../lib/hooks/useSuggestionPills";

interface PostResponseSuggestionsProps {
  /**
   * Context for generating relevant suggestions
   */
  responseContext?: {
    topic?: string; // What the AI just talked about
    action?: string; // What action was just taken/suggested
    currentPage?: string;
    userIntent?: string;
  };

  /**
   * Maximum number of suggestions to show
   */
  maxSuggestions?: number;

  /**
   * Callback when a suggestion is clicked
   */
  onSuggestionClick?: (suggestion: SuggestionPill) => void;

  /**
   * Custom suggestions to override auto-generated ones
   */
  customSuggestions?: SuggestionPill[];
}

export function PostResponseSuggestions({
  responseContext,
  maxSuggestions = 3,
  onSuggestionClick,
  customSuggestions,
}: PostResponseSuggestionsProps) {
  const { suggestions, executeAction } = useSuggestionPills();

  // Generate context-specific suggestions based on the AI's response
  const generateContextualSuggestions = (): SuggestionPill[] => {
    if (customSuggestions) {
      return customSuggestions.slice(0, maxSuggestions);
    }

    let contextualSuggestions: SuggestionPill[] = [];

    // Add suggestions based on response context
    if (responseContext?.topic) {
      switch (responseContext.topic) {
        case "ad_creation":
          contextualSuggestions = [
            {
              id: "upload_creative",
              title: "Upload creative assets",
              description: "Add images or videos for your ad",
              category: "quick_action",
              priority: "high",
              action: async () => {
                // TODO: Trigger upload modal
                console.log("Opening upload dialog...");
              },
              icon: "🖼️",
            },
            {
              id: "preview_ad",
              title: "Preview ad",
              description: "See how your ad will look",
              category: "quick_action",
              priority: "medium",
              action: async () => {
                console.log("Showing ad preview...");
              },
              icon: "👀",
            },
            {
              id: "set_budget",
              title: "Set budget",
              description: "Configure your ad spending",
              category: "creation",
              priority: "high",
              action: async () => {
                console.log("Opening budget settings...");
              },
              icon: "💰",
            },
          ];
          break;

        case "analytics":
          contextualSuggestions = [
            {
              id: "export_data",
              title: "Export data",
              description: "Download this data as CSV",
              category: "quick_action",
              priority: "medium",
              action: async () => {
                console.log("Exporting data...");
              },
              icon: "📄",
            },
            {
              id: "create_alert",
              title: "Create alert",
              description: "Get notified of changes",
              category: "creation",
              priority: "medium",
              action: async () => {
                console.log("Creating alert...");
              },
              icon: "🔔",
            },
          ];
          break;

        case "navigation":
          contextualSuggestions = [
            {
              id: "get_help",
              title: "Get help",
              description: "Learn about this page",
              category: "guidance",
              priority: "medium",
              action: async () => {
                console.log("Showing help...");
              },
              icon: "❓",
            },
          ];
          break;
      }
    }

    // Fall back to high-priority suggestions from the current context
    if (contextualSuggestions.length === 0) {
      contextualSuggestions = suggestions
        .filter((s) => s.priority === "high")
        .slice(0, maxSuggestions);
    }

    // If still no suggestions, provide generic helpful ones
    if (contextualSuggestions.length === 0) {
      contextualSuggestions = [
        {
          id: "show_suggestions",
          title: "Show more suggestions",
          description: "See what else I can help with",
          category: "guidance",
          priority: "medium",
          action: async () => {
            console.log("Showing all suggestions...");
          },
          icon: "💡",
        },
      ];
    }

    return contextualSuggestions.slice(0, maxSuggestions);
  };

  const contextualSuggestions = generateContextualSuggestions();

  const handleSuggestionClick = async (suggestion: SuggestionPill) => {
    try {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      } else {
        await executeAction(suggestion.id);
      }
    } catch (error) {
      console.error(
        "[PostResponseSuggestions] Error executing suggestion:",
        error
      );
    }
  };

  if (contextualSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="post-response-suggestions mt-3 mb-2">
      <div className="text-xs font-medium text-gray-500 mb-2">
        Quick actions:
      </div>

      <div className="flex flex-wrap gap-2">
        {contextualSuggestions.map((suggestion) => (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="
              flex items-center gap-2 text-xs
              bg-white hover:bg-blue-50 
              border-gray-200 hover:border-blue-300
              text-gray-700 hover:text-blue-700
              transition-all duration-200
              hover:scale-105 hover:shadow-sm
              max-w-[200px]
            "
          >
            {suggestion.icon && (
              <span className="text-sm">{suggestion.icon}</span>
            )}
            <span className="truncate">{suggestion.title}</span>
            {suggestion.priority === "high" && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                New
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * Helper function to create post-response suggestions for specific contexts
 */
export const createPostResponseSuggestions = {
  adCreation: (onSuggestionClick?: (suggestion: SuggestionPill) => void) => (
    <PostResponseSuggestions
      responseContext={{ topic: "ad_creation" }}
      onSuggestionClick={onSuggestionClick}
    />
  ),

  analytics: (onSuggestionClick?: (suggestion: SuggestionPill) => void) => (
    <PostResponseSuggestions
      responseContext={{ topic: "analytics" }}
      onSuggestionClick={onSuggestionClick}
    />
  ),

  navigation: (onSuggestionClick?: (suggestion: SuggestionPill) => void) => (
    <PostResponseSuggestions
      responseContext={{ topic: "navigation" }}
      onSuggestionClick={onSuggestionClick}
    />
  ),

  custom: (
    suggestions: SuggestionPill[],
    onSuggestionClick?: (suggestion: SuggestionPill) => void
  ) => (
    <PostResponseSuggestions
      customSuggestions={suggestions}
      onSuggestionClick={onSuggestionClick}
    />
  ),
};
