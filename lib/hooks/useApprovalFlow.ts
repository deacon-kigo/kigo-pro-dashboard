"use client";

import { useState, useCallback } from "react";

interface PendingApproval {
  isOpen: boolean;
  pendingAction: {
    action_name: string;
    parameters: any;
    description: string;
  } | null;
  message: string;
  threadId: string;
}

export function useApprovalFlow() {
  const [approval, setApproval] = useState<PendingApproval>({
    isOpen: false,
    pendingAction: null,
    message: "",
    threadId: "",
  });

  // Method to manually trigger approval dialog (called by backend response handler)
  const showApproval = useCallback(
    (pendingAction: any, message: string, threadId: string) => {
      setApproval({
        isOpen: true,
        pendingAction,
        message,
        threadId,
      });
    },
    []
  );

  const handleApprove = useCallback(async (threadId: string) => {
    try {
      console.log("[ApprovalFlow] 🟢 Approving action for thread:", threadId);

      const response = await fetch("/api/copilotkit/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thread_id: threadId,
          approval_decision: "approved",
        }),
      });

      if (!response.ok) {
        throw new Error(`Approval failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("[ApprovalFlow] ✅ Approval successful:", result);

      // Execute any actions returned by the backend
      if (result.actions && result.actions.length > 0) {
        // Actions will be processed by the CopilotKit runtime
        console.log("[ApprovalFlow] 🚀 Actions to execute:", result.actions);
      }

      setApproval({
        isOpen: false,
        pendingAction: null,
        message: "",
        threadId: "",
      });
    } catch (error) {
      console.error("[ApprovalFlow] ❌ Approval failed:", error);
      throw error;
    }
  }, []);

  const handleReject = useCallback(async (threadId: string) => {
    try {
      console.log("[ApprovalFlow] 🔴 Rejecting action for thread:", threadId);

      const response = await fetch("/api/copilotkit/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          thread_id: threadId,
          approval_decision: "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error(`Rejection failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("[ApprovalFlow] ✅ Rejection successful:", result);

      setApproval({
        isOpen: false,
        pendingAction: null,
        message: "",
        threadId: "",
      });
    } catch (error) {
      console.error("[ApprovalFlow] ❌ Rejection failed:", error);
      throw error;
    }
  }, []);

  const closeApproval = useCallback(() => {
    setApproval({
      isOpen: false,
      pendingAction: null,
      message: "",
      threadId: "",
    });
  }, []);

  return {
    approval,
    showApproval,
    handleApprove,
    handleReject,
    closeApproval,
  };
}
