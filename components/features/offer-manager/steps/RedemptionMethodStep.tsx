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
    redemptionMethods: string[]; // Changed from redemptionMethod (string) to redemptionMethods (array)
    redemptionConfigs: { [key: string]: any }; // Config data for each redemption method
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
  // Initialize redemptionMethods and redemptionConfigs if undefined
  const redemptionMethods = formData.redemptionMethods || [];
  const redemptionConfigs = formData.redemptionConfigs || {};

  const handleRedemptionMethodToggle = (methodValue: string) => {
    const newMethods = redemptionMethods.includes(methodValue)
      ? redemptionMethods.filter((m) => m !== methodValue)
      : [...redemptionMethods, methodValue];
    onUpdate("redemptionMethods", newMethods);
  };

  const handleConfigUpdate = (
    methodValue: string,
    field: string,
    value: any
  ) => {
    const newConfigs = {
      ...redemptionConfigs,
      [methodValue]: {
        ...redemptionConfigs[methodValue],
        [field]: value,
      },
    };
    onUpdate("redemptionConfigs", newConfigs);
  };

  const handleNext = () => {
    if (redemptionMethods.length === 0) {
      alert("Please select at least one redemption method");
      return;
    }

    // Validate promo code if promo_code method is selected
    if (
      redemptionMethods.includes("promo_code") &&
      !redemptionConfigs.promo_code?.promoCode
    ) {
      alert("Please enter a promo code for the Promo Code redemption method");
      return;
    }

    onNext();
  };

  const generateRandomCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    handleConfigUpdate("promo_code", "promoCode", code);
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
        {/* Redemption Methods - Multiple Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Redemption Methods <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 font-normal ml-2">
              (Select one or more)
            </span>
          </Label>

          <div className="space-y-3">
            {/* Promo Code */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                redemptionMethods.includes("promo_code")
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={redemptionMethods.includes("promo_code")}
                onChange={() => handleRedemptionMethodToggle("promo_code")}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Promo Code
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Customer provides merchant-supplied code (online, phone, or
                  in-store)
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Easy implementation
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Works with POS systems
                  </span>
                </div>
              </div>
            </label>

            {/* Show & Save */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                redemptionMethods.includes("show_save")
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={redemptionMethods.includes("show_save")}
                onChange={() => handleRedemptionMethodToggle("show_save")}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Show & Save
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Customer displays QR/barcode/code to staff
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Mobile-optimized
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Real-time tracking
                  </span>
                </div>
              </div>
            </label>

            {/* Barcode Scan */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                redemptionMethods.includes("barcode_scan")
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={redemptionMethods.includes("barcode_scan")}
                onChange={() => handleRedemptionMethodToggle("barcode_scan")}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Barcode Scan
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Customer scans barcode at location
                </p>
                <div className="flex gap-2 mt-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">
                    Requires barcode reader
                  </span>
                </div>
              </div>
            </label>

            {/* Online Link */}
            <label
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                redemptionMethods.includes("online_link")
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={redemptionMethods.includes("online_link")}
                onChange={() => handleRedemptionMethodToggle("online_link")}
                className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Online Link
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Redirect to merchant website with discount applied
                </p>
                <div className="flex gap-2 mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Seamless for e-commerce
                  </span>
                </div>
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Select all applicable redemption methods. Configuration sections
            will appear below for each selected method.
          </p>
        </div>

        {/* Configuration Sections for Selected Methods */}
        {redemptionMethods.length === 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Select one or more redemption methods above to configure them
            </p>
          </div>
        )}

        {/* Promo Code Configuration */}
        {redemptionMethods.includes("promo_code") && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-semibold text-gray-900 mb-4 block">
              Promo Code Configuration <span className="text-red-500">*</span>
            </Label>

            {/* Code Type */}
            <div className="space-y-3 mb-4">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="promoCodeType_promo_code"
                  value="single"
                  checked={
                    redemptionConfigs.promo_code?.codeType === "single" ||
                    !redemptionConfigs.promo_code?.codeType
                  }
                  onChange={(e) =>
                    handleConfigUpdate("promo_code", "codeType", e.target.value)
                  }
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Single Universal Code
                  </p>
                  <p className="text-sm text-gray-600">
                    One code for all customers (Example: SPRING20)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="promoCodeType_promo_code"
                  value="multiple"
                  checked={
                    redemptionConfigs.promo_code?.codeType === "multiple"
                  }
                  onChange={(e) =>
                    handleConfigUpdate("promo_code", "codeType", e.target.value)
                  }
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Multiple Unique Codes
                  </p>
                  <p className="text-sm text-gray-600">
                    Individual codes per customer
                  </p>
                  {redemptionConfigs.promo_code?.codeType === "multiple" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      📎 Upload CSV File
                    </Button>
                  )}
                </div>
              </label>
            </div>

            {/* Promo Code Input */}
            {(redemptionConfigs.promo_code?.codeType === "single" ||
              !redemptionConfigs.promo_code?.codeType) && (
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
                    value={redemptionConfigs.promo_code?.promoCode || ""}
                    onChange={(e) =>
                      handleConfigUpdate(
                        "promo_code",
                        "promoCode",
                        e.target.value.toUpperCase()
                      )
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
                  value={
                    redemptionConfigs.promo_code?.usageLimitPerCustomer || "1"
                  }
                  onChange={(e) =>
                    handleConfigUpdate(
                      "promo_code",
                      "usageLimitPerCustomer",
                      e.target.value
                    )
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
                  value={redemptionConfigs.promo_code?.totalUsageLimit || ""}
                  onChange={(e) =>
                    handleConfigUpdate(
                      "promo_code",
                      "totalUsageLimit",
                      e.target.value
                    )
                  }
                  className="w-24"
                />
                <span className="text-sm text-gray-700">uses</span>
              </label>
            </div>
          </div>
        )}

        {/* Show & Save Configuration */}
        {redemptionMethods.includes("show_save") && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-semibold text-gray-900 mb-4 block">
              Show & Save Configuration
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              QR code and display options for mobile redemption
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={redemptionConfigs.show_save?.enableQR !== false}
                  onChange={(e) =>
                    handleConfigUpdate(
                      "show_save",
                      "enableQR",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm text-gray-700">Generate QR Code</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={redemptionConfigs.show_save?.enableBarcode !== false}
                  onChange={(e) =>
                    handleConfigUpdate(
                      "show_save",
                      "enableBarcode",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm text-gray-700">Generate Barcode</span>
              </label>
            </div>
          </div>
        )}

        {/* Barcode Scan Configuration */}
        {redemptionMethods.includes("barcode_scan") && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-semibold text-gray-900 mb-4 block">
              Barcode Scan Configuration
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="barcodeFormat" className="text-sm mb-2 block">
                  Barcode Format
                </Label>
                <select
                  id="barcodeFormat"
                  value={redemptionConfigs.barcode_scan?.format || "CODE128"}
                  onChange={(e) =>
                    handleConfigUpdate("barcode_scan", "format", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="CODE128">CODE128</option>
                  <option value="EAN13">EAN13</option>
                  <option value="UPC">UPC</option>
                  <option value="QR">QR Code</option>
                </select>
              </div>
              <p className="text-sm text-gray-600">
                Ensure your POS system supports the selected barcode format
              </p>
            </div>
          </div>
        )}

        {/* Online Link Configuration */}
        {redemptionMethods.includes("online_link") && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-semibold text-gray-900 mb-4 block">
              Online Link Configuration
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="redirectUrl" className="text-sm mb-2 block">
                  Redirect URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  placeholder="https://example.com/offer"
                  value={redemptionConfigs.online_link?.redirectUrl || ""}
                  onChange={(e) =>
                    handleConfigUpdate(
                      "online_link",
                      "redirectUrl",
                      e.target.value
                    )
                  }
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Customers will be redirected to this URL when they redeem
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Location Scope - Applies to All Methods */}
        {redemptionMethods.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Location Scope</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAskAI("locationScope")}
                className="h-7 px-2 text-sm text-blue-600 hover:bg-blue-50"
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
                  checked={
                    formData.locationScope === "all" || !formData.locationScope
                  }
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
            <p className="text-sm text-gray-500 mt-2">
              This applies to all selected redemption methods
            </p>
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
