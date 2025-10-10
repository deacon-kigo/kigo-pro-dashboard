"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * Chat input component with form handling and send button
 * Handles message composition and submission
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled,
}: ChatInputProps) {
  return (
    <div className="border-t border-gray-200 p-4 flex-shrink-0">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PaperAirplaneIcon className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
