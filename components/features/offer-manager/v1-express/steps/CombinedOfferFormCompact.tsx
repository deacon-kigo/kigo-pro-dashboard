"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactSelectCreatable } from "@/components/ui/react-select-creatable";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import {
  InformationCircleIcon,
  TagIcon,
  GlobeAltIcon,
  QrCodeIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

interface CombinedOfferFormCompactProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
}

// Available offer sources
const OFFER_SOURCES = [
  { label: "MCM (Merchant Commerce Manager)", value: "MCM" },
  { label: "FMTC (FlexOffers)", value: "FMTC" },
  { label: "EBG (Enterprise Business Group)", value: "EBG" },
  { label: "RN (Retail Network)", value: "RN" },
  { label: "AUGEO (Augeo Platform)", value: "AUGEO" },
];

// Available categories
const AVAILABLE_CATEGORIES = [
  { label: "Food & Dining", value: "1" },
  { label: "Pizza", value: "2" },
  { label: "Burgers", value: "3" },
  { label: "Fine Dining", value: "4" },
  { label: "Fast Food", value: "5" },
  { label: "Cafe & Bakery", value: "6" },
  { label: "Retail", value: "7" },
  { label: "Clothing", value: "8" },
  { label: "Electronics", value: "9" },
  { label: "Home Goods", value: "10" },
  { label: "Entertainment", value: "11" },
  { label: "Movies", value: "12" },
  { label: "Sports Events", value: "13" },
  { label: "Services", value: "14" },
  { label: "Auto Repair", value: "15" },
  { label: "Home Services", value: "16" },
  { label: "Health & Wellness", value: "17" },
  { label: "Automotive", value: "18" },
  { label: "Travel", value: "19" },
];

// Available commodities
const AVAILABLE_COMMODITIES = [
  { label: "Entrees", value: "1" },
  { label: "Appetizers", value: "2" },
  { label: "Desserts", value: "3" },
  { label: "Beverages", value: "4" },
  { label: "Alcohol", value: "5" },
  { label: "Gift Cards", value: "6" },
  { label: "Merchandise", value: "7" },
  { label: "Services", value: "8" },
];

