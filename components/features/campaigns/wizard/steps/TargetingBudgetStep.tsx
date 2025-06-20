"use client";

import React, { useEffect } from "react";
import TargetingStep from "./TargetingStep";
import BudgetStep from "./BudgetStep";
import {
  CampaignTargeting,
  CampaignBudget,
} from "@/lib/redux/slices/campaignSlice";

interface TargetingBudgetStepProps {
  targetingData: CampaignTargeting;
  budgetData: CampaignBudget;
  updateTargeting: (data: Partial<CampaignTargeting>) => void;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  addLocation: (location: {
    id: string;
    type: "state" | "msa" | "zipcode";
    value: string;
  }) => void;
  removeLocation: (id: string) => void;
  setStepValidation: (isValid: boolean) => void;
}

const TargetingBudgetStep: React.FC<TargetingBudgetStepProps> = ({
  targetingData,
  budgetData,
  updateTargeting,
  updateBudget,
  addLocation,
  removeLocation,
  setStepValidation,
}) => {
  // Set the step as valid when mounted
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  return (
    <div className="space-y-8">
      {/* Target Section */}
      <TargetingStep
        formData={targetingData}
        updateTargeting={updateTargeting}
        addLocation={addLocation}
        removeLocation={removeLocation}
        setStepValidation={() => {}}
      />

      {/* Budget Section */}
      <BudgetStep
        formData={budgetData}
        updateBudget={updateBudget}
        campaignWeight="medium" // Simplified - always use medium
        setStepValidation={() => {}}
      />
    </div>
  );
};

export default TargetingBudgetStep;
