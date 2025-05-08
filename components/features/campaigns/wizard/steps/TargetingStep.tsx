"use client";

import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignTargeting } from "@/lib/redux/slices/campaignSlice";
import { XIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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

const TargetingStep: React.FC<TargetingStepProps> = ({
  formData,
  updateTargeting,
  addLocation,
  removeLocation,
  setStepValidation,
}) => {
  // Local state for location form
  const [locationType, setLocationType] = useState<"state" | "msa" | "zipcode">(
    "state"
  );
  const [locationValue, setLocationValue] = useState("");

  // Set this step as always valid when mounted
  React.useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  // Gender options
  const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" },
  ];

  // Age range options
  const ageRanges = [
    { id: "18-24", label: "18-24", value: [18, 24] as [number, number] },
    { id: "25-34", label: "25-34", value: [25, 34] as [number, number] },
    { id: "35-44", label: "35-44", value: [35, 44] as [number, number] },
    { id: "45-54", label: "45-54", value: [45, 54] as [number, number] },
    { id: "55+", label: "55+", value: [55, 100] as [number, number] },
  ];

  // Campaign weight options
  const weightOptions = [
    { value: "small", label: "Small - Lower budget, focused reach" },
    { value: "medium", label: "Medium - Balanced budget and reach" },
    { value: "large", label: "Large - Higher budget, expanded reach" },
  ];

  // US States for location targeting
  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  // Canadian Provinces
  const canadaProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];

  // Add location to the targeting
  const handleAddLocation = () => {
    if (locationValue.trim()) {
      // Check for mutual exclusivity between State and MSA
      if (
        (locationType === "state" &&
          formData.locations.some((loc) => loc.type === "msa")) ||
        (locationType === "msa" &&
          formData.locations.some((loc) => loc.type === "state"))
      ) {
        // Show mutual exclusivity error
        alert(
          "State and MSA selections are mutually exclusive. Please remove existing selections first."
        );
        return;
      }

      addLocation({
        id: uuidv4(),
        type: locationType,
        value: locationValue,
      });
      setLocationValue("");
    }
  };

  // Toggle gender selection
  const handleGenderToggle = (genderId: string) => {
    const currentGenders = [...formData.gender];

    if (currentGenders.includes(genderId)) {
      updateTargeting({
        gender: currentGenders.filter((id) => id !== genderId),
      });
    } else {
      updateTargeting({ gender: [...currentGenders, genderId] });
    }
  };

  // Handle age range selection
  const handleAgeRangeToggle = (ageRange: [number, number]) => {
    updateTargeting({ ageRange: ageRange });
  };

  // Suggestions based on location type
  const getLocationSuggestions = () => {
    if (locationType === "state") {
      return [...usStates, ...canadaProvinces];
    } else if (locationType === "msa") {
      return [
        "New York-Newark-Jersey City",
        "Los Angeles-Long Beach-Anaheim",
        "Chicago-Naperville-Elgin",
        "Dallas-Fort Worth-Arlington",
      ];
    }
    return [];
  };

  // Filter suggestions based on input
  const filteredSuggestions = getLocationSuggestions()
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(locationValue.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Audience Targeting</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Define the target audience for your campaign based on location,
        demographics, and campaign scope.
      </p>

      <div className="space-y-6">
        {/* Location targeting */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Geographic Targeting*</h4>
          <p className="text-sm text-muted-foreground">
            Target users in specific geographic locations (US and Canada only).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.locations.map((loc) => (
              <Badge key={loc.id} variant="secondary" className="gap-1 pl-2">
                {loc.type === "state"
                  ? "State/Province"
                  : loc.type === "msa"
                    ? "MSA"
                    : "ZIP"}
                : {loc.value}
                <button
                  onClick={() => removeLocation(loc.id)}
                  className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {formData.locations.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No locations added yet. Add at least one location.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="sm:w-1/3">
              <Label htmlFor="location-type">Location Type</Label>
              <Select
                value={locationType}
                onValueChange={(value: "state" | "msa" | "zipcode") =>
                  setLocationType(value)
                }
              >
                <SelectTrigger id="location-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state">State/Province</SelectItem>
                  <SelectItem value="msa">MSA (Metropolitan Area)</SelectItem>
                  <SelectItem value="zipcode">ZIP/Postal Code</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                State and MSA selections are mutually exclusive
              </p>
            </div>

            <div className="flex-1">
              <Label htmlFor="location-value">Location</Label>
              <div className="relative">
                <Input
                  id="location-value"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder={
                    locationType === "state"
                      ? "e.g. California"
                      : locationType === "msa"
                        ? "e.g. New York-Newark-Jersey City"
                        : "e.g. 90210"
                  }
                  className="mt-1"
                />
                {locationValue.length > 0 && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSuggestions.map((suggestion) => (
                      <div
                        key={suggestion}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setLocationValue(suggestion);
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleAddLocation} type="button" size="sm">
                  Add Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Demographics (Optional)</h4>

          {/* Gender Selection */}
          <div>
            <Label>Gender</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {genderOptions.map((gender) => (
                <div key={gender.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender.id}`}
                    checked={formData.gender.includes(gender.id)}
                    onCheckedChange={() => handleGenderToggle(gender.id)}
                  />
                  <Label
                    htmlFor={`gender-${gender.id}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {gender.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Age Range Selection */}
          <div className="mt-4">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {ageRanges.map((age) => (
                <div
                  key={age.id}
                  className={`p-2 border rounded-md text-center cursor-pointer transition-all ${
                    formData.ageRange &&
                    formData.ageRange[0] === age.value[0] &&
                    formData.ageRange[1] === age.value[1]
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => handleAgeRangeToggle(age.value)}
                >
                  {age.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Weight */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Campaign Weight*</h4>
          <p className="text-sm text-muted-foreground">
            Select the weight of your campaign to determine budget and reach.
          </p>

          <div className="space-y-3">
            {weightOptions.map((option) => (
              <div
                key={option.value}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  formData.campaignWeight === option.value
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground"
                }`}
                onClick={() =>
                  updateTargeting({
                    campaignWeight: option.value as
                      | "small"
                      | "medium"
                      | "large",
                  })
                }
              >
                <div className="flex items-start">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 mt-1 ${
                      formData.campaignWeight === option.value
                        ? "bg-primary border-2 border-primary/20"
                        : "border-2 border-muted"
                    }`}
                  ></div>
                  <div>
                    <h5 className="font-medium">{option.label}</h5>
                    <p className="text-sm text-muted-foreground">
                      {option.value === "small"
                        ? "Reaches approximately 50,000 people"
                        : option.value === "medium"
                          ? "Reaches approximately 100,000 people"
                          : "Reaches approximately 200,000 people"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetingStep;
