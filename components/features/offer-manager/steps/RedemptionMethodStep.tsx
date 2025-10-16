"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface RedemptionMethodStepProps {
  formData: {
    redemptionMethod: string;
    promoCodeType: string;
    promoCode: string;
    usageLimitPerCustomer: string;
    totalUsageLimit: string;
    locationScope: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onAskAI: (field: string) => void;
}

export default function RedemptionMethodStep({
  formData,
  onUpdate,
  onNext,
  onPrevious,
  onAskAI,
}: RedemptionMethodStepProps) {
  const handleNext = () => {
    if (!formData.redemptionMethod) {
      alert("Please select a redemption method");
      return;
    }
    if (formData.redemptionMethod === "promo_code" && !formData.promoCode) {
      alert("Please enter a promo code");
      return;
    }
    onNext();
  };

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    onUpdate("promoCode", code);
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Step 3: Redemption Method
        </h2>
        <p className="text-sm text-gray-600">
          Select how customers will redeem this offer
        </p>
      </div>

      <div className="space-y-6">
        {/* Redemption Method Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Select how customers will redeem{" "}
            <span className="text-red-500">*</span>
          </Label>

          <div className="space-y-3">
            {/* Promo Code */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.redemptionMethod === "promo_code"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="redemptionMethod"
                value="promo_code"
                checked={formData.redemptionMethod === "promo_code"}
                onChange={(e) => onUpdate("redemptionMethod", e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Promo Code
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Customer provides merchant-supplied code (online, phone, or
                  in-store)
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Easy implementation
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Works with POS systems
                  </span>
                </div>
              </div>
            </label>

            {/* Show & Save */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.redemptionMethod === "show_save"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="redemptionMethod"
                value="show_save"
                checked={formData.redemptionMethod === "show_save"}
                onChange={(e) => onUpdate("redemptionMethod", e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Show & Save
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Customer displays QR/barcode/code to staff
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Mobile-optimized
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Real-time tracking
                  </span>
                </div>
              </div>
            </label>

            {/* Barcode Scan */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.redemptionMethod === "barcode_scan"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="redemptionMethod"
                value="barcode_scan"
                checked={formData.redemptionMethod === "barcode_scan"}
                onChange={(e) => onUpdate("redemptionMethod", e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Barcode Scan
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Customer scans barcode at location
                </p>
                <div className="flex gap-2 mt-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-600">
                    Requires barcode reader
                  </span>
                </div>
              </div>
            </label>

            {/* Online Link */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.redemptionMethod === "online_link"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="redemptionMethod"
                value="online_link"
                checked={formData.redemptionMethod === "online_link"}
                onChange={(e) => onUpdate("redemptionMethod", e.target.value)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Online Link
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Redirect to merchant website with discount applied
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Seamless for e-commerce
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Promo Code Configuration */}
        {formData.redemptionMethod === "promo_code" && (
          <div className="pt-6 border-t border-gray-200">
            <Label className="text-sm font-medium text-gray-900 mb-4 block">
              Promo Code Configuration
            </Label>

            {/* Code Type */}
            <div className="space-y-3 mb-4">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="promoCodeType"
                  value="single"
                  checked={formData.promoCodeType === "single"}
                  onChange={(e) => onUpdate("promoCodeType", e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Single Universal Code
                  </p>
                  <p className="text-xs text-gray-600">
                    One code for all customers (Example: SPRING20)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="promoCodeType"
                  value="multiple"
                  checked={formData.promoCodeType === "multiple"}
                  onChange={(e) => onUpdate("promoCodeType", e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Multiple Unique Codes
                  </p>
                  <p className="text-xs text-gray-600">
                    Individual codes per customer
                  </p>
                  {formData.promoCodeType === "multiple" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      📎 Upload CSV File
                    </Button>
                  )}
                </div>
              </label>
            </div>

            {/* Promo Code Input */}
            {formData.promoCodeType === "single" && (
              <div className="mb-4">
                <Label
                  htmlFor="promoCode"
                  className="text-sm font-medium mb-2 block"
                >
                  Promo Code <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="promoCode"
                    placeholder="PARTS20"
                    value={formData.promoCode}
                    onChange={(e) =>
                      onUpdate("promoCode", e.target.value.toUpperCase())
                    }
                    className="flex-1 uppercase"
                  />
                  <Button
                    variant="outline"
                    onClick={generateRandomCode}
                    className="whitespace-nowrap"
                  >
                    Generate Random
                  </Button>
                </div>
              </div>
            )}

            {/* Usage Limits */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  Limit per customer:
                </span>
                <Input
                  type="number"
                  min="1"
                  value={formData.usageLimitPerCustomer}
                  onChange={(e) =>
                    onUpdate("usageLimitPerCustomer", e.target.value)
                  }
                  className="w-20"
                />
                <span className="text-sm text-gray-700">use(s)</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  Total usage limit:
                </span>
                <Input
                  type="number"
                  min="1"
                  value={formData.totalUsageLimit}
                  onChange={(e) => onUpdate("totalUsageLimit", e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-gray-700">uses</span>
              </label>
            </div>

            {/* Location Scope */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Location Scope</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAskAI("locationScope")}
                  className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="locationScope"
                    value="all"
                    checked={formData.locationScope === "all"}
                    onChange={(e) => onUpdate("locationScope", e.target.value)}
                  />
                  <span className="text-sm text-gray-700">
                    All participating locations
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="locationScope"
                    value="specific"
                    checked={formData.locationScope === "specific"}
                    onChange={(e) => onUpdate("locationScope", e.target.value)}
                  />
                  <span className="text-sm text-gray-700">
                    Specific locations only
                  </span>
                </label>
                {formData.locationScope === "specific" && (
                  <Button variant="outline" size="sm" className="ml-6 mt-2">
                    Select Locations...
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
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
          Next: Campaign Setup →
        </Button>
      </div>
    </Card>
  );
}
