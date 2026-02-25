"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface PublishFooterProps {
  completedCount: number;
  totalCount: number;
  allComplete: boolean;
  isPublishing: boolean;
  mode: "create" | "edit" | "clone";
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export default function PublishFooter({
  completedCount,
  totalCount,
  allComplete,
  isPublishing,
  mode,
  onSaveDraft,
  onPublish,
  onCancel,
}: PublishFooterProps) {
  const publishLabel =
    mode === "edit"
      ? "Save Changes"
      : mode === "clone"
        ? "Clone as Draft"
        : "Publish Offer";

  const publishingLabel =
    mode === "edit"
      ? "Saving..."
      : mode === "clone"
        ? "Cloning..."
        : "Publishing...";

  return (
    <div className="sticky bottom-0 z-10 border-t bg-white px-6 py-3 flex items-center justify-between">
      {/* Left: progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: totalCount }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i < completedCount ? "bg-primary" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} complete
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveDraft}>
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          disabled={!allComplete || isPublishing}
          className="flex items-center gap-1"
        >
          <CheckCircleIcon className="h-4 w-4" />
          {isPublishing ? publishingLabel : publishLabel}
        </Button>
      </div>
    </div>
  );
}
