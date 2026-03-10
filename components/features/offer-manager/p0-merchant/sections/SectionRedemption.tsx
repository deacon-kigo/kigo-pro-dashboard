"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DevicePhoneMobileIcon,
  PrinterIcon,
  GlobeAltIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";

// Available locations — in production, fetched from merchant's locations
const AVAILABLE_LOCATIONS = [
  { label: "Downtown Store - 123 Main St", value: "loc_1" },
  { label: "Westside Mall - 456 Shopping Blvd", value: "loc_2" },
  { label: "North Branch - 789 North Ave", value: "loc_3" },
  { label: "Eastside Center - 321 East St", value: "loc_4" },
  { label: "South Plaza - 654 South Rd", value: "loc_5" },
  { label: "Airport Location - 987 Terminal Dr", value: "loc_6" },
];

// Redemption type options
const REDEMPTION_TYPES = [
  {
    value: "mobile",
    label: "Mobile",
    description: "Show in mobile app",
    icon: DevicePhoneMobileIcon,
  },
  {
    value: "online_print",
    label: "Online Print",
    description: "Print from website",
    icon: PrinterIcon,
  },
  {
    value: "external_link",
    label: "External Link",
    description: "Redirect to website",
    icon: GlobeAltIcon,
  },
];

// Code type options
const CODE_TYPES = [
  {
    value: "single_code",
    label: "Single Code",
    description: "One code for all",
  },
  {
    value: "unique_codes",
    label: "Unique Codes",
    description: "Per-redemption",
  },
  {
    value: "barcode",
    label: "Barcode",
    description: "Upload image",
  },
  {
    value: "qr_code",
    label: "QR Code",
    description: "Scan to redeem",
  },
];

interface SectionRedemptionProps {
  formData: {
    redemptionTypes?: string[];
    location_ids?: string[];
    merchantData?: any;
    codeTypes?: string[];
    promoCode?: string;
    uniqueCodesFile?: File | null;
    barcodeFile?: File | null;
    barcodePreview?: string;
    qrCodeUrl?: string;
    externalUrl?: string;
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionRedemption({
  formData,
  onUpdate,
  errors = {},
}: SectionRedemptionProps) {
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedRedemptionTypes = formData.redemptionTypes || [];
  const selectedCodeTypes = formData.codeTypes || [];
  const hasMerchant = !!formData.merchantData;

  // Toggle a value in an array field
  const toggleArrayValue = (field: string, value: string) => {
    const current: string[] = (formData as any)[field] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onUpdate(field, updated);
  };

  // Handle barcode image upload
  const handleBarcodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only PNG, JPG, or SVG files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB.");
      return;
    }

    onUpdate("barcodeFile", file);
    onUpdate("barcodePreview", URL.createObjectURL(file));
  };

