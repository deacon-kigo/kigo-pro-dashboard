"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { ReactSelectCreatable } from "@/components/ui/react-select-creatable";
import { InformationCircleIcon, TagIcon } from "@heroicons/react/24/outline";

interface OfferDetailsStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

// Available offer sources (external reference values)
const OFFER_SOURCES = [
  { label: "MCM (Merchant Commerce Manager)", value: "MCM" },
  { label: "FMTC (FlexOffers)", value: "FMTC" },
  { label: "EBG (Enterprise Business Group)", value: "EBG" },
  { label: "RN (Retail Network)", value: "RN" },
  { label: "AUGEO (Augeo Platform)", value: "AUGEO" },
];

// Available categories (from config.categorisation table)
// In production, these would be fetched from GET /api/categories
// Flattened list for simple multi-select
const AVAILABLE_CATEGORIES = [
  // Food & Dining
  { label: "Food & Dining", value: "1" },
  { label: "Pizza", value: "2" },
  { label: "Burgers", value: "3" },
  { label: "Fine Dining", value: "4" },
  { label: "Fast Food", value: "5" },
  { label: "Cafe & Bakery", value: "6" },
  // Retail
  { label: "Retail", value: "7" },
  { label: "Clothing", value: "8" },
  { label: "Electronics", value: "9" },
  { label: "Home Goods", value: "10" },
  // Entertainment
  { label: "Entertainment", value: "11" },
  { label: "Movies", value: "12" },
  { label: "Sports Events", value: "13" },
  // Services
  { label: "Services", value: "14" },
  { label: "Auto Repair", value: "15" },
  { label: "Home Services", value: "16" },
  // Other
  { label: "Health & Wellness", value: "17" },
  { label: "Automotive", value: "18" },
  { label: "Travel", value: "19" },
];

// Available commodities (from config.commodities table)
// In production, these would be fetched from GET /api/commodities
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

export default function OfferDetailsStepV1({
  formData,
  onUpdate,
}: OfferDetailsStepProps) {
  // Initialize category_ids and commodity_ids arrays (matching API structure)
  const categoryIds = formData.category_ids || [];
  const commodityIds = formData.commodity_ids || [];

  return (
    <div className="space-y-4">
      {/* Basic Information Section */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="size-4" />
              <span>Basic Information</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
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
              helperText="Merchant or partner providing this offer (e.g., MCM, FMTC, EBG, RN, AUGEO)"
            />
          </div>

          <div>
            <Label htmlFor="offerSource">Offer Source*</Label>
            <ReactSelectCreatable
              options={OFFER_SOURCES}
              value={formData.offerSource || null}
              onChange={(value) => onUpdate("offerSource", value)}
              placeholder="Select existing or create new offer source"
              formatCreateLabel={(inputValue) =>
                `Create new source "${inputValue.toUpperCase().replace(/\s+/g, "_")}"`
              }
              helperText="Source system or feed where offer originated (3-60 chars, uppercase, underscores only)"
            />
          </div>

          <div>
            <Label htmlFor="offerName">Offer Name*</Label>
            <Input
              id="offerName"
              placeholder="Brief offer name for listing view (e.g., '20% Off Dinner')"
              value={formData.offerName || formData.shortText || ""}
              onChange={(e) => {
                onUpdate("offerName", e.target.value);
                // Keep backward compatibility with shortText
                onUpdate("shortText", e.target.value);
              }}
              maxLength={60}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.offerName || formData.shortText || "").length}/60
              characters - Shown in listing view
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Detailed offer description for detail view"
              value={formData.description || formData.longText || ""}
              onChange={(e) => {
                onUpdate("description", e.target.value);
                // Keep backward compatibility with longText
                onUpdate("longText", e.target.value);
              }}
              rows={4}
              maxLength={250}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.description || formData.longText || "").length}/250
              characters - Shown in detail view
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date*</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => onUpdate("startDate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxDiscount">Max Discount Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="maxDiscount"
                  type="number"
                  placeholder="50"
                  value={formData.maxDiscount}
                  onChange={(e) => onUpdate("maxDiscount", e.target.value)}
                  className="pl-7"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                Maximum discount value if applicable
              </p>
            </div>

            <div>
              <Label htmlFor="discountValue">Discount Value</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {formData.discountValueType === "percent" ? "%" : "$"}
                  </span>
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder={
                      formData.discountValueType === "percent" ? "20" : "10"
                    }
                    value={formData.discountValue}
                    onChange={(e) => onUpdate("discountValue", e.target.value)}
                    className="pl-7"
                    min="0"
                    step={
                      formData.discountValueType === "percent" ? "1" : "0.01"
                    }
                    max={
                      formData.discountValueType === "percent"
                        ? "100"
                        : undefined
                    }
                  />
                </div>
                <Select
                  value={formData.discountValueType || "dollar"}
                  onValueChange={(value) =>
                    onUpdate("discountValueType", value)
                  }
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dollar">Dollar ($)</SelectItem>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                The discount amount or percentage for this offer
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="termsConditions">Terms & Conditions*</Label>
            <Textarea
              id="termsConditions"
              placeholder="Enter the terms and conditions for this offer"
              value={formData.termsConditions}
              onChange={(e) => onUpdate("termsConditions", e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.termsConditions || "").length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
              <span>Classification</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          {/* Categories - Multi-Select (Moved to top for semantic importance) */}
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
              Select one or more categories for this offer.
            </p>
          </div>

          {/* Commodities Group - Multi-Select from Existing */}
          <div>
            <Label htmlFor="commodities">Commodities Group</Label>
            <ReactSelectMulti
              options={AVAILABLE_COMMODITIES}
              values={commodityIds}
              onChange={(values) => onUpdate("commodity_ids", values)}
              placeholder="Select commodities..."
              maxDisplayValues={3}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              Select specific items, products, or services included in this
              offer.
            </p>
          </div>

          <div>
            <Label htmlFor="cuisineType">Commodities</Label>
            <Select
              value={formData.cuisineType}
              onValueChange={(value) => onUpdate("cuisineType", value)}
            >
              <SelectTrigger id="cuisineType">
                <SelectValue placeholder="Select cuisine type" />
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

          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., dinner, lunch, drinks, pizza"
              value={formData.keywords}
              onChange={(e) => onUpdate("keywords", e.target.value)}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              Comma-separated keywords for search
            </p>
          </div>

          <div>
            <Label htmlFor="offerType">Offer Type*</Label>
            <Select
              value={formData.offerType}
              onValueChange={(value) => onUpdate("offerType", value)}
            >
              <SelectTrigger id="offerType">
                <SelectValue placeholder="Select offer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bogo">BOGO (Buy One Get One)</SelectItem>
                <SelectItem value="percent_off">Percentage Off</SelectItem>
                <SelectItem value="dollar_off">Dollar Amount Off</SelectItem>
                <SelectItem value="free">Free Item/Service</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
