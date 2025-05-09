"use client";

import React from "react";
import { Button } from "@/components/atoms/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { CAMPAIGN_STEPS } from "@/lib/redux/slices/campaignSlice";

interface StepNavigationFooterProps {
  currentStep: number;
  isNextDisabled: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
  className?: string;
}

const StepNavigationFooter: React.FC<StepNavigationFooterProps> = ({
  currentStep,
  isNextDisabled,
  onNext,
  onPrevious,
  onSaveDraft,
  className = "",
}) => {
  const isLastStep = currentStep === CAMPAIGN_STEPS.length - 1;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-t bg-muted/10 h-[61px] flex-shrink-0 shadow-md ${className}`}
    >
      <div>
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            size="sm"
            className="gap-1"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onSaveDraft} size="sm">
          Save as Draft
        </Button>

        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          size="sm"
          className="gap-1"
        >
          {isLastStep ? "Create Campaign" : "Next"}
          {!isLastStep && <ArrowRightIcon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default StepNavigationFooter;
