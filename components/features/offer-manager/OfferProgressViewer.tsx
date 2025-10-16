"use client";

/**
 * OfferProgressViewer - Perplexity-style expandable progress viewer
 * Shows AI thinking steps in real-time with collapsible sections
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Types matching backend OfferStep
export interface OfferStep {
  id: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
  type: string;
  updates: string[];
  result?: Record<string, any>;
  metadata?: {
    start_time?: string;
    end_time?: string;
  };
}

interface OfferProgressViewerProps {
  steps: OfferStep[];
  className?: string;
  defaultCollapsed?: boolean;
}

const StepStatusIcon: React.FC<{ status: OfferStep["status"] }> = ({
  status,
}) => {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />;
    case "running":
      return (
        <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
      );
    case "error":
      return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
    case "pending":
      return <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />;
  }
};

const OfferStepItem: React.FC<{
  step: OfferStep;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ step, isExpanded, onToggle }) => {
  const hasUpdates = step.updates && step.updates.length > 0;
  const hasResult = step.result && Object.keys(step.result).length > 0;

  return (
    <div
      className={cn(
        "border-l-2 pl-4 py-3 transition-all",
        step.status === "complete" && "border-green-500/30",
        step.status === "running" && "border-blue-500",
        step.status === "error" && "border-red-500/30",
        step.status === "pending" && "border-gray-300"
      )}
    >
      <button
        onClick={onToggle}
        className="flex items-start gap-3 w-full text-left hover:opacity-80 transition-opacity"
      >
        <StepStatusIcon status={step.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium text-sm",
                step.status === "complete" && "text-gray-700",
                step.status === "running" && "text-blue-700",
                step.status === "error" && "text-red-700",
                step.status === "pending" && "text-gray-500"
              )}
            >
              {step.description}
            </span>
          </div>
          {step.status === "running" && step.updates.length > 0 && (
            <p className="text-xs text-gray-600 mt-1 animate-pulse">
              {step.updates[step.updates.length - 1]}
            </p>
          )}
        </div>
        {(hasUpdates || hasResult) && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (hasUpdates || hasResult) && (
        <div className="mt-3 ml-7 space-y-2">
          {/* Show all updates */}
          {hasUpdates && (
            <div className="space-y-1">
              {step.updates.map((update, idx) => (
                <div
                  key={`${step.id}-update-${idx}`}
                  className={cn(
                    "text-xs py-1 px-2 rounded bg-gray-50 text-gray-600",
                    idx === step.updates.length - 1 &&
                      step.status === "running" &&
                      "animate-pulse"
                  )}
                >
                  {update}
                </div>
              ))}
            </div>
          )}

          {/* Show result if complete */}
          {hasResult && step.status === "complete" && (
            <div className="text-xs bg-green-50 border border-green-200 rounded p-2">
              <p className="font-medium text-green-800 mb-1">Result:</p>
              <pre className="text-green-700 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(step.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Show duration if available */}
          {step.metadata?.start_time && step.metadata?.end_time && (
            <div className="text-xs text-gray-500">
              Duration:{" "}
              {Math.round(
                (new Date(step.metadata.end_time).getTime() -
                  new Date(step.metadata.start_time).getTime()) /
                  1000
              )}
              s
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const OfferProgressViewer: React.FC<OfferProgressViewerProps> = ({
  steps,
  className,
  defaultCollapsed = false,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    new Set(
      defaultCollapsed
        ? []
        : steps.filter((s) => s.status === "running").map((s) => s.id)
    )
  );

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  // Auto-expand running steps
  React.useEffect(() => {
    const runningStep = steps.find((s) => s.status === "running");
    if (runningStep && !defaultCollapsed) {
      setExpandedSteps((prev) => new Set([...prev, runningStep.id]));
    }
  }, [steps, defaultCollapsed]);

  if (!steps || steps.length === 0) {
    return null;
  }

  const completedCount = steps.filter((s) => s.status === "complete").length;
  const totalCount = steps.length;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="pt-4 pb-3 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">AI Progress</h3>
          <span className="text-xs text-gray-500">
            {completedCount} of {totalCount} steps
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Steps list */}
        <div className="space-y-0">
          {steps.map((step) => (
            <OfferStepItem
              key={step.id}
              step={step}
              isExpanded={expandedSteps.has(step.id)}
              onToggle={() => toggleStep(step.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferProgressViewer;
