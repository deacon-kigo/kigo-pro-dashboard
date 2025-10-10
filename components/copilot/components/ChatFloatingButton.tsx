"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface ChatFloatingButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

/**
 * Floating action button to open the chat
 * Only visible when chat is closed
 */
export function ChatFloatingButton({
  isVisible,
  onClick,
}: ChatFloatingButtonProps) {
  if (!isVisible) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 p-0 transition-all duration-200 hover:scale-110"
      aria-label="Open AI Assistant"
    >
      <SparklesIcon className="h-6 w-6 text-white" />
    </Button>
  );
}
