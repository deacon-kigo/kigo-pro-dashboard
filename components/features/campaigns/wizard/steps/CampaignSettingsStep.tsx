"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CampaignTargeting,
  CampaignDistribution,
  CampaignBudget,
} from "@/lib/redux/slices/campaignSlice";
import TargetingForm from "./targeting/TargetingForm";
import DistributionForm from "./distribution/DistributionForm";
import BudgetForm from "./budget/BudgetForm";

interface CampaignSettingsStepProps {
  formData: {
    targeting: CampaignTargeting;
    distribution: CampaignDistribution;
    budget: CampaignBudget;
  };
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

const CampaignSettingsStep: React.FC<CampaignSettingsStepProps> = ({
  formData,
  updateTargeting,
  updateDistribution,
  updateBudget,
  addLocation,
  removeLocation,
  setStepValidation,
}) => {
  const [activeTab, setActiveTab] = useState("targeting");

  // Set this step as always valid for presentational UI
  React.useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="targeting"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="targeting" className="space-y-4">
          <TargetingForm
            formData={formData.targeting}
            updateTargeting={updateTargeting}
            addLocation={addLocation}
            removeLocation={removeLocation}
          />
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setActiveTab("distribution")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Next: Distribution
            </button>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <DistributionForm
            formData={formData.distribution}
            updateDistribution={updateDistribution}
          />
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setActiveTab("targeting")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back to Targeting
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Next: Budget
            </button>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetForm
            formData={formData.budget}
            updateBudget={updateBudget}
            campaignWeight={formData.targeting.campaignWeight}
          />
          <div className="flex justify-start mt-6">
            <button
              onClick={() => setActiveTab("distribution")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back to Distribution
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignSettingsStep;
