"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export interface ApprovalCardProps {
  title?: string;
  description?: string;
  onApprove: () => void;
  onReject: () => void;
  approveText?: string;
  rejectText?: string;
  isProcessing?: boolean;
}

/**
 * Human-in-the-loop approval component for AI recommendations
 * Displays in chat UI for user confirmation before proceeding
 */
export function ApprovalCard({
  title = "Approve Recommendation?",
  description = "Review the recommendation above and confirm to proceed with campaign creation.",
  onApprove,
  onReject,
  approveText = "Approve & Continue",
  rejectText = "Request Changes",
  isProcessing = false,
}: ApprovalCardProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mt-4">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex-shrink-0">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onApprove}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing..." : approveText}
          </Button>
          <Button
            onClick={onReject}
            disabled={isProcessing}
            variant="outline"
            className="flex-1 border-red-200 hover:bg-red-50 text-red-700"
          >
            <XCircleIcon className="w-4 h-4 mr-2" />
            {rejectText}
          </Button>
        </div>
      </div>
    </Card>
  );
}
