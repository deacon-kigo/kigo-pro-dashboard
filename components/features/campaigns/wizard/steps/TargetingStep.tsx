"use client";

import React from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { CampaignTargeting } from "@/lib/redux/slices/campaignSlice";
import { format } from "date-fns";
import { Calendar } from "@/components/atoms/Calendar";
import { addDays } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

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
  disabled?: boolean;
}

const DatePicker = ({
  id,
  selected,
  onSelect,
  placeholder,
  className,
  disabled = false,
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
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        disabled={disabled}
        className={disabled ? "bg-gray-100 cursor-not-allowed" : ""}
      />
      {isOpen && !disabled && (
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
  // Validate the step based on required fields
  const [showErrors, setShowErrors] = React.useState(false);

  React.useEffect(() => {
    const isValid =
      formData.startDate !== null &&
      (formData.noEndDate || formData.endDate !== null);

    setStepValidation(isValid);

    // Show errors if user has interacted and validation fails
    if (
      !isValid &&
      (formData.startDate !== null ||
        formData.endDate !== null ||
        formData.noEndDate)
    ) {
      setShowErrors(true);
    } else if (isValid) {
      setShowErrors(false);
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.noEndDate,
    setStepValidation,
  ]);

  // Handler for toggling no end date
  const handleNoEndDateChange = (checked: boolean) => {
    updateTargeting({
      noEndDate: checked,
      // When turning on noEndDate, clear the endDate
      endDate: checked ? null : formData.endDate,
    });
  };

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
              {showErrors && !formData.startDate && (
                <p className="text-xs text-red-600 mt-1">
                  Start date is required
                </p>
              )}
            </div>

            {!formData.noEndDate && (
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker
                  id="end-date"
                  selected={formData.endDate}
                  onSelect={(date) => updateTargeting({ endDate: date })}
                  placeholder="Select end date"
                  className="mt-1"
                  disabled={formData.noEndDate}
                />
                {showErrors && !formData.noEndDate && !formData.endDate && (
                  <p className="text-xs text-red-600 mt-1">
                    End date is required (or check 'No end date')
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              id="no-end-date"
              checked={formData.noEndDate}
              onCheckedChange={handleNoEndDateChange}
            />
            <Label htmlFor="no-end-date" className="text-sm cursor-pointer">
              No end date (campaign runs indefinitely)
            </Label>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Campaigns must be scheduled at least 1 day in advance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TargetingStep;
