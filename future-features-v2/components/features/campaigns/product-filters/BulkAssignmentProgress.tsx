"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress/Progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssignmentItem {
  id: string;
  name: string;
  type: "partner" | "program" | "promotedProgram";
  parentName?: string;
  status: "pending" | "processing" | "success" | "failed";
  error?: string;
}

export interface BulkAssignmentProgressProps {
  isOpen: boolean;
  onClose: () => void;
  filterId: string;
  filterName: string;
  items: AssignmentItem[];
  onStartAssignment: () => Promise<void>;
  onRetryFailed?: () => Promise<void>;
}

export function BulkAssignmentProgress({
  isOpen,
  onClose,
  filterId,
  filterName,
  items,
  onStartAssignment,
  onRetryFailed,
}: BulkAssignmentProgressProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Calculate progress stats
  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.status === "success" || item.status === "failed"
  ).length;
  const successfulItems = items.filter(
    (item) => item.status === "success"
  ).length;
  const failedItems = items.filter((item) => item.status === "failed").length;
  const processingItems = items.filter(
    (item) => item.status === "processing"
  ).length;
  const pendingItems = items.filter((item) => item.status === "pending").length;

  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isCompleted = completedItems === totalItems;
  const hasErrors = failedItems > 0;

  // Status icon component
  const StatusIcon = ({ status }: { status: AssignmentItem["status"] }) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Status badge component
  const StatusBadge = ({
    status,
    count,
  }: {
    status: string;
    count: number;
  }) => {
    if (count === 0) return null;

    const variants = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      pending: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={cn("text-xs", variants[status as keyof typeof variants])}
      >
        {count} {status}
      </Badge>
    );
  };

  // Handle starting the assignment process
  const handleStart = async () => {
    setIsProcessing(true);
    setHasStarted(true);
    try {
      await onStartAssignment();
    } catch (error) {
      console.error("Failed to start assignment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle retrying failed assignments
  const handleRetry = async () => {
    if (onRetryFailed) {
      setIsProcessing(true);
      try {
        await onRetryFailed();
      } catch (error) {
        console.error("Failed to retry assignment:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Toggle expanded state for items
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setHasStarted(false);
      setIsProcessing(false);
      setExpandedItems(new Set());
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Bulk Assignment Progress
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Assigning filter "{filterName}" to {totalItems} items
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedItems} of {totalItems} completed
              </span>
            </div>

            <Progress
              value={progressPercentage}
              className="w-full"
              color={
                hasErrors ? "warning" : isCompleted ? "success" : "primary"
              }
              showValue
            />

            {/* Status badges */}
            <div className="flex gap-2 flex-wrap">
              <StatusBadge status="success" count={successfulItems} />
              <StatusBadge status="failed" count={failedItems} />
              <StatusBadge status="processing" count={processingItems} />
              <StatusBadge status="pending" count={pendingItems} />
            </div>
          </div>

          {/* Assignment Items List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Assignment Details
              </h4>
              {items.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (expandedItems.size === items.length) {
                      setExpandedItems(new Set());
                    } else {
                      setExpandedItems(new Set(items.map((item) => item.id)));
                    }
                  }}
                  className="text-xs"
                >
                  {expandedItems.size === items.length
                    ? "Collapse All"
                    : "Expand All"}
                </Button>
              )}
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "border rounded-lg transition-colors",
                  item.status === "success" && "bg-green-50 border-green-200",
                  item.status === "failed" && "bg-red-50 border-red-200",
                  item.status === "processing" && "bg-blue-50 border-blue-200",
                  item.status === "pending" && "bg-gray-50 border-gray-200"
                )}
              >
                <div
                  className="flex items-center p-3 cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <StatusIcon status={item.status} />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    {item.parentName && (
                      <div className="text-xs text-gray-500 mt-1">
                        Under: {item.parentName}
                      </div>
                    )}
                  </div>

                  {item.error && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  )}

                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                {/* Expanded details */}
                {expandedItems.has(item.id) && item.error && (
                  <div className="px-3 pb-3">
                    <div className="bg-red-100 border border-red-200 rounded p-2">
                      <div className="text-xs font-medium text-red-800 mb-1">
                        Error Details:
                      </div>
                      <div className="text-xs text-red-700">{item.error}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-xs text-gray-500">
              {isCompleted
                ? hasErrors
                  ? `Completed with ${failedItems} ${failedItems === 1 ? "error" : "errors"}`
                  : "All assignments completed successfully"
                : hasStarted
                  ? "Assignment in progress..."
                  : "Ready to start assignment"}
            </div>

            <div className="flex gap-2">
              {!hasStarted && (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStart}
                    disabled={isProcessing || totalItems === 0}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      `Start Assignment (${totalItems})`
                    )}
                  </Button>
                </>
              )}

              {hasStarted && isCompleted && (
                <>
                  {hasErrors && onRetryFailed && (
                    <Button
                      variant="outline"
                      onClick={handleRetry}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        `Retry Failed (${failedItems})`
                      )}
                    </Button>
                  )}
                  <Button onClick={onClose}>
                    {hasErrors ? "Close" : "Done"}
                  </Button>
                </>
              )}

              {hasStarted && !isCompleted && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
