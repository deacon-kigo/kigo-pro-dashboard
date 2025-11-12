"use client";

import React from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import {
  DevicePhoneMobileIcon,
  PrinterIcon,
  LinkIcon,
  QrCodeIcon,
  GlobeAltIcon,
  ChartBarIcon,
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
  // Initialize arrays for multiple selection support
  const locationIds = formData.location_ids || [];
  const selectedRedemptionTypes = formData.redemptionTypes || []; // Changed from single redemptionType to array

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
      <Accordion
        className="rounded-md border"
        collapsible
        defaultValue="redemption-method"
        type="single"
      >
        <AccordionItem value="redemption-method">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <DevicePhoneMobileIcon className="size-4" />
              <span>Redemption Method</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5">
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
                          onChange={() =>
                            handleRedemptionTypeToggle(type.value)
                          }
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Promo Code Configuration */}
      {(selectedRedemptionTypes.includes("mobile") ||
        selectedRedemptionTypes.includes("online_print")) && (
        <Accordion
          className="rounded-md border"
          collapsible
          defaultValue="promo-code"
          type="single"
        >
          <AccordionItem value="promo-code">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <QrCodeIcon className="size-4" />
                <span>Promo Code Setup</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
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
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  placeholder="Enter barcode number"
                  value={formData.barcode}
                  onChange={(e) => onUpdate("barcode", e.target.value)}
                  className="font-mono"
                />
                <p className="text-muted-foreground text-sm">
                  For in-store scanning
                </p>
              </div>

              <div>
                <Label htmlFor="qrCode">QR Code</Label>
                <Input
                  id="qrCode"
                  placeholder="Enter QR code data or URL"
                  value={formData.qrCode}
                  onChange={(e) => onUpdate("qrCode", e.target.value)}
                />
                <p className="text-muted-foreground text-sm">
                  QR code will be auto-generated if left blank
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* External URL */}
      {selectedRedemptionTypes.includes("external_url") && (
        <Accordion
          className="rounded-md border"
          collapsible
          defaultValue="external-url"
          type="single"
        >
          <AccordionItem value="external-url">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="size-4" />
                <span>External Website</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-5">
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

              <div>
                <Label htmlFor="locationScope">Location Scope</Label>
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
                  Which merchant locations can redeem this offer
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Usage Limits */}
      <Accordion
        className="rounded-md border"
        collapsible
        defaultValue="usage-limits"
        type="single"
      >
        <AccordionItem value="usage-limits">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <ChartBarIcon className="size-4" />
              <span>Usage Limits</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5">
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
                Total number of redemptions across all customers. Leave blank
                for unlimited.
              </p>
            </div>

            <div>
              <Label htmlFor="locationScope">Location Scope</Label>
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
                Which merchant locations can redeem this offer
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
