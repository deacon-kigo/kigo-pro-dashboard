"use client";

import React, { useState, useRef, useCallback } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setChatOpen,
  toggleChat,
  setChatWidth,
} from "@/lib/redux/slices/uiSlice";

/**
 * Custom Draggable Chat UI using CopilotSidebar with custom styling
 *
 * This uses the working CopilotSidebar but with our custom layout integration
 */
export function CustomCopilotChat() {
  const dispatch = useAppDispatch();
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);

  // Handle toggle
  const handleToggle = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

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
  React.useEffect(() => {
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
      {!chatOpen && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 p-0"
          aria-label="Open AI Assistant"
        >
          <SparklesIcon className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Integrated Chat Window - slides in from right, no overlay */}
      <div
        ref={chatRef}
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: `${chatWidth}px`,
        }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-gray-300 hover:bg-blue-500 transition-colors z-10 group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gray-400 group-hover:bg-blue-600 transition-colors" />
        </div>

        {/* Custom Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Kigo Pro AI Assistant
              </h2>
            </div>
          </div>

          <Button
            onClick={handleToggle}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close AI Assistant"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        {/* CopilotSidebar - this is the working chat component */}
        <div className="flex-1 overflow-hidden">
          <CopilotSidebar
            instructions="You are an AI assistant for Kigo Pro, a marketing campaign management platform. Help users with campaign creation, optimization, and insights."
            labels={{
              title: "Kigo Pro AI Assistant",
              initial:
                "Hi! I'm your AI assistant. How can I help you with your campaigns today?",
            }}
            className="h-full"
          />
        </div>
      </div>
    </>
  );
}
