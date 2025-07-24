/**
 * Suggestion Pills Component
 *
 * Reusable UI component for displaying context-aware suggestion pills.
 * Inspired by CopilotKit demo-banking patterns but designed for any context.
 */

import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";
import {
  useSuggestionPills,
  type SuggestionPill,
} from "../../lib/hooks/useSuggestionPills";

interface SuggestionPillsProps {
  /**
   * Filter suggestions by category
   */
  category?: SuggestionPill["category"];

  /**
   * Maximum number of suggestions to display
   */
  maxSuggestions?: number;

  /**
   * Display style variant
   */
  variant?: "pills" | "cards" | "compact";

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Show only high priority suggestions
   */
  highPriorityOnly?: boolean;

  /**
   * Custom title for the suggestions section
   */
  title?: string;

  /**
   * Callback when a suggestion is executed
   */
  onSuggestionExecuted?: (suggestionId: string) => void;
}

export function SuggestionPills({
  category,
  maxSuggestions = 4,
  variant = "pills",
  className = "",
  highPriorityOnly = false,
  title,
  onSuggestionExecuted,
}: SuggestionPillsProps) {
  const {
    suggestions,
    executeAction,
    getSuggestionsByCategory,
    getHighPrioritySuggestions,
  } = useSuggestionPills();

  // Filter suggestions based on props
  let filteredSuggestions = suggestions;

  if (category) {
    filteredSuggestions = getSuggestionsByCategory(category);
  }

  if (highPriorityOnly) {
    filteredSuggestions = getHighPrioritySuggestions();
  }

  // Limit suggestions
  filteredSuggestions = filteredSuggestions.slice(0, maxSuggestions);

  const handleSuggestionClick = async (suggestion: SuggestionPill) => {
    try {
      await executeAction(suggestion.id);
      onSuggestionExecuted?.(suggestion.id);
    } catch (error) {
      console.error("[SuggestionPills] Error executing suggestion:", error);
    }
  };

  if (filteredSuggestions.length === 0) {
    return null;
  }

  const renderTitle = () => {
    if (title) {
      return (
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      );
    }

    if (category) {
      const categoryNames = {
        quick_action: "Quick Actions",
        navigation: "Navigation",
        guidance: "Getting Started",
        optimization: "Optimization",
        creation: "Create New",
        analysis: "Analytics",
      };
      return (
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {categoryNames[category]}
        </h3>
      );
    }

    return (
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Suggested for You
      </h3>
    );
  };

  if (variant === "pills") {
    return (
      <div className={`suggestion-pills ${className}`}>
        {renderTitle()}
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                flex items-center gap-2 text-sm font-medium
                bg-white hover:bg-blue-50 
                border-blue-200 hover:border-blue-300
                text-blue-700 hover:text-blue-800
                transition-all duration-200
                hover:scale-105 hover:shadow-sm
              "
            >
              {suggestion.icon && (
                <span className="text-base">{suggestion.icon}</span>
              )}
              <span>{suggestion.title}</span>
              {suggestion.badge && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {suggestion.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`suggestion-cards ${className}`}>
        {renderTitle()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSuggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-blue-100 hover:border-blue-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start gap-3">
                {suggestion.icon && (
                  <div className="text-2xl">{suggestion.icon}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {suggestion.title}
                    </h4>
                    {suggestion.badge && (
                      <Badge variant="outline" className="text-xs">
                        {suggestion.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`suggestion-compact ${className}`}>
        {title && (
          <div className="text-xs font-medium text-gray-500 mb-2">{title}</div>
        )}
        <div className="space-y-1">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                w-full text-left flex items-center gap-2 p-2 rounded-md
                hover:bg-gray-50 transition-colors text-sm
                border border-transparent hover:border-gray-200
              "
            >
              {suggestion.icon && (
                <span className="text-sm">{suggestion.icon}</span>
              )}
              <span className="flex-1 font-medium text-gray-700">
                {suggestion.title}
              </span>
              {suggestion.priority === "high" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Context-aware suggestion pills for the current page
 */
export function ContextSuggestionPills(
  props: Omit<SuggestionPillsProps, "category">
) {
  return <SuggestionPills {...props} />;
}

/**
 * Quick action suggestion pills
 */
export function QuickActionPills(
  props: Omit<SuggestionPillsProps, "category">
) {
  return (
    <SuggestionPills
      {...props}
      category="quick_action"
      title={props.title || "Quick Actions"}
    />
  );
}

/**
 * Guidance suggestion pills for new users
 */
export function GuidancePills(props: Omit<SuggestionPillsProps, "category">) {
  return (
    <SuggestionPills
      {...props}
      category="guidance"
      title={props.title || "Get Started"}
    />
  );
}

/**
 * High priority suggestions only
 */
export function PrioritySuggestionPills(
  props: Omit<SuggestionPillsProps, "highPriorityOnly">
) {
  return (
    <SuggestionPills
      {...props}
      highPriorityOnly={true}
      title={props.title || "Top Suggestions"}
    />
  );
}
