"use client";

import React, { useState, useRef, useEffect } from "react";
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

  // Local state for immediate UI updates (fixes INP performance issue)
  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || formData.shortText || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with formData when it changes externally
  useEffect(() => {
    setLocalOfferName(formData.offerName || formData.shortText || "");
  }, [formData.offerName, formData.shortText]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced handler for offer name changes (fixes INP issue)
  const handleOfferNameChange = (value: string) => {
    // Update local state immediately for responsive UI
    setLocalOfferName(value);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state updates to avoid blocking main thread
    debounceTimerRef.current = setTimeout(() => {
      onUpdate("offerName", value);
      // Keep backward compatibility with shortText
      onUpdate("shortText", value);
    }, 150); // 150ms debounce
  };

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
              placeholder="Select or create offer source"
              formatCreateLabel={(inputValue) =>
                `Create source "${inputValue.toUpperCase()}"`
              }
              helperText="Source of this offer (e.g., MCM, FMTC, EBG, RN, AUGEO)"
            />
          </div>

          <div>
            <Label htmlFor="offerName">Offer Name*</Label>
            <Input
              id="offerName"
              placeholder="Brief offer name for listing view (e.g., '20% Off Dinner')"
              value={localOfferName}
              onChange={(e) => handleOfferNameChange(e.target.value)}
              maxLength={60}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {localOfferName.length}/60 characters - Used for short description
              in UX
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
              characters - Used in long description on offer details page
            </p>
          </div>

          <div>
            <Label htmlFor="offerImage">Offer Image</Label>
            {!formData.offerImageFile ? (
              <>
                <div className="border-2 border-dashed rounded-lg p-6 transition-colors border-gray-300 hover:border-gray-400">
                  <div className="flex flex-col items-center justify-center text-center">
                    <svg
                      className="h-8 w-8 mb-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium mb-2 text-gray-600">
                      Upload Offer Image
                    </p>
                    <p className="text-sm mb-4 text-gray-500">
                      PNG or JPG (max 5MB)
                    </p>
                    <input
                      type="file"
                      id="offerImageUpload"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File must be under 5MB");
                            return;
                          }
                          onUpdate("offerImageFile", file);
                          onUpdate(
                            "offerImagePreview",
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("offerImageUpload")?.click()
                      }
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Choose file
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {formData.offerImagePreview && (
                        <img
                          src={formData.offerImagePreview}
                          alt={formData.offerImageAlt || "Offer image"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {formData.offerImageFile.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="offerImageReplace"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert("File must be under 5MB");
                                return;
                              }
                              onUpdate("offerImageFile", file);
                              onUpdate(
                                "offerImagePreview",
                                URL.createObjectURL(file)
                              );
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("offerImageReplace")
                              ?.click()
                          }
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdate("offerImageFile", null);
                            onUpdate("offerImagePreview", null);
                            onUpdate("offerImageAlt", "");
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {formData.offerImageFile && (
              <div className="mt-3">
                <Label htmlFor="offerImageAlt">Alt Text for Image*</Label>
                <Input
                  id="offerImageAlt"
                  placeholder="Describe the image for accessibility and SEO"
                  value={formData.offerImageAlt || ""}
                  onChange={(e) => onUpdate("offerImageAlt", e.target.value)}
                  maxLength={150}
                />
                <p className="mt-1 text-muted-foreground text-sm">
                  Important for search/AI optimization and accessibility
                </p>
              </div>
            )}
            <p className="mt-2 text-muted-foreground text-sm">
              Upload an image for the offer creative
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
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => onUpdate("endDate", e.target.value)}
                min={formData.startDate}
                disabled={formData.noExpiration}
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="noExpiration"
                  checked={formData.noExpiration || false}
                  onChange={(e) => {
                    onUpdate("noExpiration", e.target.checked);
                    if (e.target.checked) {
                      onUpdate("endDate", "");
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor="noExpiration"
                  className="text-sm font-normal cursor-pointer"
                >
                  No expiration
                </Label>
              </div>
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
                  onFocus={(e) => {
                    // Clear "0" on focus for better UX
                    if (e.target.value === "0") {
                      onUpdate("maxDiscount", "");
                    }
                    // Select all text for easy replacement
                    e.target.select();
                  }}
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder="10"
                  value={formData.discountValue}
                  onChange={(e) => onUpdate("discountValue", e.target.value)}
                  onFocus={(e) => {
                    // Clear "0" on focus for better UX
                    if (e.target.value === "0") {
                      onUpdate("discountValue", "");
                    }
                    // Select all text for easy replacement
                    e.target.select();
                  }}
                  className="pl-7"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                The discount amount in dollars for this offer
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
              maxLength={1000}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              {(formData.termsConditions || "").length}/1000 characters
            </p>
          </div>

          <div>
            <Label htmlFor="exclusions">Exclusions</Label>
            <Textarea
              id="exclusions"
              placeholder="List products or services NOT included in this offer"
              value={formData.exclusions || ""}
              onChange={(e) => onUpdate("exclusions", e.target.value)}
              rows={3}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              Specify any products, services, or conditions excluded from this
              offer
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
          {/* Offer Type - Moved to top per feedback */}
          <div>
            <Label htmlFor="offerType">Offer Type*</Label>
            <Select
              value={formData.offerType}
              onValueChange={(value) => {
                onUpdate("offerType", value);
                // If CLK is selected, automatically set External Link as redemption type
                if (value === "clk") {
                  onUpdate("redemptionTypes", ["external_url"]);
                } else {
                  // If changing FROM CLK to another type, clear External Link if it's the only redemption type
                  if (
                    formData.offerType === "clk" &&
                    formData.redemptionTypes?.length === 1 &&
                    formData.redemptionTypes[0] === "external_url"
                  ) {
                    onUpdate("redemptionTypes", []);
                  }
                }
              }}
            >
              <SelectTrigger id="offerType">
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
            {formData.offerType === "clk" && (
              <p className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                CLK offers require External Link redemption and cannot use
                Mobile or In-Store redemption methods.
              </p>
            )}
          </div>

          {/* Categories - Multi-Select */}
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
              placeholder="Select commodities group..."
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
  );
}
