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
    // Get wrapper class based on variant
    const wrapperClassName = inputWrapperVariants({ variant });

    // Handle search all results click
    const handleSearchAllResults = () => {
      if (onSearchAllResults) {
        onSearchAllResults();
      }
    };

    return (
      <div className={wrapperClassName}>
        {variant === "search" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <ShadcnInput
          className={cn(
            // Apply padding only if it's a search variant to make room for the icon
            variant === "search" ? "pl-10" : "",
            // Override the focus styling to use primary blue instead of default black
            "focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-background",
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
              <div
                className={cn(
                  "p-3 border-b",
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                )}
              >
                <p
                  className={cn(
                    "text-xs font-medium",
                    isDarkMode ? "text-gray-400" : "text-text-muted"
                  )}
                >
                  AI Suggestions
                </p>
              </div>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      className={cn(
                        "w-full px-4 py-2.5 text-left flex items-center",
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      )}
                      onClick={() => onSuggestionClick?.(suggestion)}
                      type="button"
                    >
                      <span className="w-6 h-6 flex items-center justify-center text-lg mr-3">
                        {suggestion.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-200" : "text-text-dark"
                          )}
                        >
                          {suggestion.text}
                        </p>
                        <p
                          className={cn(
                            "text-xs capitalize",
                            isDarkMode ? "text-gray-400" : "text-text-muted"
                          )}
                        >
                          {suggestion.type}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className={cn(
                  "p-2 border-t",
                  isDarkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-text-muted"
                    )}
                  >
                    Powered by AI
                  </p>
                  <button
                    className={cn(
                      "text-xs font-medium",
                      isDarkMode ? "text-blue-400" : "text-primary"
                    )}
                    onClick={handleSearchAllResults}
                    type="button"
                  >
                    Search all results
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
