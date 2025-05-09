"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { CampaignBudget } from "@/lib/redux/slices/campaignSlice";
import { Slider } from "@/components/ui/slider";

interface BudgetStepProps {
  formData: CampaignBudget;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  campaignWeight: "small" | "medium" | "large";
  setStepValidation: (isValid: boolean) => void;
}

const BudgetStep: React.FC<BudgetStepProps> = ({
  formData,
  updateBudget,
  campaignWeight,
  setStepValidation,
}) => {
  // Get the estimated reach based on campaign weight
  const getEstimatedReach = () => {
    switch (campaignWeight) {
      case "small":
        return 50000;
      case "medium":
        return 100000;
      case "large":
        return 200000;
      default:
        return 0;
    }
  };

  // Get recommended budget range based on campaign weight
  const getBudgetRange = () => {
    switch (campaignWeight) {
      case "small":
        return { min: 1000, max: 5000, default: 2500 };
      case "medium":
        return { min: 5000, max: 15000, default: 10000 };
      case "large":
        return { min: 15000, max: 30000, default: 20000 };
      default:
        return { min: 1000, max: 30000, default: 10000 };
    }
  };

  const budgetRange = getBudgetRange();
  const estimatedReach = getEstimatedReach();

  // Handle budget change from slider
  const handleBudgetSliderChange = (value: number[]) => {
    updateBudget({ maxBudget: value[0] });
  };

  // Handle budget change from input
  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    // Clamp the value to the range
    const clampedValue = Math.min(
      Math.max(value, budgetRange.min),
      budgetRange.max
    );
    updateBudget({ maxBudget: clampedValue });
  };

  // Calculate impressions per dollar
  const impressionsPerDollar = estimatedReach / (formData.maxBudget || 1);

  // Calculate estimated cost per click (CPC)
  const estimatedCPC = (formData.maxBudget || 1) / (estimatedReach * 0.02); // Assuming 2% click rate

  // Validate the form whenever data changes
  useEffect(() => {
    // Always set as valid for purely presentational UI
    setStepValidation(true);

    // Don't automatically update the budget with estimated reach to avoid loops
  }, [setStepValidation]);

  // Set default budget on initial render if not set
  useEffect(() => {
    if (formData.maxBudget === 0) {
      updateBudget({ maxBudget: budgetRange.default });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Budget Slider */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Maximum Budget*</h4>
          <p className="text-sm text-muted-foreground">
            Set the maximum amount you're willing to spend on this campaign.
          </p>

          <div className="mt-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-full">
                <Slider
                  max={budgetRange.max}
                  min={budgetRange.min}
                  step={100}
                  value={[formData.maxBudget || budgetRange.default]}
                  onValueChange={handleBudgetSliderChange}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>${budgetRange.min.toLocaleString()}</span>
                  <span>${budgetRange.max.toLocaleString()}</span>
                </div>
              </div>

              <div className="w-32">
                <Label htmlFor="budget-input">Budget ($)</Label>
                <Input
                  id="budget-input"
                  type="number"
                  min={budgetRange.min}
                  max={budgetRange.max}
                  value={formData.maxBudget || ""}
                  onChange={handleBudgetInputChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Metrics */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Estimated Performance Metrics</h4>
          <p className="text-sm text-muted-foreground">
            Based on your campaign weight and budget.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-md">
              <h5 className="text-sm font-medium text-blue-700">
                Estimated Reach
              </h5>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {estimatedReach.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Unique impressions</p>
            </div>

            <div className="p-4 bg-green-50 rounded-md">
              <h5 className="text-sm font-medium text-green-700">
                Impressions/Dollar
              </h5>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {Math.round(impressionsPerDollar).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Impressions per $1 spent
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-md">
              <h5 className="text-sm font-medium text-purple-700">
                Estimated CPC
              </h5>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                ${estimatedCPC.toFixed(2)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Cost per click (avg.)
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Note: These are estimates based on historical data. Actual
            performance may vary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
