"use client";

import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { LoadingMessage } from "./LoadingMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generativeUI?: () => React.ReactElement;
  toolCalls?: any[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onDeleteMessage: (messageId: string) => void;
  onReloadMessage: (messageId: string) => Promise<void>;
}

/**
 * Chat messages container with message rendering and empty state
 * Handles different message types and provides scroll anchor
 */
export function ChatMessages({
  messages,
  isLoading,
  messagesEndRef,
  onDeleteMessage,
  onReloadMessage,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-8">
          <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Hi! I'm your AI assistant</p>
          <p className="text-sm">
            How can I help you with your campaigns today?
          </p>
        </div>
      )}

      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <UserMessage
              key={message.id}
              message={message}
              onDelete={() => onDeleteMessage(message.id)}
            />
          );
        } else if (message.role === "assistant") {
          return (
            <AssistantMessage
              key={message.id}
              message={message}
              onDelete={() => onDeleteMessage(message.id)}
              onReload={() => onReloadMessage(message.id)}
            />
          );
        }
        return null;
      })}

      {isLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />
    </div>
  );
}
