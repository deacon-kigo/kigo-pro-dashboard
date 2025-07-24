/**
 * Human-in-the-Loop Hook
 *
 * Scalable approval workflow system inspired by CopilotKit demo-banking.
 * Supports any type of approval process across all Kigo Pro contexts.
 */

import { useCallback, useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { useAppDispatch } from "../redux/hooks";
import { addNotification, setActiveModal } from "../redux/slices/uiSlice";

// Generic approval item interface
export interface ApprovalItem {
  id: string;
  type:
    | "campaign"
    | "ad"
    | "filter"
    | "analytics_action"
    | "merchant_action"
    | "budget_change"
    | "custom";
  title: string;
  description: string;
  data: Record<string, any>;
  status: "pending" | "approved" | "rejected" | "modified";
  context?: Record<string, any>;
  riskLevel?: "low" | "medium" | "high";
  requiresExplanation?: boolean;
  metadata?: Record<string, any>;
}

// Approval decision interface
export interface ApprovalDecision {
  approved: boolean;
  explanation?: string;
  modifications?: Record<string, any>;
  timestamp: string;
}

// Complete approval workflow interface
export interface ApprovalWorkflow {
  id: string;
  title: string;
  description: string;
  items: ApprovalItem[];
  onApprove: (itemId: string, decision: ApprovalDecision) => Promise<void>;
  onReject: (itemId: string, decision: ApprovalDecision) => Promise<void>;
  onModify?: (
    itemId: string,
    modifications: Record<string, any>
  ) => Promise<void>;
  context: {
    workflowType: string;
    currentPage: string;
    userRole: string;
    metadata?: Record<string, any>;
  };
}

export function useHumanInTheLoop() {
  const dispatch = useAppDispatch();
  const [activeWorkflows, setActiveWorkflows] = useState<ApprovalWorkflow[]>(
    []
  );
  const [currentWorkflow, setCurrentWorkflow] =
    useState<ApprovalWorkflow | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Start an approval workflow
  const startApprovalWorkflow = useCallback(
    async (workflow: ApprovalWorkflow) => {
      console.log(
        "[HumanInTheLoop] 🚀 Starting approval workflow:",
        workflow.title
      );

      setActiveWorkflows((prev) => [...prev, workflow]);
      setCurrentWorkflow(workflow);
      setCurrentItemIndex(0);

      // Show notification about new approval request
      dispatch(
        addNotification({
          message: `New approval workflow: ${workflow.title}`,
          type: "info",
        })
      );
    },
    [dispatch]
  );

  // Register CopilotKit action for starting approvals
  useCopilotAction({
    name: "startApprovalWorkflow",
    description:
      "Start a human-in-the-loop approval workflow for any type of action or decision",
    parameters: [
      {
        name: "workflowType",
        type: "string",
        description:
          "Type of workflow (campaign, filter, analytics, merchant, budget, custom)",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Title of the approval workflow",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Description of what needs approval",
        required: true,
      },
      {
        name: "items",
        type: "object",
        description: "Array of items that need approval",
        required: true,
      },
      {
        name: "context",
        type: "string",
        description:
          "Additional context for the approval workflow (JSON string)",
        required: false,
      },
    ],
    handler: async ({
      workflowType,
      title,
      description,
      items,
      context = "{}",
    }) => {
      console.log(
        "[HumanInTheLoop] 🎯 CopilotKit approval workflow requested:",
        { workflowType, title }
      );

      // Parse context from JSON string
      let parsedContext: any = {};
      try {
        parsedContext =
          typeof context === "string" ? JSON.parse(context) : context;
      } catch (e) {
        console.warn(
          "[HumanInTheLoop] Failed to parse context, using empty object"
        );
      }

      // Create approval workflow from CopilotKit parameters
      const workflow: ApprovalWorkflow = {
        id: `workflow_${Date.now()}`,
        title,
        description,
        items: Array.isArray(items) ? items : [items],
        context: {
          workflowType,
          currentPage: parsedContext.currentPage || "unknown",
          userRole: parsedContext.userRole || "user",
          metadata: parsedContext.metadata || {},
        },
        onApprove: async (itemId: string, decision: ApprovalDecision) => {
          console.log("[HumanInTheLoop] ✅ Item approved:", itemId, decision);
          await handleItemApproval(itemId, decision, true);
        },
        onReject: async (itemId: string, decision: ApprovalDecision) => {
          console.log("[HumanInTheLoop] ❌ Item rejected:", itemId, decision);
          await handleItemApproval(itemId, decision, false);
        },
        onModify: async (
          itemId: string,
          modifications: Record<string, any>
        ) => {
          console.log(
            "[HumanInTheLoop] ✏️ Item modified:",
            itemId,
            modifications
          );
          await handleItemModification(itemId, modifications);
        },
      };

      await startApprovalWorkflow(workflow);
      return `Started approval workflow: ${title}. You can now review and approve each item.`;
    },
  });

  // Register CopilotKit action for showing approval interface
  useCopilotAction({
    name: "showApprovalInterface",
    description: "Display the approval interface for pending workflows",
    parameters: [
      {
        name: "workflowId",
        type: "string",
        description:
          "ID of the workflow to show (optional - shows current if not specified)",
        required: false,
      },
    ],
    handler: async ({ workflowId }) => {
      const workflow = workflowId
        ? activeWorkflows.find((w) => w.id === workflowId)
        : currentWorkflow;

      if (!workflow) {
        return "No approval workflows are currently active.";
      }

      // Show approval modal
      dispatch(
        setActiveModal({
          type: "approval_workflow",
          data: {
            workflow,
            currentItemIndex,
            totalItems: workflow.items.length,
          },
        })
      );

      return `Showing approval interface for: ${workflow.title}`;
    },
  });

  // Handle individual item approval/rejection
  const handleItemApproval = async (
    itemId: string,
    decision: ApprovalDecision,
    approved: boolean
  ) => {
    if (!currentWorkflow) return;

    const item = currentWorkflow.items.find((item) => item.id === itemId);
    if (!item) return;

    // Execute the appropriate callback
    if (approved) {
      await currentWorkflow.onApprove(itemId, decision);
    } else {
      await currentWorkflow.onReject(itemId, decision);
    }

    // Move to next item or complete workflow
    const nextIndex = currentItemIndex + 1;
    if (nextIndex < currentWorkflow.items.length) {
      setCurrentItemIndex(nextIndex);
      dispatch(
        addNotification({
          message: `Item ${approved ? "approved" : "rejected"}. Moving to next item...`,
          type: approved ? "success" : "warning",
        })
      );
    } else {
      // Workflow complete
      completeWorkflow(currentWorkflow.id);
    }
  };

  // Handle item modification
  const handleItemModification = async (
    itemId: string,
    modifications: Record<string, any>
  ) => {
    if (!currentWorkflow?.onModify) return;

    await currentWorkflow.onModify(itemId, modifications);

    dispatch(
      addNotification({
        message: "Item modified successfully",
        type: "info",
      })
    );
  };

  // Complete an approval workflow
  const completeWorkflow = (workflowId: string) => {
    setActiveWorkflows((prev) => prev.filter((w) => w.id !== workflowId));

    if (currentWorkflow?.id === workflowId) {
      setCurrentWorkflow(null);
      setCurrentItemIndex(0);
    }

    dispatch(
      addNotification({
        message: "Approval workflow completed!",
        type: "success",
      })
    );

    // Close approval modal if open
    dispatch(setActiveModal({ type: "", data: {} }));
  };

  // Get current approval context for CopilotKit
  const getCurrentApprovalContext = () => {
    if (!currentWorkflow) return null;

    const currentItem = currentWorkflow.items[currentItemIndex];
    return {
      workflow: {
        id: currentWorkflow.id,
        title: currentWorkflow.title,
        description: currentWorkflow.description,
        type: currentWorkflow.context.workflowType,
      },
      currentItem: currentItem
        ? {
            id: currentItem.id,
            type: currentItem.type,
            title: currentItem.title,
            description: currentItem.description,
            riskLevel: currentItem.riskLevel,
            requiresExplanation: currentItem.requiresExplanation,
          }
        : null,
      progress: {
        current: currentItemIndex + 1,
        total: currentWorkflow.items.length,
        percentage: Math.round(
          ((currentItemIndex + 1) / currentWorkflow.items.length) * 100
        ),
      },
    };
  };

  // Helper methods for item actions
  const approveItem = useCallback(
    async (itemId: string) => {
      if (!currentWorkflow) return;

      const item = currentWorkflow.items.find((i) => i.id === itemId);
      if (!item) return;

      // Update item status
      setCurrentWorkflow((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === itemId ? { ...i, status: "approved" } : i
              ),
            }
          : null
      );

      // Move to next item
      if (currentItemIndex < currentWorkflow.items.length - 1) {
        setCurrentItemIndex((prev) => prev + 1);
      }

      await currentWorkflow.onApprove(itemId, {
        approved: true,
        timestamp: new Date().toISOString(),
      });
    },
    [currentWorkflow, currentItemIndex]
  );

  const rejectItem = useCallback(
    async (itemId: string, explanation?: string) => {
      if (!currentWorkflow) return;

      setCurrentWorkflow((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === itemId ? { ...i, status: "rejected" } : i
              ),
            }
          : null
      );

      await currentWorkflow.onReject(itemId, {
        approved: false,
        explanation,
        timestamp: new Date().toISOString(),
      });
    },
    [currentWorkflow]
  );

  const modifyItem = useCallback(
    async (itemId: string, modifications: Record<string, any>) => {
      if (!currentWorkflow || !currentWorkflow.onModify) return;

      setCurrentWorkflow((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((i) =>
                i.id === itemId
                  ? {
                      ...i,
                      status: "modified",
                      data: { ...i.data, ...modifications },
                    }
                  : i
              ),
            }
          : null
      );

      await currentWorkflow.onModify(itemId, modifications);
    },
    [currentWorkflow]
  );

  const cancelWorkflow = useCallback(
    (workflowId: string) => {
      setActiveWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
      if (currentWorkflow?.id === workflowId) {
        setCurrentWorkflow(null);
        setCurrentItemIndex(0);
      }
    },
    [currentWorkflow]
  );

  return {
    // State
    activeWorkflows,
    currentWorkflow,
    currentItemIndex,

    // Actions
    startApprovalWorkflow,
    handleItemApproval,
    handleItemModification,
    completeWorkflow,
    approveItem,
    rejectItem,
    modifyItem,
    cancelWorkflow,

    // Utils
    getCurrentApprovalContext,
    hasActiveWorkflows: activeWorkflows.length > 0,
    canProceed:
      currentWorkflow && currentItemIndex < currentWorkflow.items.length,
  };
}
