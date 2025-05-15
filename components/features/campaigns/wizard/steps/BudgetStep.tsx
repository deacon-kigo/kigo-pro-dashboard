"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { CampaignBudget } from "@/lib/redux/slices/campaignSlice";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Handler for toggling no maximum budget
  const handleNoMaxBudgetChange = (checked: boolean) => {
    updateBudget({
      noMaxBudget: checked,
    });
  };

  // Validate the form whenever data changes
  useEffect(() => {
    // Always set as valid for purely presentational UI
    setStepValidation(true);
  }, [setStepValidation]);

  // Set default budget on initial render if not set
  useEffect(() => {
    if (formData.maxBudget === 0 && !formData.noMaxBudget) {
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

          {!formData.noMaxBudget && (
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
                    disabled={formData.noMaxBudget}
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
                    disabled={formData.noMaxBudget}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="no-max-budget"
              checked={formData.noMaxBudget}
              onCheckedChange={handleNoMaxBudgetChange}
            />
            <Label htmlFor="no-max-budget" className="text-sm cursor-pointer">
              No maximum budget (campaign runs without spending limit)
            </Label>
          </div>

          {formData.noMaxBudget && (
            <p className="text-xs text-amber-600 mt-2">
              Warning: Your campaign will run without a spending limit. You can
              change this setting later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
