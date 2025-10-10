"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  LightBulbIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SuggestionItem {
  title: string;
  message: string;
}

interface ChatSuggestionsProps {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  onSuggestionClick: (message: string) => void;
  onGenerateSuggestions: () => void;
  onResetSuggestions: () => void;
}

/**
 * Chat suggestions component with AI-generated or manual suggestions
 * Displays suggestion chips that users can click to send messages
 */
export function ChatSuggestions({
  suggestions,
  isLoading,
  onSuggestionClick,
  onGenerateSuggestions,
  onResetSuggestions,
}: ChatSuggestionsProps) {
  // Don't render if no suggestions and not loading
  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <LightBulbIcon className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">Suggestions</span>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            onClick={onGenerateSuggestions}
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6"
            disabled={isLoading}
            title="Generate new suggestions"
          >
            <ArrowPathIcon
              className={`h-3 w-3 text-gray-500 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          {suggestions.length > 0 && (
            <Button
              onClick={onResetSuggestions}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              title="Clear suggestions"
            >
              <XMarkIcon className="h-3 w-3 text-gray-500" />
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span>Generating suggestions...</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              onClick={() => onSuggestionClick(suggestion.message)}
              variant="outline"
              size="sm"
              className="text-xs bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-300 transition-colors"
              disabled={isLoading}
            >
              {suggestion.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
