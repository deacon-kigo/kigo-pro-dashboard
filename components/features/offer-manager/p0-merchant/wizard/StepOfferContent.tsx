"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
  getDefaultDates,
} from "@/lib/constants/offer-templates";

/**
 * Step 3: Offer Content (Consolidated)
 *
 * All offer details in one place:
 * - Discount value (type-specific)
 * - Headline & Description
 * - Image upload
 * - Dates
 * - Redemption URL & promo code
 */

interface StepOfferContentProps {
  offerType: OfferTypeKey;
  formData: {
    discountValue?: string;
    offerName?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    externalUrl?: string;
    promoCode?: string;
    offerImageFile?: File | null;
    offerImagePreview?: string;
    offerImageAlt?: string;
    termsConditions?: string;
    usageLimitPerCustomer?: string;
    redemptionRollingPeriod?: string;
  };
  onUpdate: (field: string, value: any) => void;
}

export default function StepOfferContent({
  offerType,
  formData,
  onUpdate,
}: StepOfferContentProps) {
  const typeConfig = OFFER_TYPE_CONFIG[offerType];
  const [noExpiration, setNoExpiration] = useState(!formData.endDate);
  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dates with smart defaults if not set
  useEffect(() => {
    if (!formData.startDate || !formData.endDate) {
      const defaults = getDefaultDates();
      if (!formData.startDate) {
        onUpdate("startDate", defaults.startDate);
      }
      if (!formData.endDate && !noExpiration) {
        onUpdate("endDate", defaults.endDate);
      }
    }
  }, []);

  useEffect(() => {
    setLocalOfferName(formData.offerName || "");
  }, [formData.offerName]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleOfferNameChange = (value: string) => {
    setLocalOfferName(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onUpdate("offerName", value);
      onUpdate("shortText", value);
    }, 150);
  };

  // Image upload handlers
  const handleImageUpload = (file: File) => {
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only PNG and JPG files are allowed.");
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB.");
      return;
    }
    onUpdate("offerImageFile", file);
    onUpdate("offerImagePreview", URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    onUpdate("offerImageFile", null);
    onUpdate("offerImagePreview", "");
    onUpdate("offerImageAlt", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="rounded-md border">
        <div className="px-4 py-3 font-medium border-b bg-muted/30">
          Offer Information
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Discount Value */}
              <div>
                <Label htmlFor="discountValue">
                  {typeConfig.discountLabel}*
                </Label>
                <div className="relative mt-1">
                  {typeConfig.discountPrefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      {typeConfig.discountPrefix}
                    </span>
                  )}
                  <Input
                    id="discountValue"
                    type={offerType === "bogo" ? "text" : "number"}
                    placeholder={typeConfig.discountPlaceholder}
                    value={formData.discountValue || ""}
                    onChange={(e) => onUpdate("discountValue", e.target.value)}
                    onFocus={(e) => {
                      if (e.target.value === "0") {
                        onUpdate("discountValue", "");
                      }
                      e.target.select();
                    }}
                    className={cn(
                      typeConfig.discountPrefix && "pl-7",
                      typeConfig.discountSuffix && "pr-10"
                    )}
                    min="0"
                    step={offerType === "fixed_price" ? "0.01" : "1"}
                  />
                  {typeConfig.discountSuffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                      {typeConfig.discountSuffix}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600 text-sm">
                  {offerType === "bogo"
                    ? 'Describe the item (e.g., "Any entrée")'
                    : "The discount amount for this offer"}
                </p>
              </div>

              {/* Headline */}
              <div>
                <Label htmlFor="offerName">Headline*</Label>
                <Input
                  id="offerName"
                  placeholder="e.g., '20% Off Your First Order'"
                  value={localOfferName}
                  onChange={(e) => handleOfferNameChange(e.target.value)}
                  maxLength={60}
                />
                <p className="mt-2 text-gray-600 text-sm">
                  {localOfferName.length}/60 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what customers get with this offer..."
                  value={formData.description || ""}
                  onChange={(e) => {
                    onUpdate("description", e.target.value);
                    onUpdate("longText", e.target.value);
                  }}
                  rows={3}
                  maxLength={250}
                />
                <p className="mt-2 text-gray-600 text-sm">
                  {(formData.description || "").length}/250 characters
                </p>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-5">
              <div>
                <Label>Offer Image</Label>
                <p className="text-gray-600 text-sm mb-3">
                  Upload an image to make your offer stand out
                </p>

                {formData.offerImagePreview ? (
                  // Image Preview
                  <div className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                    <img
                      src={formData.offerImagePreview}
                      alt={formData.offerImageAlt || "Offer preview"}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        title="Replace image"
                      >
                        <ArrowPathIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        title="Remove image"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Upload Zone
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG or JPG (max 5MB)
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Alt Text */}
                {formData.offerImagePreview && (
                  <div className="mt-3">
                    <Label htmlFor="offerImageAlt" className="text-sm">
                      Alt text (optional)
                    </Label>
                    <Input
                      id="offerImageAlt"
                      placeholder="Describe the image for accessibility"
                      value={formData.offerImageAlt || ""}
                      onChange={(e) =>
                        onUpdate("offerImageAlt", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Redemption Section */}
      <div className="rounded-md border">
        <div className="px-4 py-3 font-medium border-b bg-muted/30">
          Dates & Redemption
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Dates */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date*</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => onUpdate("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={noExpiration ? "" : formData.endDate || ""}
                    onChange={(e) => onUpdate("endDate", e.target.value)}
                    min={formData.startDate}
                    disabled={noExpiration}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="noExpiration"
                  checked={noExpiration}
                  onCheckedChange={(checked) => {
                    setNoExpiration(!!checked);
                    if (checked) {
                      onUpdate("endDate", "");
                    } else {
                      const defaults = getDefaultDates();
                      onUpdate("endDate", defaults.endDate);
                    }
                  }}
                />
                <label
                  htmlFor="noExpiration"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  No expiration date
                </label>
              </div>
            </div>

            {/* Redemption */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="externalUrl">Redemption URL*</Label>
                <Input
                  id="externalUrl"
                  type="url"
                  placeholder="https://example.com/offer"
                  value={formData.externalUrl || ""}
                  onChange={(e) => onUpdate("externalUrl", e.target.value)}
                />
                <p className="text-gray-600 text-sm mt-1">
                  Where customers go to redeem
                </p>
              </div>

              <div>
                <Label htmlFor="promoCode">Promo Code*</Label>
                <Input
                  id="promoCode"
                  placeholder="e.g., SAVE20"
                  value={formData.promoCode || ""}
                  onChange={(e) =>
                    onUpdate("promoCode", e.target.value.toUpperCase())
                  }
                  className="font-mono"
                  maxLength={20}
                />
                <p className="text-gray-600 text-sm mt-1">
                  Code shown to all customers (auto-uppercase)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Settings Section */}
      <div className="rounded-md border">
        <div className="px-4 py-3 font-medium border-b bg-muted/30">
          Terms & Settings
        </div>
        <div className="p-4 space-y-5">
          {/* Terms & Conditions */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="termsConditions">Terms & Conditions</Label>
              <span className="text-xs text-gray-500">
                Auto-filled from merchant category
              </span>
            </div>
            <Textarea
              id="termsConditions"
              placeholder="Enter the terms and conditions for this offer..."
              value={formData.termsConditions || ""}
              onChange={(e) => onUpdate("termsConditions", e.target.value)}
              rows={3}
              maxLength={1000}
              className="resize-none"
            />
            <p className="mt-1 text-gray-500 text-xs">
              {(formData.termsConditions || "").length}/1000 characters
            </p>
          </div>

          {/* Usage Settings - Inline */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="usageLimitPerCustomer"
                className="text-sm text-gray-600 whitespace-nowrap"
              >
                Uses per customer:
              </Label>
              <select
                id="usageLimitPerCustomer"
                value={formData.usageLimitPerCustomer || "1"}
                onChange={(e) =>
                  onUpdate("usageLimitPerCustomer", e.target.value)
                }
                className="h-8 px-2 text-sm border rounded-md bg-white"
              >
                <option value="1">1 time</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="5">5 times</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="redemptionRollingPeriod"
                className="text-sm text-gray-600 whitespace-nowrap"
              >
                Resets:
              </Label>
              <select
                id="redemptionRollingPeriod"
                value={formData.redemptionRollingPeriod || "single"}
                onChange={(e) =>
                  onUpdate("redemptionRollingPeriod", e.target.value)
                }
                className="h-8 px-2 text-sm border rounded-md bg-white"
              >
                <option value="single">Never</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StepOfferContent };
