"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  onStop?: () => void;
}

/**
 * Chat window header with title, controls, and action buttons
 * Includes close, reset, and optional stop generation buttons
 */
export function ChatHeader({ onClose, onReset, onStop }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <SparklesIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Kigo Pro AI Assistant
          </h2>
          <p className="text-xs text-gray-500">Powered by CopilotKit</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Stop Generation Button - only show when generating */}
        {onStop && (
          <Button
            onClick={onStop}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            title="Stop generation"
          >
            <StopIcon className="h-4 w-4 text-red-500" />
          </Button>
        )}

        {/* Reset Chat Button */}
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset chat"
        >
          <ArrowPathIcon className="h-4 w-4 text-gray-500" />
        </Button>

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close AI Assistant"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
