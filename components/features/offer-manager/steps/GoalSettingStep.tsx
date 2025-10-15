"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface GoalSettingStepProps {
  formData: {
    businessObjective: string;
    programType: string;
    targetAudience: string[];
    maxDiscount: string;
    totalBudget: string;
    startDate: string;
    endDate: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onAskAI: (field: string) => void;
}

export default function GoalSettingStep({
  formData,
  onUpdate,
  onNext,
  onAskAI,
}: GoalSettingStepProps) {
  const handleNext = () => {
    // Basic validation
    if (!formData.businessObjective || !formData.programType) {
      alert("Please fill in required fields");
      return;
    }
    onNext();
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step 1: Goal Setting
        </h2>
        <p className="text-sm text-gray-600">
          Define your business objective and campaign parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Objective */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="businessObjective" className="text-sm font-medium">
              Business Objective <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("businessObjective")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <Input
            id="businessObjective"
            placeholder="Example: Increase Q4 parts sales by 20% through seasonal promotion"
            value={formData.businessObjective}
            onChange={(e) => onUpdate("businessObjective", e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe what you want to achieve with this promotion
          </p>
        </div>

        {/* Program Type */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              Program Type <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("programType")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <div className="space-y-3">
            <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="programType"
                value="john_deere"
                checked={formData.programType === "john_deere"}
                onChange={(e) => onUpdate("programType", e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  John Deere - Closed Loop
                </p>
                <p className="text-xs text-gray-600">
                  Dealer network only, restricted to authorized locations
                </p>
              </div>
            </label>

            <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="programType"
                value="yardi"
                checked={formData.programType === "yardi"}
                onChange={(e) => onUpdate("programType", e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Yardi - Open Loop
                </p>
                <p className="text-xs text-gray-600">
                  Tenant rewards + merchant catalog, flexible redemption
                </p>
              </div>
            </label>

            <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="programType"
                value="general"
                checked={formData.programType === "general"}
                onChange={(e) => onUpdate("programType", e.target.value)}
                className="mt-1 mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  General - Flexible
                </p>
                <p className="text-xs text-gray-600">
                  Custom program configuration, all redemption methods supported
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Target Audience</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("targetAudience")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <div className="space-y-2">
            {[
              { value: "existing", label: "Existing Customers" },
              { value: "new", label: "New Prospects" },
              { value: "lapsed", label: "Lapsed Customers (>90 days)" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.targetAudience.includes(option.value)}
                  onChange={(e) => {
                    const newAudience = e.target.checked
                      ? [...formData.targetAudience, option.value]
                      : formData.targetAudience.filter(
                          (a) => a !== option.value
                        );
                    onUpdate("targetAudience", newAudience);
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Constraints */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="maxDiscount" className="text-sm font-medium">
                Max Discount
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAskAI("budget")}
                className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
              >
                <SparklesIcon className="h-3 w-3 mr-1" />
                Ask AI
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="maxDiscount"
                type="number"
                placeholder="20"
                value={formData.maxDiscount}
                onChange={(e) => onUpdate("maxDiscount", e.target.value)}
                className="flex-1"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>%</option>
                <option>$</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="totalBudget" className="text-sm font-medium mb-2">
              Total Campaign Spend
            </Label>
            <div className="flex gap-2">
              <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                $
              </span>
              <Input
                id="totalBudget"
                type="number"
                placeholder="50000"
                value={formData.totalBudget}
                onChange={(e) => onUpdate("totalBudget", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Timeline</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("timeline")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-xs text-gray-600 mb-1">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => onUpdate("startDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-xs text-gray-600 mb-1">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => onUpdate("endDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" disabled>
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next: Offer Details →
        </Button>
      </div>
    </Card>
  );
}
