"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { Button } from "@/components/ui/button";
import {
  DevicePhoneMobileIcon,
  PrinterIcon,
  LinkIcon,
  QrCodeIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";

interface RedemptionMethodStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Available locations (from merchant locations table)
// In production, these would be fetched from GET /api/locations
const AVAILABLE_LOCATIONS = [
  { label: "Downtown Store - 123 Main St", value: "loc_1" },
  { label: "Westside Mall - 456 Shopping Blvd", value: "loc_2" },
  { label: "North Branch - 789 North Ave", value: "loc_3" },
  { label: "Eastside Center - 321 East St", value: "loc_4" },
  { label: "South Plaza - 654 South Rd", value: "loc_5" },
  { label: "Airport Location - 987 Terminal Dr", value: "loc_6" },
  { label: "Suburban Store - 111 Suburban Way", value: "loc_7" },
  { label: "City Center - 222 City Square", value: "loc_8" },
];

export default function RedemptionMethodStepV1({
  formData,
  onUpdate,
}: RedemptionMethodStepProps) {
  // Error state management for image uploads
  const [uploadErrors, setUploadErrors] = useState<{
    barcode?: string;
    qrCode?: string;
  }>({});

  // Initialize arrays for multiple selection support
  const locationIds = formData.location_ids || [];
  const selectedRedemptionTypes = formData.redemptionTypes || []; // Changed from single redemptionType to array

  // Validate image file (type and size)
  const validateImageFile = (file: File): string | null => {
    // Check file type (only allow images)
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      return "Only PNG, JPG, or SVG files are allowed.";
    }

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return "File must be under 2MB.";
    }

    return null; // Valid file
  };

  // Handle barcode file upload with validation
  const handleBarcodeUpload = (file: File | null) => {
    if (!file) return;

    // Clear previous error
    setUploadErrors((prev) => ({ ...prev, barcode: undefined }));

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadErrors((prev) => ({ ...prev, barcode: validationError }));
      return;
    }

    try {
      onUpdate("barcodeFile", file);
      onUpdate("barcodePreview", URL.createObjectURL(file));
    } catch (error) {
      setUploadErrors((prev) => ({
        ...prev,
        barcode: "Sorry, something went wrong. Please try again.",
      }));
    }
  };

  // Handle QR code file upload with validation
  const handleQRCodeUpload = (file: File | null) => {
    if (!file) return;

    // Clear previous error
    setUploadErrors((prev) => ({ ...prev, qrCode: undefined }));

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadErrors((prev) => ({ ...prev, qrCode: validationError }));
      return;
    }

    try {
      onUpdate("qrCodeFile", file);
      onUpdate("qrCodePreview", URL.createObjectURL(file));
    } catch (error) {
      setUploadErrors((prev) => ({
        ...prev,
        qrCode: "Sorry, something went wrong. Please try again.",
      }));
    }
  };

  // Handle checkbox toggle for redemption types
  const handleRedemptionTypeToggle = (typeValue: string) => {
    const newTypes = selectedRedemptionTypes.includes(typeValue)
      ? selectedRedemptionTypes.filter((t: string) => t !== typeValue)
      : [...selectedRedemptionTypes, typeValue];
    onUpdate("redemptionTypes", newTypes);
  };

  const redemptionTypeOptions = [
    {
      value: "mobile",
      label: "Mobile",
      icon: DevicePhoneMobileIcon,
      description: "Show code on mobile device at checkout",
    },
    {
      value: "online_print",
      label: "Online Print",
      icon: PrinterIcon,
      description: "Print coupon at home",
    },
    {
      value: "external_url",
      label: "External URL",
      icon: LinkIcon,
      description: "Redirect to external website",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Redemption Type Selection */}
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
            <Label>Redemption Types* (Select one or more)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {redemptionTypeOptions.map((type) => (
                <label key={type.value} htmlFor={type.value}>
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedRedemptionTypes.includes(type.value)
                        ? "border-primary border-2 bg-primary/5"
                        : "border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={type.value}
                        checked={selectedRedemptionTypes.includes(type.value)}
                        onChange={() => handleRedemptionTypeToggle(type.value)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <type.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </label>
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Select all redemption methods that apply to this offer.
              Configuration sections will appear below for each selected type.
            </p>
          </div>
        </div>
      </div>

      {/* Promo Code Configuration */}
      {(selectedRedemptionTypes.includes("mobile") ||
        selectedRedemptionTypes.includes("online_print")) && (
        <div className="rounded-md border border-b">
          <div className="flex">
            <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
              <div className="flex items-center gap-2">
                <QrCodeIcon className="size-4" />
                <span>Promo Code Setup</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-0 space-y-5">
            <div>
              <Label>Promo Code Type*</Label>
              <RadioGroup
                value={formData.promoCodeType}
                onValueChange={(value) => onUpdate("promoCodeType", value)}
                className="flex flex-col gap-3 mt-2"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <div>
                    <Label
                      htmlFor="single"
                      className="font-normal cursor-pointer"
                    >
                      Single Static Code
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      One code used by all customers (e.g., SAVE20)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="unique" id="unique" />
                  <div>
                    <Label
                      htmlFor="unique"
                      className="font-normal cursor-pointer"
                    >
                      Unique Codes
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Upload a list of unique codes for individual customers
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {formData.promoCodeType === "single" && (
              <div>
                <Label htmlFor="promoCode">Promo Code*</Label>
                <Input
                  id="promoCode"
                  placeholder="e.g., SAVE20"
                  value={formData.promoCode}
                  onChange={(e) =>
                    onUpdate("promoCode", e.target.value.toUpperCase())
                  }
                  className="font-mono"
                />
                <p className="text-muted-foreground text-sm">
                  This code will be shown to all customers
                </p>
              </div>
            )}

            {formData.promoCodeType === "unique" && (
              <div>
                <Label htmlFor="promoCodeUpload">Upload Unique Codes</Label>
                <Input
                  id="promoCodeUpload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUpdate("promoCode", `Uploaded: ${file.name}`);
                    }
                  }}
                />
                <p className="text-muted-foreground text-sm">
                  Upload a CSV or TXT file with one code per line
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="barcodeUpload">Barcode Image</Label>
              {!formData.barcodeFile ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      uploadErrors.barcode
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <Bars3BottomLeftIcon
                        className={`h-8 w-8 mb-3 ${
                          uploadErrors.barcode
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium mb-2 ${
                          uploadErrors.barcode
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        Upload Barcode Image
                      </p>
                      <p className="text-sm mb-4 text-gray-500">
                        PNG, JPG, or SVG (max 2MB)
                      </p>
                      <input
                        type="file"
                        id="barcodeUpload"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleBarcodeUpload(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("barcodeUpload")?.click()
                        }
                      >
                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                        Choose file
                      </Button>
                    </div>
                  </div>
                  {uploadErrors.barcode && (
                    <p className="mt-2 text-sm text-red-600">
                      {uploadErrors.barcode}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {formData.barcodePreview ? (
                            <img
                              src={formData.barcodePreview}
                              alt="Barcode"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Bars3BottomLeftIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.barcodeFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(formData.barcodeFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="barcodeReplace"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleBarcodeUpload(file);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("barcodeReplace")?.click()
                          }
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onUpdate("barcodeFile", null);
                            onUpdate("barcodePreview", null);
                            setUploadErrors((prev) => ({
                              ...prev,
                              barcode: undefined,
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  {uploadErrors.barcode && (
                    <p className="mt-2 text-sm text-red-600">
                      {uploadErrors.barcode}
                    </p>
                  )}
                </>
              )}
              <p className="text-muted-foreground text-sm mt-2">
                Upload a barcode image for in-store scanning.
              </p>
            </div>

            <div>
              <Label htmlFor="qrCodeUpload">QR Code Image</Label>
              {!formData.qrCodeFile ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      uploadErrors.qrCode
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <QrCodeIcon
                        className={`h-8 w-8 mb-3 ${
                          uploadErrors.qrCode ? "text-red-400" : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium mb-2 ${
                          uploadErrors.qrCode ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        Upload QR Code Image
                      </p>
                      <p className="text-sm mb-4 text-gray-500">
                        PNG, JPG, or SVG (max 2MB)
                      </p>
                      <input
                        type="file"
                        id="qrCodeUpload"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleQRCodeUpload(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("qrCodeUpload")?.click()
                        }
                      >
                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                        Choose file
                      </Button>
                    </div>
                  </div>
                  {uploadErrors.qrCode && (
                    <p className="mt-2 text-sm text-red-600">
                      {uploadErrors.qrCode}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {formData.qrCodePreview ? (
                            <img
                              src={formData.qrCodePreview}
                              alt="QR Code"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <QrCodeIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.qrCodeFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(formData.qrCodeFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="qrCodeReplace"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleQRCodeUpload(file);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("qrCodeReplace")?.click()
                          }
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onUpdate("qrCodeFile", null);
                            onUpdate("qrCodePreview", null);
                            setUploadErrors((prev) => ({
                              ...prev,
                              qrCode: undefined,
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  {uploadErrors.qrCode && (
                    <p className="mt-2 text-sm text-red-600">
                      {uploadErrors.qrCode}
                    </p>
                  )}
                </>
              )}
              <p className="text-muted-foreground text-sm mt-2">
                Upload a QR code image for mobile redemption.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* External URL */}
      {selectedRedemptionTypes.includes("external_url") && (
        <div className="rounded-md border border-b">
          <div className="flex">
            <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="size-4" />
                <span>External Website</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-0 space-y-5">
            <div>
              <Label htmlFor="externalUrl">External URL*</Label>
              <Input
                id="externalUrl"
                type="url"
                placeholder="https://example.com/offer"
                value={formData.externalUrl}
                onChange={(e) => onUpdate("externalUrl", e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Customers will be redirected to this URL when they click
                "Redeem"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Limits & Location Scope */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="size-4" />
              <span>Usage Limits & Location Scope</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
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
            <p className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground text-sm">
              Total number of redemptions across all customers. Leave blank for
              unlimited.
            </p>
          </div>

          <div>
            <Label htmlFor="locationScope">Location Scope*</Label>
            <Select
              value={formData.locationScope}
              onValueChange={(value) => onUpdate("locationScope", value)}
            >
              <SelectTrigger id="locationScope">
                <SelectValue placeholder="Select locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="specific">Specific Locations</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">
              Which merchant locations can redeem this offer (applies to all
              redemption types)
            </p>
          </div>

          {formData.locationScope === "specific" && (
            <div>
              <Label htmlFor="locations">Select Locations*</Label>
              <ReactSelectMulti
                options={AVAILABLE_LOCATIONS}
                values={locationIds}
                onChange={(values) => onUpdate("location_ids", values)}
                placeholder="Search and select locations..."
                maxDisplayValues={2}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Select which merchant locations can redeem this offer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
