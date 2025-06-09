import { useState, useCallback } from "react";

// Define bulk assignment status
export type BulkAssignmentStatus = "idle" | "assigning" | "success" | "failed";

interface UseAssignmentWorkflowOptions {
  onAssignmentComplete?: (selectedIds: string[], success: boolean) => void;
}

export function useAssignmentWorkflow(
  options: UseAssignmentWorkflowOptions = {}
) {
  const [bulkAssignmentStatus, setBulkAssignmentStatus] =
    useState<BulkAssignmentStatus>("idle");
  const [currentAssignmentIds, setCurrentAssignmentIds] = useState<string[]>(
    []
  );
  const [attemptCount, setAttemptCount] = useState(0);

  // Mock bulk assignment process with predictable demo flow
  const startBulkAssignment = useCallback(
    async (selectedIds: string[], totalCount: number) => {
      const currentAttempt = attemptCount + 1;
      setAttemptCount(currentAttempt);

      console.log(
        "🚀 Starting bulk assignment (PATCH only - filter already created):",
        {
          selectedIds,
          totalCount,
          attempt: currentAttempt,
        }
      );

      setBulkAssignmentStatus("assigning");
      setCurrentAssignmentIds(selectedIds);

      try {
        // Mock PATCH request to bulk assign (filter was already created via POST)
        console.log(
          "📤 PATCH /api/filters/bulk-assign - Assigning to programs..."
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Demo flow: First attempt fails, retry succeeds
        const success = currentAttempt > 1;

        if (success) {
          setBulkAssignmentStatus("success");
          console.log(
            "✅ Bulk assignment completed successfully (retry succeeded)"
          );
          options.onAssignmentComplete?.(selectedIds, true);
        } else {
          setBulkAssignmentStatus("failed");
          console.log("❌ Bulk assignment failed (demonstrating retry flow)");
          options.onAssignmentComplete?.(selectedIds, false);
        }
      } catch (error) {
        console.error("💥 Bulk assignment error:", error);
        setBulkAssignmentStatus("failed");
        options.onAssignmentComplete?.(selectedIds, false);
      }
    },
    [options, attemptCount]
  );

  // Handle retry for failed assignments
  const retryAssignment = useCallback(() => {
    if (currentAssignmentIds.length > 0) {
      startBulkAssignment(currentAssignmentIds, currentAssignmentIds.length);
    }
  }, [currentAssignmentIds, startBulkAssignment]);

  // Reset assignment state
  const resetAssignment = useCallback(() => {
    setBulkAssignmentStatus("idle");
    setCurrentAssignmentIds([]);
    setAttemptCount(0);
  }, []);

  return {
    bulkAssignmentStatus,
    currentAssignmentIds,
    startBulkAssignment,
    retryAssignment,
    resetAssignment,
    isAssigning: bulkAssignmentStatus === "assigning",
    isSuccess: bulkAssignmentStatus === "success",
    isFailed: bulkAssignmentStatus === "failed",
  };
}
