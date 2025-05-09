"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { CampaignBasicInfo } from "@/lib/redux/slices/campaignSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";

interface BasicInfoStepProps {
  formData: CampaignBasicInfo;
  updateBasicInfo: (data: Partial<CampaignBasicInfo>) => void;
  setStepValidation: (isValid: boolean) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateBasicInfo,
  setStepValidation,
}) => {
  // Just call setStepValidation(true) once when component is mounted
  React.useEffect(() => {
    // Set this step as always valid for presentational UI
    setStepValidation(true);
  }, [setStepValidation]); // Only depend on setStepValidation to avoid unnecessary re-renders

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="campaign-name">Campaign Name*</Label>
          <Input
            id="campaign-name"
            value={formData.name}
            onChange={(e) => updateBasicInfo({ name: e.target.value })}
            placeholder="Enter campaign name"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Choose a unique and descriptive name (max 50 characters)
          </p>
        </div>

        <div>
          <Label htmlFor="campaign-description">Campaign Description</Label>
          <Textarea
            id="campaign-description"
            value={formData.description}
            onChange={(e) => updateBasicInfo({ description: e.target.value })}
            placeholder="Enter campaign description"
            className="mt-1 min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Describe the goals and details of your campaign (max 100 characters)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
