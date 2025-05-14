"use client";

import React, { useEffect } from "react";
import TargetingStep from "./TargetingStep";
import DistributionStep from "./DistributionStep";
import BudgetStep from "./BudgetStep";
import {
  CampaignTargeting,
  CampaignDistribution,
  CampaignBudget,
} from "@/lib/redux/slices/campaignSlice";

interface TargetDistributionBudgetStepProps {
  targetingData: CampaignTargeting;
  distributionData: CampaignDistribution;
  budgetData: CampaignBudget;
  updateTargeting: (data: Partial<CampaignTargeting>) => void;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  addLocation: (location: {
    id: string;
    type: "state" | "msa" | "zipcode";
    value: string;
  }) => void;
  removeLocation: (id: string) => void;
  setStepValidation: (isValid: boolean) => void;
}

const TargetDistributionBudgetStep: React.FC<
  TargetDistributionBudgetStepProps
> = ({
  targetingData,
  distributionData,
  budgetData,
  updateTargeting,
  updateDistribution,
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
      <div>
        <h4 className="font-medium mb-4 pb-1 border-b">Campaign Duration</h4>
        <TargetingStep
          formData={targetingData}
          updateTargeting={updateTargeting}
          addLocation={addLocation}
          removeLocation={removeLocation}
          setStepValidation={() => {}}
        />
      </div>

      {/* Distribution Section */}
      <div>
        <h4 className="font-medium mb-4 pb-1 border-b">
          Distribution Channels
        </h4>
        <DistributionStep
          formData={distributionData}
          updateDistribution={updateDistribution}
          setStepValidation={() => {}}
        />
      </div>

      {/* Budget Section */}
      <div>
        <h4 className="font-medium mb-4 pb-1 border-b">Budget Configuration</h4>
        <BudgetStep
          formData={budgetData}
          updateBudget={updateBudget}
          campaignWeight="medium" // Simplified - always use medium
          setStepValidation={() => {}}
        />
      </div>
    </div>
  );
};

export default TargetDistributionBudgetStep;
