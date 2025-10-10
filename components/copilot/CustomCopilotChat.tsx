"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleChat, setChatWidth } from "@/lib/redux/slices/uiSlice";
import { CopilotSidebar } from "@copilotkit/react-ui";
import type { WindowProps } from "@copilotkit/react-ui";

/**
 * Custom Window component for CopilotSidebar
 * Overrides default positioning to integrate with our layout system
 */
const CustomWindow: React.FC<WindowProps & { children: React.ReactNode }> = ({
  children,
  clickOutsideToClose,
  hitEscapeToClose,
  shortcut,
}) => {
  const dispatch = useAppDispatch();
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);

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

  if (!chatOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed right-0 top-0 h-full z-40 flex transition-transform duration-300 ease-in-out bg-white shadow-2xl border-l border-gray-200"
      style={{
        width: `${chatWidth}px`,
        transform: chatOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {/* Resize Handle */}
      <div
        className="w-1 h-full cursor-ew-resize bg-gray-300 hover:bg-blue-500 transition-colors z-10 group flex-shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gray-400 group-hover:bg-blue-600 transition-colors" />
      </div>

      {/* CopilotSidebar Content */}
      <div className="flex-1 flex flex-col h-full">{children}</div>
    </div>
  );
};

/**
 * Custom Draggable Chat Window with CopilotSidebar
 *
 * Uses custom Window component to properly integrate with layout system
 */
export function CustomCopilotChat() {
  const dispatch = useAppDispatch();
  const { chatOpen } = useAppSelector((state) => state.ui);

  // Handle toggle
  const handleToggle = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

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

      {/* CopilotSidebar with custom Window component */}
      <CopilotSidebar
        instructions="You are an AI assistant for Kigo Pro, a marketing campaign management platform. Help users with campaign creation, optimization, and insights."
        labels={{
          title: "Kigo Pro AI Assistant",
          initial:
            "Hi! I'm your AI assistant. How can I help you with your campaigns today?",
        }}
        defaultOpen={chatOpen}
        clickOutsideToClose={false}
        onSetOpen={(open) => {
          if (!open) {
            dispatch(toggleChat());
          }
        }}
        Window={CustomWindow}
      />
    </>
  );
}
