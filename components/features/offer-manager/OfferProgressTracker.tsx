"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface Step {
  id: string;
  name: string;
  description: string;
}

interface OfferProgressTrackerProps {
  currentStep: string;
  progress: number;
}

const WORKFLOW_STEPS: Step[] = [
  {
    id: "goal_setting",
    name: "Goal Setting",
    description: "Define objectives",
  },
  {
    id: "offer_creation",
    name: "Offer Design",
    description: "AI recommendations",
  },
  {
    id: "campaign_setup",
    name: "Campaign Setup",
    description: "Targeting & delivery",
  },
  {
    id: "validation",
    name: "Validation",
    description: "Compliance check",
  },
  {
    id: "approval",
    name: "Approval",
    description: "Final review",
  },
];

export default function OfferProgressTracker({
  currentStep,
  progress,
}: OfferProgressTrackerProps) {
  const currentStepIndex = WORKFLOW_STEPS.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-200">
          <SparklesIcon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Offer Creation Progress
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {WORKFLOW_STEPS[currentStepIndex]?.name || "Initializing"}
          </span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

        <div className="flex justify-between items-start">
          {WORKFLOW_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 first:items-start last:items-end"
              >
                {/* Step Icon */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-all
                    ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600"
                        : isCurrent
                          ? "bg-white border-blue-600 ring-4 ring-blue-100"
                          : "bg-white border-gray-300"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  ) : isCurrent ? (
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <span className="text-sm font-medium text-gray-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step Label */}
                <div className="text-center max-w-[80px]">
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-gray-900"
                          : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-[10px] text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
