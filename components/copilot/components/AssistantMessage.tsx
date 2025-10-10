"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generativeUI?: () => React.ReactElement;
  toolCalls?: any[];
}

interface AssistantMessageProps {
  message: Message;
  onDelete: () => void;
  onReload: () => Promise<void>;
}

/**
 * Assistant message component with avatar, generative UI support, and controls
 * Handles text content, tool calls, and custom UI rendering
 */
export function AssistantMessage({
  message,
  onDelete,
  onReload,
}: AssistantMessageProps) {
  const [isReloading, setIsReloading] = React.useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await onReload();
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="flex justify-start group">
      <div className="max-w-[80%] flex items-start space-x-2">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <SparklesIcon className="h-4 w-4 text-blue-600" />
          </div>

          <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleReload}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 hover:bg-blue-100"
              disabled={isReloading}
              title="Regenerate response"
            >
              <ArrowPathIcon
                className={`h-3 w-3 text-blue-500 ${isReloading ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              onClick={onDelete}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 hover:bg-red-100"
              title="Delete message"
            >
              <TrashIcon className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
          {/* Render generative UI if available */}
          {message.generativeUI && (
            <div className="mb-2">{message.generativeUI()}</div>
          )}

          {/* Render tool calls if available */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="mb-2 space-y-2">
              {message.toolCalls.map((toolCall, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded p-2"
                >
                  <div className="text-xs font-medium text-blue-800 mb-1">
                    Tool: {toolCall.function?.name || "Unknown"}
                  </div>
                  {toolCall.function?.arguments && (
                    <div className="text-xs text-blue-600 font-mono">
                      {JSON.stringify(
                        JSON.parse(toolCall.function.arguments),
                        null,
                        2
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Render text content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
