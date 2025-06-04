"use client";

import React from "react";
import { AnimatedCardStatusList, Card } from "@/components/ui/card-status-list";
import { AssignmentItem } from "./BulkAssignmentProgress";

interface AssignmentStatusIndicatorProps {
  isVisible: boolean;
  filterId: string;
  filterName: string;
  items: AssignmentItem[];
  onClose: () => void;
  onRetry?: (itemId: string) => void;
  className?: string;
}

export function AssignmentStatusIndicator({
  isVisible,
  filterId,
  filterName,
  items,
  onClose,
  onRetry,
  className = "",
}: AssignmentStatusIndicatorProps) {
  if (!isVisible || items.length === 0) return null;

  // Convert AssignmentItem[] to Card[] format for the card-status-list
  const cards: Card[] = items.map((item) => {
    let status: Card["status"];

    switch (item.status) {
      case "success":
        status = "completed";
        break;
      case "failed":
        status = "updates-found";
        break;
      case "processing":
      case "pending":
      default:
        status = "syncing";
        break;
    }

    return {
      id: item.id,
      title: item.parentName ? `${item.name} (${item.parentName})` : item.name,
      status,
    };
  });

  const handleSynchronize = (cardId: string) => {
    // This corresponds to retrying a failed assignment
    if (onRetry) {
      onRetry(cardId);
    }
  };

  const handleBack = () => {
    onClose();
  };

  // Calculate progress stats for title
  const completed = items.filter((item) => item.status === "success").length;
  const total = items.length;
  const titleText = `Assigning "${filterName}" (${completed}/${total})`;

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 max-w-sm ${className}`}>
      <AnimatedCardStatusList
        title={titleText}
        cards={cards}
        onSynchronize={handleSynchronize}
        onBack={handleBack}
        className="shadow-2xl"
      />
    </div>
  );
}
