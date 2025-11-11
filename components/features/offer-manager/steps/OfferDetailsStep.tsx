"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface OfferDetailsStepProps {
  formData: {
    offerTypes: string[]; // Changed from offerType (string) to offerTypes (array)
    offerValues: { [key: string]: string }; // Values for each offer type
    offerTitle: string;
    offerDescription: string;
    termsConditions: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onAskAI: (field: string) => void;
}

const OFFER_TYPES = [
  { value: "percentage_discount", label: "Percentage Discount (X% off)" },
  { value: "fixed_discount", label: "Discount Fixed ($X off)" },
  { value: "bogo", label: "BOGO (Buy One Get One)" },
  { value: "cashback", label: "Cashback" },
  { value: "loyalty_points", label: "Loyalty Points" },
  { value: "spend_get", label: "Spend & Get (requires receipt scan)" },
  { value: "lightning", label: "Lightning Offer (limited quantity)" },
];

export default function OfferDetailsStep({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  onAskAI,
}: OfferDetailsStepProps) {
  // Initialize offerTypes and offerValues if undefined
  const offerTypes = formData.offerTypes || [];
  const offerValues = formData.offerValues || {};

  const handleOfferTypeToggle = (typeValue: string) => {
    const newOfferTypes = offerTypes.includes(typeValue)
      ? offerTypes.filter((t) => t !== typeValue)
      : [...offerTypes, typeValue];
    onUpdate("offerTypes", newOfferTypes);
  };

  const handleOfferValueChange = (typeValue: string, value: string) => {
    const newOfferValues = { ...offerValues, [typeValue]: value };
    onUpdate("offerValues", newOfferValues);
  };

  const handleNext = () => {
    if (offerTypes.length === 0) {
      alert("Please select at least one offer type");
      return;
    }

    // Check if all selected offer types have values
    const missingValues = offerTypes.filter((type) => !offerValues[type]);
    if (missingValues.length > 0) {
      alert("Please provide values for all selected offer types");
      return;
    }

    if (!formData.offerTitle) {
      alert("Please fill in the offer title");
      return;
    }
    onNext();
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step 2: Offer Type & Value
        </h2>
        <p className="text-sm text-gray-600">
          Configure your promotional offer settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Offer Types - Multiple Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              Offer Types <span className="text-red-500">*</span>
              <span className="text-sm text-gray-500 font-normal ml-2">
                (Select one or more)
              </span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("offerType")}
              className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <div className="space-y-2">
            {OFFER_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
              >
                <input
                  type="checkbox"
                  checked={offerTypes.includes(type.value)}
                  onChange={() => handleOfferTypeToggle(type.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{type.label}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Select all applicable offer types. Configuration fields will appear
            below for each selected type.
          </p>
        </div>

        {/* Conditional Fields for Each Selected Offer Type */}
        {offerTypes.length === 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Select one or more offer types above to configure their values
            </p>
          </div>
        )}

        {offerTypes.map((typeValue) => {
          const typeLabel =
            OFFER_TYPES.find((t) => t.value === typeValue)?.label || typeValue;

          return (
            <div
              key={typeValue}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold text-gray-900">
                  {typeLabel} <span className="text-red-500">*</span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAskAI("offerValue")}
                  className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-100"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>

              {/* Percentage Discount Fields */}
              {typeValue === "percentage_discount" && (
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-sm text-gray-600">Discount:</span>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="20"
                      value={offerValues[typeValue] || ""}
                      onChange={(e) =>
                        handleOfferValueChange(typeValue, e.target.value)
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={offerValues[typeValue] || 20}
                      onChange={(e) =>
                        handleOfferValueChange(typeValue, e.target.value)
                      }
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1% Low</span>
                      <span>↑</span>
                      <span>100% High</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fixed Discount Fields */}
              {typeValue === "fixed_discount" && (
                <div className="flex gap-2">
                  <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="50"
                    value={offerValues[typeValue] || ""}
                    onChange={(e) =>
                      handleOfferValueChange(typeValue, e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              )}

              {/* BOGO Fields */}
              {typeValue === "bogo" && (
                <div>
                  <Input
                    type="text"
                    placeholder="e.g., Buy 1 Get 1 Free, Buy 2 Get 1 50% Off"
                    value={offerValues[typeValue] || ""}
                    onChange={(e) =>
                      handleOfferValueChange(typeValue, e.target.value)
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Describe the BOGO offer details
                  </p>
                </div>
              )}

              {/* Cashback Fields */}
              {typeValue === "cashback" && (
                <div className="flex gap-2">
                  <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="10"
                    value={offerValues[typeValue] || ""}
                    onChange={(e) =>
                      handleOfferValueChange(typeValue, e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 self-center">
                    cashback
                  </span>
                </div>
              )}

              {/* Loyalty Points Fields */}
              {typeValue === "loyalty_points" && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="500"
                    value={offerValues[typeValue] || ""}
                    onChange={(e) =>
                      handleOfferValueChange(typeValue, e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 self-center">
                    points
                  </span>
                </div>
              )}

              {/* Spend & Get Fields */}
              {typeValue === "spend_get" && (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">Spend:</span>
                    <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="50"
                      value={offerValues[typeValue] || ""}
                      onChange={(e) =>
                        handleOfferValueChange(typeValue, e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Minimum spend amount (requires receipt scan)
                  </p>
                </div>
              )}

              {/* Lightning Offer Fields */}
              {typeValue === "lightning" && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="100"
                    value={offerValues[typeValue] || ""}
                    onChange={(e) =>
                      handleOfferValueChange(typeValue, e.target.value)
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Limited quantity available (e.g., first 100 customers)
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Offer Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="offerTitle" className="text-sm font-medium">
              Offer Title <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("offerTitle")}
              className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <Input
            id="offerTitle"
            placeholder="20% Off All Parts & Service"
            value={formData.offerTitle}
            onChange={(e) => onUpdate("offerTitle", e.target.value)}
            maxLength={60}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.offerTitle.length}/60 characters
          </p>
        </div>

        {/* Offer Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="offerDescription" className="text-sm font-medium">
              Offer Description
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("offerDescription")}
              className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <textarea
            id="offerDescription"
            placeholder="Save 20% on all parts and service this Q4. Valid on orders over $50. Cannot be combined with other offers."
            value={formData.offerDescription}
            onChange={(e) => onUpdate("offerDescription", e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.offerDescription.length}/500 characters
          </p>
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="termsConditions" className="text-sm font-medium">
              Terms & Conditions
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("terms")}
              className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Generate with AI
            </Button>
          </div>
          <textarea
            id="termsConditions"
            placeholder="(Auto-populated legal boilerplate)"
            value={formData.termsConditions}
            onChange={(e) => onUpdate("termsConditions", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="border-gray-300"
        >
          ← Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next: Redemption Method →
        </Button>
      </div>
    </Card>
  );
}
