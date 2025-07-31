"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface PendingAction {
  action_name: string;
  parameters: Record<string, any>;
  description: string;
}

interface ApprovalData {
  pendingAction: PendingAction;
  message: string;
  threadId: string;
  timestamp?: string;
}

interface ApprovalWorkflowUIProps {
  className?: string;
}

function ApprovalWorkflowUI({ className }: ApprovalWorkflowUIProps) {
  const [approvalData, setApprovalData] = useState<ApprovalData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Poll for approval requests from the Python backend
  useEffect(() => {
    const checkForApprovals = () => {
      // Check global scope for pending approvals set by the backend
      if (typeof window !== "undefined" && (global as any).pendingApproval) {
        const pending = (global as any).pendingApproval;
        console.log("[ApprovalUI] 🔔 Found pending approval:", pending);
        setApprovalData(pending);
        // Clear the global to prevent duplicate displays
        delete (global as any).pendingApproval;
      }
    };

    // Check immediately and then poll every 1 second
    checkForApprovals();
    const interval = setInterval(checkForApprovals, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleApproval = async (decision: "approved" | "rejected") => {
    if (!approvalData) return;

    setIsProcessing(true);
    console.log(
      `[ApprovalUI] 📝 Sending ${decision} decision for thread:`,
      approvalData.threadId
    );

    try {
      // Send approval decision to Python backend
      const response = await fetch(
        "http://localhost:8000/api/copilotkit/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_id: approvalData.threadId,
            approval_decision: decision,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Approval request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("[ApprovalUI] ✅ Approval processed:", result);

      // Clear the approval UI
      setApprovalData(null);
    } catch (error) {
      console.error("[ApprovalUI] ❌ Error processing approval:", error);
      // TODO: Show error toast to user
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render if no approval is pending
  if (!approvalData) {
    return null;
  }

  const { pendingAction, message } = approvalData;

  return (
    <div className={`fixed bottom-4 right-4 z-[10000] max-w-md ${className}`}>
      <Card className="border-orange-200 bg-orange-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg text-orange-800">
              Action Approval Required
            </CardTitle>
          </div>
          <Badge variant="secondary" className="w-fit">
            <Clock className="mr-1 h-3 w-3" />
            Waiting for approval
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* AI Message */}
          <div className="rounded-md bg-white p-3 text-sm">
            <p className="text-gray-700">{message}</p>
          </div>

          {/* Action Details */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Action Details:</h4>
            <div className="rounded-md bg-white p-3 text-sm">
              <p>
                <span className="font-medium">Action:</span>{" "}
                {pendingAction.action_name}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {pendingAction.description}
              </p>

              {/* Parameters */}
              {Object.keys(pendingAction.parameters).length > 0 && (
                <div className="mt-2">
                  <span className="font-medium">Parameters:</span>
                  <ul className="ml-4 mt-1 list-disc text-xs text-gray-600">
                    {Object.entries(pendingAction.parameters).map(
                      ([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {String(value)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Approval Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleApproval("approved")}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              onClick={() => handleApproval("rejected")}
              disabled={isProcessing}
              variant="outline"
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              size="sm"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>

          {isProcessing && (
            <div className="text-center text-sm text-gray-600">
              Processing your decision...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ApprovalWorkflowUI;