export default function CombinedOfferFormCompact({
  formData,
  onUpdate,
}: CombinedOfferFormCompactProps) {
  const categoryIds = formData.category_ids || [];
  const commodityIds = formData.commodity_ids || [];

  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || formData.shortText || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalOfferName(formData.offerName || formData.shortText || "");
  }, [formData.offerName, formData.shortText]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Hardcoded values for Express template
  useEffect(() => {
    if (!formData.offerType) {
      onUpdate("offerType", "clk");
    }
    if (!formData.redemptionTypes || formData.redemptionTypes.length === 0) {
      onUpdate("redemptionTypes", ["external_url"]);
    }
    if (!formData.promoCodeType) {
      onUpdate("promoCodeType", "single");
    }
    if (!formData.locationScope) {
      onUpdate("locationScope", "all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* Basic Information - Two Column Layout */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="size-4" />
              <span>Basic Information</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0">
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="merchant">Merchant*</Label>
                <ReactSelectCreatable
                  options={OFFER_SOURCES}
                  value={formData.merchant || null}
                  onChange={(value) => onUpdate("merchant", value)}
                  placeholder="Select existing or create new merchant"
                  formatCreateLabel={(inputValue) =>
                    `Create new merchant "${inputValue.toUpperCase().replace(/\s+/g, "_")}"`
                  }
                  helperText="Merchant or partner providing this offer"
                />
              </div>

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

              <div>
                <Label htmlFor="startDate">Start Date*</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onUpdate("startDate", e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="offerSource">Offer Source*</Label>
                <ReactSelectCreatable
                  options={OFFER_SOURCES}
                  value={formData.offerSource || null}
                  onChange={(value) => onUpdate("offerSource", value)}
                  placeholder="Select or create offer source"
                  formatCreateLabel={(inputValue) =>
                    `Create source "${inputValue.toUpperCase()}"`
                  }
                  helperText="Source of this offer"
                />
              </div>

              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed offer description"
                  value={formData.description || formData.longText || ""}
                  onChange={(e) => {
                    onUpdate("description", e.target.value);
                    onUpdate("longText", e.target.value);
                  }}
                  rows={3}
                  maxLength={250}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  {(formData.description || formData.longText || "").length}/250
                  characters
                </p>
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => onUpdate("endDate", e.target.value)}
                  min={formData.startDate}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  Leave blank for no expiration
                </p>
              </div>
            </div>

            {/* Full Width - Terms */}
            <div className="lg:col-span-2">
              <Label htmlFor="termsConditions">Terms & Conditions*</Label>
              <Textarea
                id="termsConditions"
                placeholder="Enter the terms and conditions for this offer"
                value={formData.termsConditions}
                onChange={(e) => onUpdate("termsConditions", e.target.value)}
                rows={3}
                maxLength={1000}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                {(formData.termsConditions || "").length}/1000 characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classification - Two Column Layout */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
              <span>Classification</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label htmlFor="offerType">Offer Type*</Label>
              <Select
                value={formData.offerType}
                onValueChange={(value) => onUpdate("offerType", value)}
                disabled={true}
              >
                <SelectTrigger id="offerType" className="bg-gray-50">
                  <SelectValue placeholder="Select offer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bogo">BOGO (Buy One Get One)</SelectItem>
                  <SelectItem value="percent_off">Percentage Off</SelectItem>
                  <SelectItem value="dollar_off">Dollar Amount Off</SelectItem>
                  <SelectItem value="free">Free Item/Service</SelectItem>
                  <SelectItem value="clk">CLK (Click-through)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                Express Template: CLK offers use External Link redemption only
              </p>
            </div>

            <div>
              <Label htmlFor="categories">Categories</Label>
              <ReactSelectMulti
                options={AVAILABLE_CATEGORIES}
                values={categoryIds}
                onChange={(values) => onUpdate("category_ids", values)}
                placeholder="Select categories..."
                maxDisplayValues={3}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Select one or more categories
              </p>
            </div>

            <div>
              <Label htmlFor="commodities">Commodities Group</Label>
              <ReactSelectMulti
                options={AVAILABLE_COMMODITIES}
                values={commodityIds}
                onChange={(values) => onUpdate("commodity_ids", values)}
                placeholder="Select commodities group..."
                maxDisplayValues={3}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Select specific items or services
              </p>
            </div>

            <div>
              <Label htmlFor="cuisineType">Commodities</Label>
              <Select
                value={formData.cuisineType}
                onValueChange={(value) => onUpdate("cuisineType", value)}
              >
                <SelectTrigger id="cuisineType">
                  <SelectValue placeholder="Select commodities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="fast_food">Fast Food</SelectItem>
                  <SelectItem value="cafe">Café/Bakery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Method - Compact Layout */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="size-4" />
              <span>Redemption Method</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <Label>Redemption Types* (Pre-selected for Express)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Mobile - Disabled */}
              <Card className="p-3 opacity-50 cursor-not-allowed bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-500">
                        Mobile
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Show in mobile app
                    </p>
                  </div>
                </div>
              </Card>

              {/* Online Print - Disabled */}
              <Card className="p-3 opacity-50 cursor-not-allowed bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PrinterIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-500">
                        Online Print
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Print from website
                    </p>
                  </div>
                </div>
              </Card>

              {/* External URL - Selected */}
              <Card className="p-3 bg-blue-50 border-primary border-2">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <GlobeAltIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">External Link</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Redirect to website
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-1">
                Express Template: External Link Only
              </p>
              <p className="text-sm text-blue-600">
                CLK offers use External Link redemption only. Mobile and Online
                Print options are not available.
              </p>
            </div>
          </div>

          {/* Two Column Grid for URL and Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label htmlFor="externalUrl">External URL*</Label>
              <Input
                id="externalUrl"
                type="url"
                placeholder="https://example.com/offer"
                value={formData.externalUrl}
                onChange={(e) => onUpdate("externalUrl", e.target.value)}
              />
              <p className="text-muted-foreground text-sm mt-2">
                Customers redirected here when they click "Redeem"
              </p>
            </div>

            <div>
              <Label htmlFor="promoCode">Static Promo Code*</Label>
              <Input
                id="promoCode"
                placeholder="e.g., SAVE20"
                value={formData.promoCode}
                onChange={(e) =>
                  onUpdate("promoCode", e.target.value.toUpperCase())
                }
                className="font-mono text-lg"
                maxLength={20}
              />
              <p className="text-muted-foreground text-sm mt-2">
                This single code will be shown to all customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits - Two Column Layout */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="size-4" />
              <span>Usage Limits</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label htmlFor="usageLimitPerCustomer">Uses Per Customer*</Label>
              <Select
                value={formData.usageLimitPerCustomer}
                onValueChange={(value) =>
                  onUpdate("usageLimitPerCustomer", value)
                }
              >
                <SelectTrigger id="usageLimitPerCustomer">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 time</SelectItem>
                  <SelectItem value="2">2 times</SelectItem>
                  <SelectItem value="3">3 times</SelectItem>
                  <SelectItem value="5">5 times</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-sm mt-2">
                How many times each customer can use this offer
              </p>
            </div>

            <div>
              <Label htmlFor="totalUsageLimit">Total Redemptions Allowed</Label>
              <Input
                id="totalUsageLimit"
                type="number"
                placeholder="e.g., 1000"
                value={formData.totalUsageLimit}
                onChange={(e) => onUpdate("totalUsageLimit", e.target.value)}
                min="1"
              />
              <p className="text-muted-foreground text-sm mt-2">
                Total redemptions across all customers. Leave blank for
                unlimited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
