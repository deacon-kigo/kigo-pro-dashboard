"use client";

import React, { memo, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import {
  TrashIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface SelectedCounts {
  campaigns: number;
  adSets: number;
  ads: number;
  total: number;
}

interface FloatingSelectionToolbarProps {
  selectedCounts: SelectedCounts;
  currentLevel: "campaigns" | "adsets" | "ads";
  onClearSelection: () => void;
  onBulkActivate: () => void;
  onBulkPause: () => void;
  onBulkDuplicate: () => void;
  onBulkDelete: () => void;
}

export const FloatingSelectionToolbar = memo(function FloatingSelectionToolbar({
  selectedCounts,
  currentLevel,
  onClearSelection,
  onBulkActivate,
  onBulkPause,
  onBulkDuplicate,
  onBulkDelete,
}: FloatingSelectionToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle visibility changes with smooth animations
  useEffect(() => {
    if (selectedCounts.total > 0) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCounts.total]);

  // Create a comprehensive display of selected items across all levels
  const getSelectionDisplay = () => {
    const parts: string[] = [];

    if (selectedCounts.campaigns > 0) {
      parts.push(
        `${selectedCounts.campaigns} ${selectedCounts.campaigns === 1 ? "campaign" : "campaigns"}`
      );
    }

    if (selectedCounts.adSets > 0) {
      parts.push(
        `${selectedCounts.adSets} ${selectedCounts.adSets === 1 ? "ad group" : "ad groups"}`
      );
    }

    if (selectedCounts.ads > 0) {
      parts.push(
        `${selectedCounts.ads} ${selectedCounts.ads === 1 ? "ad" : "ads"}`
      );
    }

    if (parts.length === 0) return "";
    if (parts.length === 1) return `${parts[0]} selected`;
    if (parts.length === 2) return `${parts[0]} and ${parts[1]} selected`;

    // For 3+ items: "2 campaigns, 3 ad groups, and 5 ads selected"
    const lastPart = parts.pop();
    return `${parts.join(", ")}, and ${lastPart} selected`;
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95"
      }`}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50" />

      {/* Main content */}
      <div className="relative px-6 py-4 flex items-center gap-4 min-w-[400px]">
        {/* Selection indicator with animated check mark */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
            {/* Animated ring */}
            <div className="absolute inset-0 w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-20" />
          </div>

          {/* Selection count with morphing animation */}
          <div className="text-sm font-medium text-gray-900">
            <span
              key={selectedCounts.total}
              className="inline-block animate-pulse"
              style={{
                animation: "morph 0.2s ease-out",
              }}
            >
              <span className="text-gray-600">{getSelectionDisplay()}</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkActivate}
            className="h-8 px-3 text-xs font-medium border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            <PlayIcon className="w-3.5 h-3.5 mr-1.5" />
            Activate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkPause}
            className="h-8 px-3 text-xs font-medium border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300"
          >
            <PauseIcon className="w-3.5 h-3.5 mr-1.5" />
            Pause
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDuplicate}
            className="h-8 px-3 text-xs font-medium border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <DocumentDuplicateIcon className="w-3.5 h-3.5 mr-1.5" />
            Duplicate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            className="h-8 px-3 text-xs font-medium border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Clear selection button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Custom CSS for morph animation */}
      <style jsx>{`
        @keyframes morph {
          0% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          50% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});
