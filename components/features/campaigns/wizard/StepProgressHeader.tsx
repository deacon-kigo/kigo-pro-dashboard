"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { CheckIcon } from "lucide-react";
import { CAMPAIGN_STEPS } from "@/lib/redux/slices/campaignSlice";
import { Tooltip, TooltipProvider } from "@/components/atoms/Tooltip";

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
  // Function to determine if a step is accessible
  const canAccessStep = (stepIndex: number) => {
    // Allow navigation to any step for purely presentational UI
    return true;
  };

  return (
    <div className={`px-6 py-4 border-b bg-white ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">
          {CAMPAIGN_STEPS[currentStep].title}
        </h2>
        <Badge variant="outline">
          Step {currentStep + 1} of {CAMPAIGN_STEPS.length}
        </Badge>
      </div>

      {/* Step progress bar with indicators */}
      <div className="flex items-center justify-between w-full px-2">
        {CAMPAIGN_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <TooltipProvider>
              <Tooltip
                content={
                  <div>
                    <p>{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                }
              >
                <button
                  onClick={() => canAccessStep(index) && onStepClick(index)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${
                      index < currentStep
                        ? "bg-primary text-primary-foreground"
                        : index === currentStep
                          ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary"
                          : canAccessStep(index)
                            ? "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer"
                            : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                    }
                  `}
                  disabled={!canAccessStep(index)}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                >
                  {index < currentStep ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
              </Tooltip>
            </TooltipProvider>

            {/* Connecting line between steps */}
            {index < CAMPAIGN_STEPS.length - 1 && (
              <div className="relative flex-1 h-1">
                <div className="absolute inset-0 bg-muted rounded-full" />
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300"
                  style={{
                    width:
                      index < currentStep
                        ? "100%"
                        : index === currentStep
                          ? "50%"
                          : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgressHeader;
