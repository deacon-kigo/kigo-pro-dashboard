"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { cn } from "@/lib/utils";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
  getDefaultDates,
} from "@/lib/constants/offer-templates";

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

// Image dimension guidelines
const IMAGE_GUIDELINES = {
  offerImage: {
    recommended: { width: 400, height: 400 },
    minWidth: 200,
    minHeight: 200,
    aspectRatio: "1:1 (square)",
    description: "Square image for offer cards and circle logo overlay",
  },
  offerBanner: {
    recommended: { width: 1200, height: 400 },
    minWidth: 600,
    minHeight: 200,
    aspectRatio: "3:1 (wide)",
    description: "Wide banner for offer detail hero section",
  },
};

interface ImageDimensions {
  width: number;
  height: number;
}

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
    // Offer Image (defaults to merchant logo)
    offerImageFile?: File | null;
    offerImagePreview?: string;
    offerImageAlt?: string;
    offerImageSource?: "none" | "merchant" | "custom";
    offerImageDimensions?: ImageDimensions | null;
    // Offer Banner (defaults to merchant banner)
    offerBannerFile?: File | null;
    offerBannerPreview?: string;
    offerBannerAlt?: string;
    offerBannerSource?: "none" | "merchant" | "custom";
    offerBannerDimensions?: ImageDimensions | null;
    // Other fields
    termsConditions?: string;
    usageLimitPerCustomer?: string;
    redemptionRollingPeriod?: string;
    category_ids?: string[];
    commodity_ids?: string[];
    // Auto-fill tracking
    headlineAutoFilled?: boolean;
    descriptionAutoFilled?: boolean;
    categoriesAutoFilled?: boolean;
    commoditiesAutoFilled?: boolean;
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
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  // Validate image file (shared helper)
  const validateImageFile = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only PNG and JPG files are allowed.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB.");
      return false;
    }
    return true;
  };

  // Helper to get image dimensions from a file
  const getImageDimensions = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Helper to get image dimensions from a URL
  const getImageDimensionsFromUrl = (
    url: string
  ): Promise<ImageDimensions | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  };

  // === Offer Image Handlers ===
  const handleImageUpload = async (file: File) => {
    if (!validateImageFile(file)) return;
    const dimensions = await getImageDimensions(file);
    onUpdate("offerImageFile", file);
    onUpdate("offerImagePreview", URL.createObjectURL(file));
    onUpdate("offerImageSource", "custom"); // Mark as custom upload
    onUpdate("offerImageDimensions", dimensions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    onUpdate("offerImageFile", null);
    onUpdate("offerImagePreview", "");
    onUpdate("offerImageAlt", "");
    onUpdate("offerImageSource", "none");
    onUpdate("offerImageDimensions", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === Offer Banner Handlers ===
  const handleBannerUpload = async (file: File) => {
    if (!validateImageFile(file)) return;
    const dimensions = await getImageDimensions(file);
    onUpdate("offerBannerFile", file);
    onUpdate("offerBannerPreview", URL.createObjectURL(file));
    onUpdate("offerBannerSource", "custom"); // Mark as custom upload
    onUpdate("offerBannerDimensions", dimensions);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleBannerUpload(file);
  };

  const handleBannerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleBannerUpload(file);
  };

  const handleRemoveBanner = () => {
    onUpdate("offerBannerFile", null);
    onUpdate("offerBannerPreview", "");
    onUpdate("offerBannerAlt", "");
    onUpdate("offerBannerSource", "none");
    onUpdate("offerBannerDimensions", null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
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
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="offerName">Headline*</Label>
                  {formData.headlineAutoFilled && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Suggested
                    </span>
                  )}
                </div>
                <Input
                  id="offerName"
                  placeholder="e.g., '20% Off Your First Order'"
                  value={localOfferName}
                  onChange={(e) => {
                    handleOfferNameChange(e.target.value);
                    // Clear auto-fill flag when user edits
                    if (formData.headlineAutoFilled) {
                      onUpdate("headlineAutoFilled", false);
                    }
                  }}
                  maxLength={60}
                />
                <p className="mt-2 text-gray-600 text-sm">
                  {localOfferName.length}/60 characters
                  {localOfferName.length > 50 && (
                    <span className="text-amber-600 ml-2">
                      — may be truncated in cards
                    </span>
                  )}
                </p>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="description">Description*</Label>
                  {formData.descriptionAutoFilled && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Suggested
                    </span>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe what customers get with this offer..."
                  value={formData.description || ""}
                  onChange={(e) => {
                    onUpdate("description", e.target.value);
                    onUpdate("longText", e.target.value);
                    // Clear auto-fill flag when user edits
                    if (formData.descriptionAutoFilled) {
                      onUpdate("descriptionAutoFilled", false);
                    }
                  }}
                  rows={3}
                  maxLength={250}
                />
                <p className="mt-2 text-gray-600 text-sm">
                  {(formData.description || "").length}/250 characters
                  {(formData.description || "").length > 80 && (
                    <span className="text-amber-600 ml-2">
                      — shows "Read more" in detail view
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right Column - Image Uploads */}
            <div className="space-y-6">
              {/* Offer Image (defaults to merchant logo) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Offer Image</Label>
                  {formData.offerImageSource === "merchant" && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Using merchant logo
                    </span>
                  )}
                  {formData.offerImageSource === "custom" && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Custom upload
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {formData.offerImageSource === "merchant"
                    ? "Defaults to merchant logo. Upload to override."
                    : IMAGE_GUIDELINES.offerImage.description}
                </p>

                {formData.offerImagePreview ? (
                  <div className="space-y-2">
                    <div className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                      <img
                        src={formData.offerImagePreview}
                        alt={formData.offerImageAlt || "Offer preview"}
                        className="w-full h-36 object-cover"
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
                    {/* Dimension display */}
                    <div className="flex items-center justify-between text-xs">
                      {formData.offerImageDimensions ? (
                        <span
                          className={cn(
                            "font-medium",
                            formData.offerImageDimensions.width >=
                              IMAGE_GUIDELINES.offerImage.minWidth &&
                              formData.offerImageDimensions.height >=
                                IMAGE_GUIDELINES.offerImage.minHeight
                              ? "text-green-600"
                              : "text-amber-600"
                          )}
                        >
                          {formData.offerImageDimensions.width} ×{" "}
                          {formData.offerImageDimensions.height}px
                          {formData.offerImageDimensions.width <
                            IMAGE_GUIDELINES.offerImage.minWidth ||
                          formData.offerImageDimensions.height <
                            IMAGE_GUIDELINES.offerImage.minHeight
                            ? " (below minimum)"
                            : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Dimensions unknown
                        </span>
                      )}
                      <span className="text-gray-500">
                        Recommended:{" "}
                        {IMAGE_GUIDELINES.offerImage.recommended.width}×
                        {IMAGE_GUIDELINES.offerImage.recommended.height}px (
                        {IMAGE_GUIDELINES.offerImage.aspectRatio})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex flex-col items-center justify-center h-36 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG or JPG •{" "}
                      {IMAGE_GUIDELINES.offerImage.recommended.width}×
                      {IMAGE_GUIDELINES.offerImage.recommended.height}px
                      recommended
                    </p>
                    <p className="text-xs text-gray-400">
                      Min: {IMAGE_GUIDELINES.offerImage.minWidth}×
                      {IMAGE_GUIDELINES.offerImage.minHeight}px • Max 5MB
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
              </div>

              {/* Offer Banner (defaults to merchant banner) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Offer Banner</Label>
                  {formData.offerBannerSource === "merchant" && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Using merchant banner
                    </span>
                  )}
                  {formData.offerBannerSource === "custom" && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Custom upload
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {formData.offerBannerSource === "merchant"
                    ? "Defaults to merchant banner. Upload to override."
                    : IMAGE_GUIDELINES.offerBanner.description}
                </p>

                {formData.offerBannerPreview ? (
                  <div className="space-y-2">
                    <div className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                      <img
                        src={formData.offerBannerPreview}
                        alt={formData.offerBannerAlt || "Banner preview"}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                          title="Replace banner"
                        >
                          <ArrowPathIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveBanner}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                          title="Remove banner"
                        >
                          <XMarkIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    {/* Dimension display */}
                    <div className="flex items-center justify-between text-xs">
                      {formData.offerBannerDimensions ? (
                        <span
                          className={cn(
                            "font-medium",
                            formData.offerBannerDimensions.width >=
                              IMAGE_GUIDELINES.offerBanner.minWidth &&
                              formData.offerBannerDimensions.height >=
                                IMAGE_GUIDELINES.offerBanner.minHeight
                              ? "text-green-600"
                              : "text-amber-600"
                          )}
                        >
                          {formData.offerBannerDimensions.width} ×{" "}
                          {formData.offerBannerDimensions.height}px
                          {formData.offerBannerDimensions.width <
                            IMAGE_GUIDELINES.offerBanner.minWidth ||
                          formData.offerBannerDimensions.height <
                            IMAGE_GUIDELINES.offerBanner.minHeight
                            ? " (below minimum)"
                            : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Dimensions unknown
                        </span>
                      )}
                      <span className="text-gray-500">
                        Recommended:{" "}
                        {IMAGE_GUIDELINES.offerBanner.recommended.width}×
                        {IMAGE_GUIDELINES.offerBanner.recommended.height}px (
                        {IMAGE_GUIDELINES.offerBanner.aspectRatio})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    onDrop={handleBannerDrop}
                    onDragOver={handleDragOver}
                    className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload banner
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG or JPG •{" "}
                      {IMAGE_GUIDELINES.offerBanner.recommended.width}×
                      {IMAGE_GUIDELINES.offerBanner.recommended.height}px
                      recommended
                    </p>
                    <p className="text-xs text-gray-400">
                      Min: {IMAGE_GUIDELINES.offerBanner.minWidth}×
                      {IMAGE_GUIDELINES.offerBanner.minHeight}px • Max 5MB
                    </p>
                  </div>
                )}

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <TagIcon className="size-4" />
          <span>Classification</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="categories">Categories</Label>
                {formData.categoriesAutoFilled && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Suggested from merchant
                  </span>
                )}
              </div>
              <ReactSelectMulti
                options={AVAILABLE_CATEGORIES}
                values={formData.category_ids || []}
                onChange={(values) => {
                  onUpdate("category_ids", values);
                  // Clear auto-fill flag when user changes
                  if (formData.categoriesAutoFilled) {
                    onUpdate("categoriesAutoFilled", false);
                  }
                }}
                placeholder="Select categories..."
                maxDisplayValues={3}
              />
              <p className="mt-2 text-gray-600 text-sm">
                {formData.categoriesAutoFilled
                  ? "Based on merchant type. Edit to customize."
                  : "Select one or more categories"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="commodities">Commodities Group</Label>
                {formData.commoditiesAutoFilled && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Suggested from merchant
                  </span>
                )}
              </div>
              <ReactSelectMulti
                options={AVAILABLE_COMMODITIES}
                values={formData.commodity_ids || []}
                onChange={(values) => {
                  onUpdate("commodity_ids", values);
                  // Clear auto-fill flag when user changes
                  if (formData.commoditiesAutoFilled) {
                    onUpdate("commoditiesAutoFilled", false);
                  }
                }}
                placeholder="Select commodities group..."
                maxDisplayValues={3}
              />
              <p className="mt-2 text-gray-600 text-sm">
                {formData.commoditiesAutoFilled
                  ? "Based on merchant type. Edit to customize."
                  : "Select specific items or services"}
              </p>
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
