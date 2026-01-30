"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  InformationCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
  getDefaultDates,
} from "@/lib/constants/offer-templates";

/**
 * Step 3: Offer Details
 *
 * Type-specific form fields for discount, headline, description, and dates.
 */

interface StepOfferDetailsProps {
  offerType: OfferTypeKey;
  formData: {
    discountValue?: string;
    offerName?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function StepOfferDetails({
  offerType,
  formData,
  onUpdate,
}: StepOfferDetailsProps) {
  const typeConfig = OFFER_TYPE_CONFIG[offerType];
  const [noExpiration, setNoExpiration] = useState(!formData.endDate);
  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Offer Details Section */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <InformationCircleIcon className="size-4" />
          <span>Offer Details</span>
        </div>
        <div className="px-4 pb-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Discount Value - Type Specific */}
              <div>
                <Label htmlFor="discountValue">
                  {typeConfig.discountLabel}*
                </Label>
                <div className="relative mt-1">
                  {typeConfig.discountPrefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {typeConfig.discountSuffix}
                    </span>
                  )}
                </div>
                {offerType === "bogo" ? (
                  <p className="mt-2 text-muted-foreground text-sm">
                    Describe the item (e.g., "Any entrée", "Medium pizza")
                  </p>
                ) : (
                  <p className="mt-2 text-muted-foreground text-sm">
                    The discount amount for this offer
                  </p>
                )}
              </div>

              {/* Headline */}
              <div>
                <Label htmlFor="offerName">Offer Name*</Label>
                <Input
                  id="offerName"
                  placeholder="e.g., '20% Off Dinner'"
                  value={localOfferName}
                  onChange={(e) => handleOfferNameChange(e.target.value)}
                  maxLength={60}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  {localOfferName.length}/60 characters
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Description */}
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed offer description"
                  value={formData.description || ""}
                  onChange={(e) => {
                    onUpdate("description", e.target.value);
                    onUpdate("longText", e.target.value);
                  }}
                  rows={3}
                  maxLength={250}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  {(formData.description || "").length}/250 characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dates Section */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <CalendarIcon className="size-4" />
          <span>Offer Dates</span>
        </div>
        <div className="px-4 pb-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              <div className="flex items-center gap-2 mt-2">
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
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  No expiration
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StepOfferDetails };
