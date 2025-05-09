"use client";

import React from "react";
import { CAMPAIGN_STEPS } from "@/lib/redux/slices/campaignSlice";

interface StepProgressHeaderProps {
  currentStep: number;
  stepValidation: { [key: string]: boolean };
  onStepClick: (step: number) => void;
  className?: string;
}

const StepProgressHeader: React.FC<StepProgressHeaderProps> = ({
  currentStep,
  stepValidation,
  onStepClick,
  className = "",
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header - Simple 61px header with step title */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 mr-2 text-primary"
          >
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          <div>
            <h3 className="font-medium">{CAMPAIGN_STEPS[currentStep].title}</h3>
            <p className="text-xs text-muted-foreground">
              {CAMPAIGN_STEPS[currentStep].description}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Step {currentStep + 1} of {CAMPAIGN_STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgressHeader;
