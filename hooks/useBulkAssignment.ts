"use client";

import { useState, useCallback, useRef } from "react";
import { AssignmentItem } from "@/components/features/campaigns/product-filters/BulkAssignmentProgress";

export interface BulkAssignmentHookProps {
  onAssignmentComplete?: (results: {
    successful: AssignmentItem[];
    failed: AssignmentItem[];
  }) => void;
  onProgressUpdate?: (current: number, total: number) => void;
}

export interface AssignmentRequest {
  filterId: string;
  items: AssignmentItem[];
  batchSize?: number;
  delayBetweenBatches?: number;
}

export function useBulkAssignment({
  onAssignmentComplete,
  onProgressUpdate,
}: BulkAssignmentHookProps = {}) {
  const [items, setItems] = useState<AssignmentItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Simulate API call for a single assignment
  const assignFilterToItem = async (
    filterId: string,
    item: AssignmentItem,
    signal: AbortSignal
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay - make it longer for testing
    const delay = Math.random() * 2000 + 2000; // 2-4 seconds
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Check if operation was aborted
    if (signal.aborted) {
      throw new Error("Assignment was cancelled");
    }

    // Simulate random failures (20% failure rate for testing)
    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      const errors = [
        "Network timeout occurred",
        "Item is already assigned to another filter",
        "Insufficient permissions",
        "Item configuration is invalid",
        "Server error during assignment",
      ];
      return {
        success: false,
        error: errors[Math.floor(Math.random() * errors.length)],
      };
    }

    return { success: true };
  };

  // Process assignments in batches with progress tracking
  const startAssignment = useCallback(
    async ({
      filterId,
      items: assignmentItems,
      batchSize = 2, // Smaller batches for more visible progress
      delayBetweenBatches = 1000, // Longer delay for testing
    }: AssignmentRequest) => {
      if (isProcessing) {
        throw new Error("Assignment already in progress");
      }

      setIsProcessing(true);
      setProgress({ current: 0, total: assignmentItems.length });

      // Initialize all items as pending
      const initialItems = assignmentItems.map((item) => ({
        ...item,
        status: "pending" as const,
      }));
      setItems(initialItems);

      // Create abort controller for this assignment
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        let processedCount = 0;
        const results: {
          successful: AssignmentItem[];
          failed: AssignmentItem[];
        } = {
          successful: [],
          failed: [],
        };

        // Process items in batches
        for (let i = 0; i < assignmentItems.length; i += batchSize) {
          if (signal.aborted) break;

          const batch = assignmentItems.slice(i, i + batchSize);

          // Add a small delay to show pending state, then transition to processing
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Update items to processing state
          setItems((prev) =>
            prev.map((item) => {
              if (batch.some((batchItem) => batchItem.id === item.id)) {
                return { ...item, status: "processing" as const };
              }
              return item;
            })
          );

          // Process batch concurrently
          const batchPromises = batch.map(async (item) => {
            try {
              const result = await assignFilterToItem(filterId, item, signal);

              if (result.success) {
                results.successful.push(item);
                return { ...item, status: "success" as const };
              } else {
                results.failed.push(item);
                return {
                  ...item,
                  status: "failed" as const,
                  error: result.error,
                };
              }
            } catch (error) {
              if (signal.aborted) {
                return { ...item, status: "pending" as const };
              }
              results.failed.push(item);
              return {
                ...item,
                status: "failed" as const,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);

          // Update items with results
          setItems((prev) =>
            prev.map((item) => {
              const result = batchResults.find((r) => r.id === item.id);
              return result || item;
            })
          );

          processedCount += batch.length;
          setProgress({
            current: processedCount,
            total: assignmentItems.length,
          });
          onProgressUpdate?.(processedCount, assignmentItems.length);

          // Add delay between batches (except for the last batch)
          if (i + batchSize < assignmentItems.length && !signal.aborted) {
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenBatches)
            );
          }
        }

        if (!signal.aborted) {
          onAssignmentComplete?.(results);
        }
      } catch (error) {
        console.error("Bulk assignment failed:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        abortControllerRef.current = null;
      }
    },
    [isProcessing, onAssignmentComplete, onProgressUpdate]
  );

  // Retry failed assignments only
  const retryFailed = useCallback(
    async (filterId: string) => {
      const failedItems = items.filter((item) => item.status === "failed");

      if (failedItems.length === 0) {
        return;
      }

      // Reset failed items to pending
      setItems((prev) =>
        prev.map((item) =>
          item.status === "failed"
            ? { ...item, status: "pending", error: undefined }
            : item
        )
      );

      await startAssignment({
        filterId,
        items: failedItems,
        batchSize: 2, // Smaller batch size for retries
        delayBetweenBatches: 750, // Slightly longer delay for retries
      });
    },
    [items, startAssignment]
  );

  // Cancel ongoing assignment
  const cancelAssignment = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Reset the assignment state
  const resetAssignment = useCallback(() => {
    if (isProcessing) {
      cancelAssignment();
    }
    setItems([]);
    setProgress({ current: 0, total: 0 });
  }, [isProcessing, cancelAssignment]);

  // Get assignment statistics
  const getStats = useCallback(() => {
    const total = items.length;
    const successful = items.filter((item) => item.status === "success").length;
    const failed = items.filter((item) => item.status === "failed").length;
    const processing = items.filter(
      (item) => item.status === "processing"
    ).length;
    const pending = items.filter((item) => item.status === "pending").length;
    const completed = successful + failed;

    return {
      total,
      successful,
      failed,
      processing,
      pending,
      completed,
      progressPercentage: total > 0 ? (completed / total) * 100 : 0,
      isCompleted: completed === total && total > 0,
    };
  }, [items]);

  return {
    items,
    isProcessing,
    progress,
    startAssignment,
    retryFailed,
    cancelAssignment,
    resetAssignment,
    getStats,
  };
}
