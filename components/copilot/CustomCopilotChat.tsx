"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setChatOpen,
  toggleChat,
  setChatWidth,
} from "@/lib/redux/slices/uiSlice";
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";

// Import our modular components
import { ChatWindow } from "./components/ChatWindow";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ChatSuggestions } from "./components/ChatSuggestions";
import { ChatFloatingButton } from "./components/ChatFloatingButton";
import { ResizeHandle } from "./components/ResizeHandle";

/**
 * Custom Headless Chat UI using CopilotKit's useCopilotChatHeadless_c hook
 *
 * This implementation follows CopilotKit's best practices for headless UI:
 * - Uses proper useCopilotChatHeadless_c hook for full control
 * - Modular component architecture for scalability
 * - Supports suggestions, generative UI, and HITL
 * - Maintains custom layout integration and drag-to-resize
 */
export function CustomCopilotChat() {
  const dispatch = useAppDispatch();
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);

  // CopilotKit Headless UI Hook - provides full chat functionality
  const {
    messages,
    sendMessage,
    isLoading,
    suggestions,
    generateSuggestions,
    setSuggestions,
    isLoadingSuggestions,
    resetSuggestions,
    interrupt,
    stopGeneration,
    reset,
    deleteMessage,
    reloadMessages,
  } = useCopilotChatHeadless_c();

  // Local state for input
  const [input, setInput] = useState("");

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate initial suggestions when chat opens
  useEffect(() => {
    if (chatOpen && suggestions.length === 0 && !isLoadingSuggestions) {
      // Set manual suggestions for campaign management
      setSuggestions([
        {
          title: "Campaign Performance",
          message: "Show me the performance metrics for my current campaigns",
        },
        {
          title: "Optimize Campaigns",
          message:
            "How can I optimize my campaign targeting and budget allocation?",
        },
        {
          title: "Create New Campaign",
          message: "Help me create a new marketing campaign for my product",
        },
        {
          title: "Audience Insights",
          message: "What insights can you provide about my target audience?",
        },
      ]);
    }
  }, [chatOpen, suggestions.length, isLoadingSuggestions, setSuggestions]);

  // Handle toggle
  const handleToggle = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  // Send message using CopilotKit's sendMessage
  const handleSendMessage = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return;

      try {
        await sendMessage({
          id: Date.now().toString(),
          role: "user",
          content: messageContent.trim(),
        });
        setInput("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [sendMessage, isLoading]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(input);
    },
    [input, handleSendMessage]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestionMessage: string) => {
      handleSendMessage(suggestionMessage);
    },
    [handleSendMessage]
  );

  // Mouse down on resize handle
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(chatWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [chatWidth]
  );

  // Mouse move during resize
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + deltaX));
      dispatch(setChatWidth(newWidth));
    },
    [isResizing, startX, startWidth, dispatch]
  );

  // Mouse up to end resize
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Add/remove event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Floating Chat Button - only show when chat is closed */}
      <ChatFloatingButton isVisible={!chatOpen} onClick={handleToggle} />

      {/* Chat Window - slides in from right, no overlay */}
      <ChatWindow ref={chatRef} isOpen={chatOpen} width={chatWidth}>
        {/* Resize Handle */}
        <ResizeHandle onMouseDown={handleMouseDown} />

        {/* Header */}
        <ChatHeader
          onClose={handleToggle}
          onReset={reset}
          onStop={isLoading ? stopGeneration : undefined}
        />

        {/* Human-in-the-loop Interrupt */}
        {interrupt && (
          <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
            <div className="text-sm text-yellow-800 font-medium mb-2">
              Human input required:
            </div>
            <div className="text-sm text-yellow-700">{interrupt}</div>
          </div>
        )}

        {/* Suggestions */}
        <ChatSuggestions
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
          onSuggestionClick={handleSuggestionClick}
          onGenerateSuggestions={generateSuggestions}
          onResetSuggestions={resetSuggestions}
        />

        {/* Messages Area */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          onDeleteMessage={deleteMessage}
          onReloadMessage={reloadMessages}
        />

        {/* Input Area */}
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </ChatWindow>
    </>
  );
}
