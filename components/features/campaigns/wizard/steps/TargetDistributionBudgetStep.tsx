"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TargetingStep from "./TargetingStep";
import DistributionStep from "./DistributionStep";
import BudgetStep from "./BudgetStep";
import { CampaignTargeting, CampaignDistribution, CampaignBudget } from "@/lib/redux/slices/campaignSlice";

interface TargetDistributionBudgetStepProps {
  targetingData: CampaignTargeting;
  distributionData: CampaignDistribution;
  budgetData: CampaignBudget;
  updateTargeting: (data: Partial<CampaignTargeting>) => void;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
  updateBudget: (data: Partial<CampaignBudget>) => void;
  addLocation: (location: { id: string; type: "state" | "msa" | "zipcode"; value: string; }) => void;
  removeLocation: (id: string) => void;
  setStepValidation: (isValid: boolean) => void;
}

const TargetDistributionBudgetStep: React.FC<TargetDistributionBudgetStepProps> = ({
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
  const [activeTab, setActiveTab] = useState("targeting");
  
  // Set the step as valid when mounted
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="targeting" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="targeting">Target Audience</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="targeting" className="mt-0">
          <TargetingStep
            formData={targetingData}
            updateTargeting={updateTargeting}
            addLocation={addLocation}
            removeLocation={removeLocation}
            setStepValidation={() => {}} // Individual validation is no longer needed
          />
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-0">
          <DistributionStep
            formData={distributionData}
            updateDistribution={updateDistribution}
            setStepValidation={() => {}} // Individual validation is no longer needed
          />
        </TabsContent>
        
        <TabsContent value="budget" className="mt-0">
          <BudgetStep
            formData={budgetData}
            updateBudget={updateBudget}
            campaignWeight={targetingData.campaignWeight}
            setStepValidation={() => {}} // Individual validation is no longer needed
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setActiveTab("targeting")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === "targeting" ? "bg-gray-100" : "text-muted-foreground"
          }`}
        >
          Target Audience
        </button>
        <button
          onClick={() => setActiveTab("distribution")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === "distribution" ? "bg-gray-100" : "text-muted-foreground"
          }`}
        >
          Distribution
        </button>
        <button
          onClick={() => setActiveTab("budget")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === "budget" ? "bg-gray-100" : "text-muted-foreground"
          }`}
        >
          Budget
        </button>
      </div>
    </div>
  );
};

export default TargetDistributionBudgetStep; 