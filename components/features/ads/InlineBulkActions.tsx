"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SelectedCounts {
  campaigns: number;
  adSets: number;
  ads: number;
  total: number;
}

interface InlineBulkActionsProps {
  selectedCounts: SelectedCounts;
  currentLevel: "campaigns" | "adsets" | "ads";
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export const InlineBulkActions = memo(function InlineBulkActions({
  selectedCounts,
  currentLevel,
  onClearSelection,
  onBulkDelete,
}: InlineBulkActionsProps) {
  if (selectedCounts.total === 0) return null;

  // Create a comprehensive display of selected items
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

  return (
    <div className="flex items-center border-l border-r px-4 h-9 border-gray-200">
      <div className="flex items-center gap-3">
        {/* Selection count */}
        <span className="text-sm font-medium whitespace-nowrap text-gray-700">
          {getSelectionDisplay()}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={onBulkDelete}
            title="Delete selected items"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Delete
          </Button>

          {/* Clear selection */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs ml-1"
            onClick={onClearSelection}
            title="Clear selection"
          >
            <XMarkIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
});
