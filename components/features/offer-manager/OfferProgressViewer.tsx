"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { OfferStep } from "./types";

interface OfferProgressViewerProps {
  steps: OfferStep[];
}

export default function OfferProgressViewer({
  steps,
}: OfferProgressViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  // Calculate progress
  const activeStep = steps.find((s) => s.status === "running");
  const completedCount = steps.filter((s) => s.status === "complete").length;
  const totalCount = steps.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
      {/* Collapsed Header - Always Visible (Perplexity Pattern) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Animated Icon */}
          {activeStep ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          )}

          {/* Status Text */}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {activeStep ? activeStep.description : "All steps complete"}
            </p>
            <p className="text-xs text-gray-500">
              {completedCount} of {totalCount} steps • {progress}% complete
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content - Shows All Steps */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
          <div className="mt-4 space-y-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                {/* Step Icon Column */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "complete"
                        ? "bg-green-600"
                        : step.status === "running"
                          ? "bg-blue-600"
                          : "bg-gray-300"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    ) : step.status === "running" ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {step.description}
                  </p>

                  {/* Latest Update */}
                  {step.updates && step.updates.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {step.updates[step.updates.length - 1]}
                    </p>
                  )}

                  {/* Show all updates when expanded (only for active step) */}
                  {step.status === "running" &&
                    step.updates &&
                    step.updates.length > 1 && (
                      <div className="mt-2 pl-3 border-l-2 border-blue-200 space-y-1">
                        {step.updates.slice(0, -1).map((update, idx) => (
                          <p key={idx} className="text-xs text-gray-500">
                            {update}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
