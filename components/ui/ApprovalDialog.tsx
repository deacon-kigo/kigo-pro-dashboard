"use client";

import React, { useState } from "react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ApprovalDialogProps {
  isOpen: boolean;
  pendingAction: {
    action_name: string;
    parameters: any;
    description: string;
  };
  message: string;
  threadId: string;
  onApprove: (threadId: string) => Promise<void>;
  onReject: (threadId: string) => Promise<void>;
  onClose: () => void;
}

export function ApprovalDialog({
  isOpen,
  pendingAction,
  message,
  threadId,
  onApprove,
  onReject,
  onClose,
}: ApprovalDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(threadId);
      onClose();
    } catch (error) {
      console.error("Failed to approve action:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(threadId);
      onClose();
    } catch (error) {
      console.error("Failed to reject action:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <CardTitle>Action Approval Required</CardTitle>
          </div>
          <CardDescription>
            The AI assistant would like to perform an action that requires your
            approval.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">{message}</p>
          </div>

          {/* Action Details */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Proposed Action:
            </h4>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Action:</strong> {pendingAction.description}
              </p>
              {pendingAction.parameters?.adType && (
                <p className="text-sm">
                  <strong>Ad Type:</strong> {pendingAction.parameters.adType}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isProcessing ? "Approving..." : "Yes, Continue"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="outline"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isProcessing ? "Rejecting..." : "No, Cancel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
