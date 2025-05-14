"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { CampaignTargeting } from "@/lib/redux/slices/campaignSlice";
import { format } from "date-fns";
import { Calendar } from "@/components/atoms/Calendar";
import { addDays } from "date-fns";

interface TargetingStepProps {
  formData: CampaignTargeting;
  updateTargeting: (data: Partial<CampaignTargeting>) => void;
  addLocation: (location: {
    id: string;
    type: "state" | "msa" | "zipcode";
    value: string;
  }) => void;
  removeLocation: (id: string) => void;
  setStepValidation: (isValid: boolean) => void;
}

// Custom DatePicker component
interface DatePickerProps {
  id: string;
  selected: string | null;
  onSelect: (date: string | null) => void;
  placeholder: string;
  className?: string;
}

const DatePicker = ({
  id,
  selected,
  onSelect,
  placeholder,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Get tomorrow's date for minimum selectable date
  const tomorrow = addDays(new Date(), 1);

  // Function to disable dates before tomorrow
  const disablePastDates = (date: Date) => {
    return date < tomorrow;
  };

  return (
    <div className={className}>
      <Input
        id={id}
        placeholder={placeholder}
        value={selected ? format(new Date(selected), "PPP") : ""}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10">
          <Calendar
            mode="single"
            selected={selected ? new Date(selected) : undefined}
            onSelect={(date: Date | undefined) => {
              onSelect(date ? date.toISOString() : null);
              setIsOpen(false);
            }}
            disabled={disablePastDates}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};

const TargetingStep: React.FC<TargetingStepProps> = ({
  formData,
  updateTargeting,
  addLocation,
  removeLocation,
  setStepValidation,
}) => {
  // Set this step as always valid when mounted
  React.useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Campaign Dates */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Campaign Duration*</h4>
          <p className="text-sm text-muted-foreground">
            Set when your campaign should start and end.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="start-date">Start Date*</Label>
              <DatePicker
                id="start-date"
                selected={formData.startDate}
                onSelect={(date) => updateTargeting({ startDate: date })}
                placeholder="Select start date"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date*</Label>
              <DatePicker
                id="end-date"
                selected={formData.endDate}
                onSelect={(date) => updateTargeting({ endDate: date })}
                placeholder="Select end date"
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Campaigns must be scheduled at least 1 day in advance.
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-700">
                Targeting Simplified
              </h4>
              <p className="mt-1 text-sm text-blue-600">
                Geographic and demographic targeting options have been removed
                in this version. Campaigns will be distributed to all eligible
                users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetingStep;
