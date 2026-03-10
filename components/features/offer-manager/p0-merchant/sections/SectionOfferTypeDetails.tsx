"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ExclamationTriangleIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { ReactSelectCreatable } from "@/components/ui/react-select-creatable";
import {
  IMAGE_GUIDELINES,
  validateImageFile,
  getImageDimensions,
} from "./shared";

// Offer source options — in production, fetched from API
const OFFER_SOURCE_OPTIONS = [
  { label: "MCM", value: "MCM" },
  { label: "FMTC", value: "FMTC" },
  { label: "EBG", value: "EBG" },
  { label: "RN", value: "RN" },
  { label: "AUGEO", value: "AUGEO" },
];

// Mock catalog filters — in production, fetched from API
const CATALOG_FILTER_OPTIONS = [
  { label: "Canada Marketplace", value: "CF001" },
  { label: "Country exclusive offers", value: "CF002" },
  { label: "Halloween Promotions", value: "CF003" },
  { label: "Holiday Season 2026", value: "CF004" },
  { label: "Premium Members Only", value: "CF005" },
  { label: "Regional Northeast", value: "CF006" },
  { label: "Summer Deals", value: "CF007" },
  { label: "US Marketplace", value: "CF008" },
];

interface SectionOfferDetailsProps {
  formData: {
    offerName?: string;
    description?: string;
    offerSource?: string;
    catalogFilterIds?: string[];
    startDate?: string;
    endDate?: string;
    discountValue?: string;
    maxDiscountAmount?: string;
    offerImageFile?: File | null;
    offerImagePreview?: string;
    offerImageAlt?: string;
    offerImageSource?: "none" | "merchant" | "custom";
    offerImageDimensions?: { width: number; height: number } | null;
    offerBannerFile?: File | null;
    offerBannerPreview?: string;
    offerBannerAlt?: string;
    offerBannerSource?: "none" | "merchant" | "custom";
    offerBannerDimensions?: { width: number; height: number } | null;
    termsConditions?: string;
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionOfferDetails({
  formData,
  onUpdate,
  errors = {},
}: SectionOfferDetailsProps) {
  const [localOfferName, setLocalOfferName] = useState(
    formData.offerName || ""
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalOfferName(formData.offerName || "");
  }, [formData.offerName]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleOfferNameChange = (value: string) => {
    setLocalOfferName(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onUpdate("offerName", value);
      onUpdate("shortText", value);
    }, 150);
  };

  // === Offer Image Handlers ===
  const handleImageUpload = async (file: File) => {
    if (!validateImageFile(file)) return;
    const dimensions = await getImageDimensions(file);
    onUpdate("offerImageFile", file);
    onUpdate("offerImagePreview", URL.createObjectURL(file));
    onUpdate("offerImageSource", "custom");
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
    onUpdate("offerBannerSource", "custom");
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
    <div className="space-y-5">
      {/* Row 1: Offer Name + Description — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="offerName">Offer Name*</Label>
          <Input
            id="offerName"
            placeholder="e.g., '20% Off Dinner'"
            value={localOfferName}
            onChange={(e) => handleOfferNameChange(e.target.value)}
            maxLength={60}
            className={cn(
              "mt-1",
              errors.offerName && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.offerName ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.offerName}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              {localOfferName.length}/60 characters — Used for short description
              in UX
            </p>
          )}
        </div>
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
            rows={2}
            maxLength={250}
            className={cn(
              "mt-1 resize-none",
              errors.description && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.description ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.description}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              {(formData.description || "").length}/250 characters — Used in
              long description on offer details page
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Offer Source */}
      <div>
        <Label htmlFor="offerSource">Offer Source*</Label>
        <div className="mt-1">
          <ReactSelectCreatable
            options={OFFER_SOURCE_OPTIONS}
            value={formData.offerSource || null}
            onChange={(value) => onUpdate("offerSource", value)}
            placeholder="Select or create offer source"
            isValidNewOption={(input) => {
              if (!input || input.trim().length < 3 || input.length > 60)
                return false;
              return /^[A-Za-z0-9_\s]+$/.test(input);
            }}
            formatCreateLabel={(input) => `Create "${input.toUpperCase()}"`}
          />
        </div>
        <p className="mt-1.5 text-gray-500 text-sm">
          Source of this offer (3-60 chars, uppercase, underscores only)
        </p>
      </div>

      {/* Row 3: Catalog Filter */}
      <div>
        <Label htmlFor="catalogFilterIds">
          What catalog filter is this offer exclusive to?
        </Label>
        <div className="mt-1">
          <ReactSelectMulti
            options={CATALOG_FILTER_OPTIONS}
            values={formData.catalogFilterIds || []}
            onChange={(values) => onUpdate("catalogFilterIds", values)}
            placeholder="Select options"
            maxDisplayValues={3}
          />
        </div>
      </div>

      {/* Row 4: Start Date + End Date — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="date"
            placeholder="Select start date"
            value={formData.startDate || ""}
            onChange={(e) => onUpdate("startDate", e.target.value)}
            className={cn(
              "mt-1",
              errors.startDate && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.startDate && (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.startDate}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            placeholder="Select end date"
            value={formData.endDate || ""}
            onChange={(e) => onUpdate("endDate", e.target.value)}
            min={formData.startDate}
            className={cn(
              "mt-1",
              errors.endDate && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.endDate ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.endDate}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              Leave blank for no expiration
            </p>
          )}
        </div>
      </div>

      {/* Row 5: Discount Value + Max Discount Amount — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discountValue">Discount Value*</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              id="discountValue"
              type="number"
              value={formData.discountValue || ""}
              onChange={(e) => onUpdate("discountValue", e.target.value)}
              onFocus={(e) => {
                if (e.target.value === "0") onUpdate("discountValue", "");
                e.target.select();
              }}
              className={cn(
                "pl-7",
                errors.discountValue &&
                  "border-red-300 focus-visible:ring-red-500"
              )}
              min="0"
              step="0.01"
            />
          </div>
          {errors.discountValue ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.discountValue}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              The discount amount in dollars for this offer
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="maxDiscountAmount">Max Discount Amount</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              $
            </span>
            <Input
              id="maxDiscountAmount"
              type="number"
              value={formData.maxDiscountAmount || ""}
              onChange={(e) => onUpdate("maxDiscountAmount", e.target.value)}
              onFocus={(e) => {
                if (e.target.value === "0") onUpdate("maxDiscountAmount", "");
                e.target.select();
              }}
              className="pl-7"
              min="0"
              step="0.01"
            />
          </div>
          <p className="mt-1.5 text-gray-500 text-sm">
            Maximum discount value if applicable
          </p>
        </div>
      </div>

      {/* Row 6: Offer Image + Offer Banner — side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Offer Image */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label>Offer Image</Label>
            {formData.offerImageSource === "merchant" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Using merchant logo
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">
            {IMAGE_GUIDELINES.offerImage.description}
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
                    <ArrowUpTrayIcon className="w-4 h-4 text-gray-600" />
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
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center h-36 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
            >
              <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Upload file</p>
              <p className="text-xs text-gray-500 mt-1">
                JPG or PNG (max file size: 2MB)
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
          <p className="mt-1.5 text-gray-500 text-sm">
            Recommended: {IMAGE_GUIDELINES.offerImage.recommended.width}x
            {IMAGE_GUIDELINES.offerImage.recommended.height}px (
            {IMAGE_GUIDELINES.offerImage.aspectRatio})
          </p>
        </div>

        {/* Offer Banner Image */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label>Offer Banner Image</Label>
            {formData.offerBannerSource === "merchant" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Using merchant banner
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">
            {IMAGE_GUIDELINES.offerBanner.description}
          </p>

          {formData.offerBannerPreview ? (
            <div className="space-y-2">
              <div className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                <img
                  src={formData.offerBannerPreview}
                  alt={formData.offerBannerAlt || "Banner preview"}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Replace banner"
                  >
                    <ArrowUpTrayIcon className="w-4 h-4 text-gray-600" />
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
            </div>
          ) : (
            <div
              onClick={() => bannerInputRef.current?.click()}
              onDrop={handleBannerDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center h-36 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
            >
              <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Upload file</p>
              <p className="text-xs text-gray-500 mt-1">
                JPG or PNG (max file size: 2MB)
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
          <p className="mt-1.5 text-gray-500 text-sm">
            Recommended: {IMAGE_GUIDELINES.offerBanner.recommended.width}x
            {IMAGE_GUIDELINES.offerBanner.recommended.height}px (
            {IMAGE_GUIDELINES.offerBanner.aspectRatio})
          </p>
        </div>
      </div>

      {/* Row 7: Terms and Conditions */}
      <div>
        <Label htmlFor="termsConditions">Terms and Conditions</Label>
        <Textarea
          id="termsConditions"
          placeholder="Enter the terms and conditions for this offer"
          value={formData.termsConditions || ""}
          onChange={(e) => onUpdate("termsConditions", e.target.value)}
          rows={4}
          maxLength={1000}
          className="mt-1 resize-none"
        />
        <p className="mt-1.5 text-gray-500 text-sm">
          {(formData.termsConditions || "").length}/1000 characters
        </p>
      </div>
    </div>
  );
}