  // Handle CSV upload for unique codes
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpdate("uniqueCodesFile", file);
  };

  return (
    <div className="space-y-5">
      {/* Redemption Types */}
      <div>
        <Label>Redemption Types*</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {REDEMPTION_TYPES.map((type) => {
            const isSelected = selectedRedemptionTypes.includes(type.value);
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleArrayValue("redemptionTypes", type.value)}
                className={cn(
                  "flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
                  "hover:shadow-md",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mb-2",
                    isSelected ? "text-primary" : "text-gray-400"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-gray-900" : "text-gray-700"
                  )}
                >
                  {type.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations */}
      <div>
        <Label>Locations*</Label>
        <div className="mt-1">
          {hasMerchant ? (
            <ReactSelectMulti
              options={AVAILABLE_LOCATIONS}
              values={formData.location_ids || []}
              onChange={(values) => onUpdate("location_ids", values)}
              placeholder="Select locations..."
              maxDisplayValues={2}
            />
          ) : (
            <div className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-400">
              Select a merchant first
            </div>
          )}
        </div>
        <p className="mt-1.5 text-gray-500 text-sm">
          Select locations where this offer is available
        </p>
      </div>

      {/* Code Type */}
      <div>
        <Label>Code Type*</Label>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {CODE_TYPES.map((type) => {
            const isSelected = selectedCodeTypes.includes(type.value);
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleArrayValue("codeTypes", type.value)}
                className={cn(
                  "flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
                  "hover:shadow-md",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-200"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-gray-900" : "text-gray-700"
                  )}
                >
                  {type.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional fields based on Code Type selections */}

      {/* Single Code → Static Promo Code */}
      {selectedCodeTypes.includes("single_code") && (
        <div>
          <Label htmlFor="promoCode">Static Promo Code</Label>
          <Input
            id="promoCode"
            placeholder="e.g., SAVE20"
            value={formData.promoCode || ""}
            onChange={(e) =>
              onUpdate("promoCode", e.target.value.toUpperCase())
            }
            className={cn(
              "mt-1 font-mono",
              errors.promoCode && "border-red-300 focus-visible:ring-red-500"
            )}
            maxLength={20}
          />
          {errors.promoCode ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.promoCode}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              This single code will be shown to all customers. (3-20 chars,
              uppercase)
            </p>
          )}
        </div>
      )}

      {/* Unique Codes → CSV Upload */}
      {selectedCodeTypes.includes("unique_codes") && (
        <div>
          <Label htmlFor="uniqueCodesUpload">Upload Unique Codes</Label>
          <div className="mt-1">
            {formData.uniqueCodesFile ? (
              <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                <span className="text-sm text-gray-700">
                  {formData.uniqueCodesFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onUpdate("uniqueCodesFile", null);
                    if (csvInputRef.current) csvInputRef.current.value = "";
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="flex h-10 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-100 transition-colors"
              >
                Upload CSV file
              </button>
            )}
            <input
              ref={csvInputRef}
              type="file"
              id="uniqueCodesUpload"
              accept=".csv,.txt"
              onChange={handleCsvUpload}
              className="hidden"
            />
          </div>
          <p className="mt-1.5 text-gray-500 text-sm">
            Upload a CSV or TXT file with one unique code per line
          </p>
        </div>
      )}

      {/* Barcode → Image Upload */}
      {selectedCodeTypes.includes("barcode") && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left side kept empty for layout alignment with screenshot */}
          <div />
          <div>
            <Label>Barcode Image</Label>
            <div className="mt-1">
              {formData.barcodePreview ? (
                <div className="relative rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                  <img
                    src={formData.barcodePreview}
                    alt="Barcode"
                    className="w-full h-36 object-contain bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate("barcodeFile", null);
                      onUpdate("barcodePreview", "");
                      if (barcodeInputRef.current)
                        barcodeInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => barcodeInputRef.current?.click()}
                  className="flex flex-col items-center justify-center h-36 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-colors"
                >
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    Upload barcode image
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Image displayed as barcode on voucher
                  </p>
                </div>
              )}
              <input
                ref={barcodeInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleBarcodeUpload}
                className="hidden"
              />
              {uploadError && (
                <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                  <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code → URL Input */}
      {selectedCodeTypes.includes("qr_code") && (
        <div>
          <Label htmlFor="qrCodeUrl">QR Code URL*</Label>
          <Input
            id="qrCodeUrl"
            type="url"
            placeholder="https://example.com/redeem"
            value={formData.qrCodeUrl || ""}
            onChange={(e) => onUpdate("qrCodeUrl", e.target.value)}
            className={cn(
              "mt-1",
              errors.qrCodeUrl && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.qrCodeUrl ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.qrCodeUrl}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              This URL will be encoded into a QR code on the voucher
            </p>
          )}
        </div>
      )}

      {/* External Link URL — shown when External Link redemption type is selected */}
      {selectedRedemptionTypes.includes("external_link") && (
        <div>
          <Label htmlFor="externalUrl">External URL*</Label>
          <Input
            id="externalUrl"
            type="url"
            placeholder="https://example.com/offer"
            value={formData.externalUrl || ""}
            onChange={(e) => onUpdate("externalUrl", e.target.value)}
            className={cn(
              "mt-1",
              errors.externalUrl && "border-red-300 focus-visible:ring-red-500"
            )}
          />
          {errors.externalUrl ? (
            <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
              <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.externalUrl}
            </p>
          ) : (
            <p className="mt-1.5 text-gray-500 text-sm">
              Customers will be redirected to this URL to redeem
            </p>
          )}
        </div>
      )}
    </div>
  );
}
