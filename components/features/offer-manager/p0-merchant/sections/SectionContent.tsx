"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  IMAGE_GUIDELINES,
  validateImageFile,
  getImageDimensions,
} from "./shared";

interface SectionContentProps {
  errors?: Record<string, string>;
  formData: {
    offerName?: string;
    description?: string;
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
  };
  onUpdate: (field: string, value: any) => void;
}

export default function SectionContent({
  formData,
  onUpdate,
  errors = {},
}: SectionContentProps) {
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
    <div className="space-y-6">
      {/* Headline */}
      <div>
        <Label htmlFor="offerName" className="mb-1">
          Headline*
        </Label>
        <Input
          id="offerName"
          placeholder="e.g., '20% Off Your First Order'"
          value={localOfferName}
          onChange={(e) => {
            handleOfferNameChange(e.target.value);
          }}
          maxLength={60}
          className={cn(
            errors.offerName && "border-red-300 focus-visible:ring-red-500"
          )}
        />
        {errors.offerName ? (
          <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
            <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {errors.offerName}
          </p>
        ) : (
          <p className="mt-1.5 text-gray-700 text-sm">
            {localOfferName.length}/60 characters
            {localOfferName.length > 50 && (
              <span className="text-amber-600 ml-2">
                — may be truncated in cards
              </span>
            )}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-1">
          Description*
        </Label>
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
          className={cn(
            errors.description && "border-red-300 focus-visible:ring-red-500"
          )}
        />
        {errors.description ? (
          <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
            <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {errors.description}
          </p>
        ) : (
          <p className="mt-1.5 text-gray-700 text-sm">
            {(formData.description || "").length}/250 characters
            {(formData.description || "").length > 80 && (
              <span className="text-amber-600 ml-2">
                — shows "Read more" in detail view
              </span>
            )}
          </p>
        )}
      </div>

      {/* Image Uploads - side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offer Image */}
        <div>
          <Label className="mb-1">Offer Image</Label>
          <p className="text-gray-700 text-sm mb-3">
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
                    {formData.offerImageDimensions.width} x{" "}
                    {formData.offerImageDimensions.height}px
                    {formData.offerImageDimensions.width <
                      IMAGE_GUIDELINES.offerImage.minWidth ||
                    formData.offerImageDimensions.height <
                      IMAGE_GUIDELINES.offerImage.minHeight
                      ? " (below minimum)"
                      : ""}
                  </span>
                ) : (
                  <span className="text-gray-600">Dimensions unknown</span>
                )}
                <span className="text-gray-600">
                  Rec: {IMAGE_GUIDELINES.offerImage.recommended.width}x
                  {IMAGE_GUIDELINES.offerImage.recommended.height}px
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
              <PhotoIcon className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload
              </p>
              <p className="text-sm text-gray-600 mt-1">
                PNG or JPG - {IMAGE_GUIDELINES.offerImage.recommended.width}x
                {IMAGE_GUIDELINES.offerImage.recommended.height}px recommended
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

        {/* Offer Banner */}
        <div>
          <Label className="mb-1">Offer Banner</Label>
          <p className="text-gray-700 text-sm mb-3">
            {IMAGE_GUIDELINES.offerBanner.description}
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
                    {formData.offerBannerDimensions.width} x{" "}
                    {formData.offerBannerDimensions.height}px
                    {formData.offerBannerDimensions.width <
                      IMAGE_GUIDELINES.offerBanner.minWidth ||
                    formData.offerBannerDimensions.height <
                      IMAGE_GUIDELINES.offerBanner.minHeight
                      ? " (below minimum)"
                      : ""}
                  </span>
                ) : (
                  <span className="text-gray-600">Dimensions unknown</span>
                )}
                <span className="text-gray-600">
                  Rec: {IMAGE_GUIDELINES.offerBanner.recommended.width}x
                  {IMAGE_GUIDELINES.offerBanner.recommended.height}px
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
              <PhotoIcon className="w-6 h-6 text-gray-500 mb-1" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload banner
              </p>
              <p className="text-sm text-gray-600">
                PNG or JPG - {IMAGE_GUIDELINES.offerBanner.recommended.width}x
                {IMAGE_GUIDELINES.offerBanner.recommended.height}px recommended
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
  );
}
