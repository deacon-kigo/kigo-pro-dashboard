"use client";

import React, { forwardRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cva } from "class-variance-authority";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  type: string;
  text: string;
  icon: string;
}

// Input variations
export type InputVariant = "default" | "search";

// Define input variants using cva - now applying directly to the wrapper div
const inputWrapperVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "",
      search: "has-search-icon", // Custom class for search variant
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps
  extends Omit<React.ComponentPropsWithRef<typeof ShadcnInput>, "type"> {
  variant?: InputVariant;
  type?: string;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  onSearchAllResults?: () => void;
  isDarkMode?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      suggestions,
      showSuggestions = false,
      onSuggestionClick,
      onSearchAllResults,
      isDarkMode = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      }
    };

    const handleSearchAllClick = () => {
      if (onSearchAllResults) {
        onSearchAllResults();
      }
    };

    return (
      <div className={inputWrapperVariants({ variant })}>
        {variant === "search" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <ShadcnInput
          className={cn(
            // Apply padding only if it's a search variant to make room for the icon
            variant === "search" ? "pl-10" : "",
            // Override the focus styling to match merchant combobox exactly
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-2",
            className
          )}
          ref={ref}
          type={type}
          {...props}
        />

        {/* Search Suggestions Dropdown */}
        {variant === "search" &&
          showSuggestions &&
          suggestions &&
          suggestions.length > 0 && (
            <div
              className={cn(
                "absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border overflow-hidden z-50 animate-fadeIn",
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              )}
            >
              {/* Suggestions List */}
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors flex items-center space-x-3",
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-gray-50 text-gray-800"
                    )}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex-shrink-0">
                      <span className="text-lg">{suggestion.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {suggestion.text}
                      </p>
                      <p
                        className={cn(
                          "text-xs truncate",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        {suggestion.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search All Results Option */}
              {onSearchAllResults && (
                <div
                  className={cn(
                    "border-t px-4 py-3 cursor-pointer transition-colors",
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-700 text-gray-200"
                      : "border-gray-200 hover:bg-gray-50 text-gray-800"
                  )}
                  onClick={handleSearchAllClick}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">See all results</span>
                    <MagnifyingGlassIcon className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

// Legacy exports for backward compatibility
export type { InputProps as KigoInputProps };
export default Input;

// Helper function to create search suggestions
export const createSearchSuggestion = (
  type: string,
  text: string,
  icon: string
): SearchSuggestion => ({
  type,
  text,
  icon,
});

// Common search suggestion types
export const SEARCH_SUGGESTION_TYPES = {
  MERCHANT: "Merchant",
  CAMPAIGN: "Campaign",
  PRODUCT: "Product",
  CUSTOMER: "Customer",
  LOCATION: "Location",
} as const;

// Common search suggestion icons (emoji)
export const SEARCH_SUGGESTION_ICONS = {
  MERCHANT: "🏪",
  CAMPAIGN: "📢",
  PRODUCT: "📦",
  CUSTOMER: "👤",
  LOCATION: "📍",
  SEARCH: "🔍",
} as const;
