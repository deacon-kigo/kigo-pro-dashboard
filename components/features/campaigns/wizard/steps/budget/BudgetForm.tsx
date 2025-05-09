"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";
import { CampaignBudget } from "@/lib/redux/slices/campaignSlice";
import { Slider } from "@/components/atoms/Slider";

interface BudgetFormProps {
  formData: CampaignBudget;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  campaignWeight: "small" | "medium" | "large";
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  formData,
  updateBudget,
  campaignWeight,
}) => {
  const [budget, setBudget] = useState(formData.maxBudget || 0);

  // Calculate reach estimates based on budget and campaign weight
  useEffect(() => {
    // Calculate estimated reach based on budget and weight
    let baseReachPerDollar = 20; // Base reach per dollar

    // Adjust based on campaign weight
    switch (campaignWeight) {
      case "small":
        baseReachPerDollar = 15;
        break;
      case "medium":
        baseReachPerDollar = 20;
        break;
      case "large":
        baseReachPerDollar = 25;
        break;
    }

    // Calculate estimated reach
    const estimatedReach = Math.round(budget * baseReachPerDollar);
    updateBudget({ maxBudget: budget, estimatedReach });
  }, [budget, campaignWeight, updateBudget]);

  // Handle budget changes
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBudget(value);
    }
  };

  // Handle slider changes
  const handleSliderChange = (value: number[]) => {
    setBudget(value[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set your campaign budget and review projected metrics
        </p>
      </div>

      {/* Budget Input */}
      <div className="space-y-3">
        <Label htmlFor="budget">Maximum Budget (USD)*</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              min={0}
              step={100}
              className="pl-7"
            />
          </div>
          <span className="text-sm text-gray-500">USD</span>
        </div>
        <p className="text-xs text-muted-foreground">
          The maximum amount you're willing to spend on this campaign
        </p>
      </div>

      {/* Budget Slider */}
      <div className="space-y-3">
        <div className="pt-6 pb-2">
          <Slider
            defaultValue={[budget]}
            max={10000}
            step={100}
            onValueChange={handleSliderChange}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$5,000</span>
          <span>$10,000</span>
        </div>
      </div>

      {/* Projected Metrics */}
      <div className="mt-6 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-3">Projected Campaign Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Reach</p>
            <p className="font-medium text-lg">
              {formData.estimatedReach?.toLocaleString() || "0"} impressions
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cost per Impression</p>
            <p className="font-medium text-lg">
              $
              {formData.estimatedReach && formData.estimatedReach > 0
                ? (budget / formData.estimatedReach).toFixed(4)
                : "0.0000"}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Recommendations */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
        <h4 className="font-medium text-blue-800 mb-2">
          Budget Recommendations
        </h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs">✓</span>
            </div>
            <span>
              Based on your campaign settings, a budget of $
              {(formData.estimatedReach || 0) > 50000 ? "5,000" : "2,500"} is
              recommended for optimal performance.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs">i</span>
            </div>
            <span>
              Consider setting a higher budget for "{campaignWeight}" weight
              campaigns to maximize reach and effectiveness.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetForm;
