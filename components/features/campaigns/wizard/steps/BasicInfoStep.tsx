"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Calendar } from "@/components/atoms/Calendar/Calendar";
import { CampaignBasicInfo } from "@/lib/redux/slices/campaignSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/Popover/Popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  formData: CampaignBasicInfo;
  updateBasicInfo: (data: Partial<CampaignBasicInfo>) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setStepValidation: (isValid: boolean) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateBasicInfo,
  setStartDate,
  setEndDate,
  setStepValidation,
}) => {
  // Convert string dates to Date objects for form - do this once during mount
  const startDate = React.useMemo(() => {
    return formData.startDate ? new Date(formData.startDate) : undefined;
  }, [formData.startDate]);

  const endDate = React.useMemo(() => {
    return formData.endDate ? new Date(formData.endDate) : undefined;
  }, [formData.endDate]);

  // Just call setStepValidation(true) once when component is mounted
  React.useEffect(() => {
    // Set this step as always valid for presentational UI
    setStepValidation(true);
  }, [setStepValidation]); // Only depend on setStepValidation to avoid unnecessary re-renders

  // Campaign type options
  const campaignTypes = [{ value: "Advertising", label: "Advertising" }];

  // Memoize the date selection handlers to prevent recreating these functions on each render
  const handleStartDateSelect = useCallback(
    (date: Date | undefined) => {
      setStartDate(date || null);
    },
    [setStartDate]
  );

  const handleEndDateSelect = useCallback(
    (date: Date | undefined) => {
      setEndDate(date || null);
    },
    [setEndDate]
  );

  // Simple DatePicker component
  const DatePickerField = ({
    label,
    date,
    onSelect,
    description,
  }: {
    label: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    description: string;
  }) => {
    return (
      <div>
        <Label htmlFor={label}>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Campaign Information</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the basic details about your advertisement campaign.
      </p>

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
            Choose a unique and descriptive name
          </p>
        </div>

        <div>
          <Label htmlFor="campaign-type">Campaign Type*</Label>
          <Select
            value={formData.campaignType}
            onValueChange={(value) => updateBasicInfo({ campaignType: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent>
              {campaignTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Only Advertising is available in this version
          </p>
        </div>

        <div>
          <Label htmlFor="campaign-description">Campaign Description*</Label>
          <Textarea
            id="campaign-description"
            value={formData.description}
            onChange={(e) => updateBasicInfo({ description: e.target.value })}
            placeholder="Enter campaign description"
            className="mt-1 min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Describe the goals and details of your campaign
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            label="Start Date (UTC)*"
            date={startDate}
            onSelect={handleStartDateSelect}
            description="When will this campaign start"
          />

          <DatePickerField
            label="End Date (UTC)*"
            date={endDate}
            onSelect={handleEndDateSelect}
            description="When will this campaign end"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
