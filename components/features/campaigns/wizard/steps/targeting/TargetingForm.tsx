"use client";

import React from "react";
import { Label } from "@/components/atoms/Label";
import { CampaignTargeting } from "@/lib/redux/slices/campaignSlice";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/Select";
import { formatDate } from "@/lib/utils/formatting";

interface TargetingFormProps {
  formData: CampaignTargeting;
  updateTargeting: (data: Partial<CampaignTargeting>) => void;
  addLocation: (location: { id: string; type: "state" | "msa" | "zipcode"; value: string; }) => void;
  removeLocation: (id: string) => void;
}

const TargetingForm: React.FC<TargetingFormProps> = ({
  formData,
  updateTargeting,
  addLocation,
  removeLocation,
}) => {
  // Handle date selection
  const handleStartDateChange = (date: Date | undefined) => {
    updateTargeting({ startDate: date ? date.toISOString() : null });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    updateTargeting({ endDate: date ? date.toISOString() : null });
  };

  // Simple LocationPicker implementation
  const LocationPicker = ({ selectedLocations, onAddLocation, onRemoveLocation }: any) => (
    <div className="p-4 border rounded-md">
      <p className="text-sm text-muted-foreground">Location picker placeholder</p>
      {selectedLocations && selectedLocations.length > 0 ? (
        <div className="mt-2">
          {selectedLocations.map((loc: any) => (
            <div key={loc.id} className="flex items-center gap-2 p-2 bg-muted rounded-md mt-1">
              <span>{loc.value}</span>
              <button 
                type="button" 
                className="text-xs text-red-500"
                onClick={() => onRemoveLocation(loc.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-2">No locations selected</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Campaign Targeting</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define when, where, and who your campaign will target
        </p>
      </div>

      {/* Campaign Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Start Date*</Label>
          <div className="mt-1">
            <DatePicker
              date={formData.startDate ? new Date(formData.startDate) : undefined}
              onSelect={handleStartDateChange}
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            When should the campaign start running?
          </p>
        </div>

        <div>
          <Label>End Date*</Label>
          <div className="mt-1">
            <DatePicker
              date={formData.endDate ? new Date(formData.endDate) : undefined}
              onSelect={handleEndDateChange}
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            When should the campaign stop running?
          </p>
        </div>
      </div>

      {/* Location Targeting */}
      <div className="space-y-3">
        <Label>Geographic Targeting*</Label>
        <LocationPicker
          selectedLocations={formData.locations}
          onAddLocation={addLocation}
          onRemoveLocation={removeLocation}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Target specific areas for your campaign
        </p>
      </div>

      {/* Demographic Targeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>Gender</Label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateTargeting({ gender: ["male", "female"] })}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                formData.gender.includes("male") && formData.gender.includes("female")
                  ? "bg-primary text-white border-primary"
                  : "bg-background border-input"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => updateTargeting({ gender: ["male"] })}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                formData.gender.includes("male") && !formData.gender.includes("female")
                  ? "bg-primary text-white border-primary"
                  : "bg-background border-input"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => updateTargeting({ gender: ["female"] })}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                formData.gender.includes("female") && !formData.gender.includes("male")
                  ? "bg-primary text-white border-primary"
                  : "bg-background border-input"
              }`}
            >
              Female
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select which gender to target
          </p>
        </div>

        <div className="space-y-3">
          <Label>Campaign Weight*</Label>
          <Select
            value={formData.campaignWeight}
            onValueChange={(value) => updateTargeting({ campaignWeight: value as "small" | "medium" | "large" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select campaign weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Controls the reach and intensity of your campaign
          </p>
        </div>
      </div>
    </div>
  );
};

export default TargetingForm; 
