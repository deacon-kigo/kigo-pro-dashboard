"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface OfferDetailsStepProps {
  formData: {
    offerType: string;
    offerValue: string;
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
  const handleNext = () => {
    if (!formData.offerType || !formData.offerValue || !formData.offerTitle) {
      alert("Please fill in required fields");
      return;
    }
    onNext();
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step 2: Offer Details
        </h2>
        <p className="text-sm text-gray-600">
          Configure your offer type, value, and messaging
        </p>
      </div>

      <div className="space-y-6">
        {/* Offer Type */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="offerType" className="text-sm font-medium">
              Offer Type <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("offerType")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <select
            id="offerType"
            value={formData.offerType}
            onChange={(e) => onUpdate("offerType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select offer type...</option>
            {OFFER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Offer Value */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="offerValue" className="text-sm font-medium">
              Offer Value <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("offerValue")}
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>

          {formData.offerType === "percentage_discount" && (
            <div>
              <div className="flex gap-2 items-center mb-2">
                <span className="text-sm text-gray-600">Discount:</span>
                <Input
                  id="offerValue"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="20"
                  value={formData.offerValue}
                  onChange={(e) => onUpdate("offerValue", e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
              {/* Visual slider */}
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.offerValue || 20}
                  onChange={(e) => onUpdate("offerValue", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10% Low</span>
                  <span>↑</span>
                  <span>30% High</span>
                </div>
              </div>
            </div>
          )}

          {formData.offerType === "fixed_discount" && (
            <div className="flex gap-2">
              <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                $
              </span>
              <Input
                id="offerValue"
                type="number"
                placeholder="50"
                value={formData.offerValue}
                onChange={(e) => onUpdate("offerValue", e.target.value)}
                className="flex-1"
              />
            </div>
          )}

          {!formData.offerType && (
            <p className="text-xs text-gray-500">
              Select an offer type to configure the value
            </p>
          )}
        </div>

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
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
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
          <p className="text-xs text-gray-500 mt-1">
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
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
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
          <p className="text-xs text-gray-500 mt-1">
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
              className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
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
