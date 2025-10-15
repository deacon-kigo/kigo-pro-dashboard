"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepNavigatorProps {
  currentStep: string;
  completedSteps: string[];
}

const WORKFLOW_STEPS: Step[] = [
  {
    id: "goal_setting",
    title: "Goal Setting",
    description: "Define objectives",
  },
  {
    id: "offer_details",
    title: "Offer Details",
    description: "Configure offer",
  },
  {
    id: "redemption_method",
    title: "Redemption Method",
    description: "How users redeem",
  },
  {
    id: "campaign_setup",
    title: "Campaign Setup",
    description: "Distribution channels",
  },
  {
    id: "review_launch",
    title: "Review & Launch",
    description: "Final approval",
  },
];

export default function StepNavigator({
  currentStep,
  completedSteps,
}: StepNavigatorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Offer Creation Workflow
      </h3>

      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isCurrent
                  ? "bg-blue-50 border border-blue-200"
                  : isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
              }`}
            >
              {/* Step Number/Icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCurrent
                      ? "text-blue-900"
                      : isCompleted
                        ? "text-green-900"
                        : "text-gray-600"
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs ${
                    isCurrent
                      ? "text-blue-700"
                      : isCompleted
                        ? "text-green-700"
                        : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Status Indicator */}
              {isCurrent && (
                <div className="flex-shrink-0">
                  <ClockIcon className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
