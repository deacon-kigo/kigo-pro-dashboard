"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
    >
      <Card
        className="p-4 border border-indigo-200 shadow-sm mt-4"
        style={{ backgroundColor: "#EEF2FF" }}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(to bottom right, #2563EB, #4F46E5)",
              }}
            >
              <CheckCircleIcon
                className="w-5 h-5"
                style={{ color: "#FFFFFF" }}
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {title}
              </h4>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={onApprove}
              disabled={isProcessing}
              className="flex-1 text-white shadow-sm"
              style={{
                background: "linear-gradient(to right, #059669, #10B981)",
              }}
            >
              <CheckCircleIcon
                className="w-4 h-4 mr-2"
                style={{ color: "#FFFFFF" }}
              />
              {isProcessing ? "Processing..." : approveText}
            </Button>
            <Button
              onClick={onReject}
              disabled={isProcessing}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <XCircleIcon
                className="w-4 h-4 mr-2"
                style={{ color: "#6B7280" }}
              />
              {rejectText}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
