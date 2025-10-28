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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import {
  DevicePhoneMobileIcon,
  PrinterIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface RedemptionMethodStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function RedemptionMethodStepV1({
  formData,
  onUpdate,
  onNext,
  onPrevious,
}: RedemptionMethodStepProps) {
  const redemptionTypes = [
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
    <div className="space-y-6">
      {/* Redemption Type Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Redemption Method</h3>
          <p className="text-sm text-gray-500 mb-4">
            Choose how customers will redeem this offer
          </p>
        </div>

        <RadioGroup
          value={formData.redemptionType}
          onValueChange={(value) => onUpdate("redemptionType", value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {redemptionTypes.map((type) => (
            <label key={type.value} htmlFor={type.value}>
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  formData.redemptionType === type.value
                    ? "border-primary border bg-primary/5"
                    : "border border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <type.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {type.description}
                    </p>
                  </div>
                </div>
              </Card>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Promo Code Configuration */}
      {(formData.redemptionType === "mobile" ||
        formData.redemptionType === "online_print") && (
        <div className="space-y-4 pt-6 border-t">
          <div>
            <h3 className="text-lg font-semibold mb-3">Promo Code Setup</h3>
            <p className="text-sm text-gray-500 mb-4">
              Configure how promo codes work for this offer
            </p>
          </div>

          <div className="space-y-2">
            <Label>Promo Code Type</Label>
            <RadioGroup
              value={formData.promoCodeType}
              onValueChange={(value) => onUpdate("promoCodeType", value)}
              className="flex flex-col gap-3"
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
                  <p className="text-sm text-gray-500">
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
                  <p className="text-sm text-gray-500">
                    Upload a list of unique codes for individual customers
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {formData.promoCodeType === "single" && (
            <div className="space-y-2">
              <Label htmlFor="promoCode">
                Promo Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="promoCode"
                placeholder="e.g., SAVE20"
                value={formData.promoCode}
                onChange={(e) =>
                  onUpdate("promoCode", e.target.value.toUpperCase())
                }
                className="font-mono"
              />
              <p className="text-sm text-gray-500">
                This code will be shown to all customers
              </p>
            </div>
          )}

          {formData.promoCodeType === "unique" && (
            <div className="space-y-2">
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
              <p className="text-sm text-gray-500">
                Upload a CSV or TXT file with one code per line
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              placeholder="Enter barcode number"
              value={formData.barcode}
              onChange={(e) => onUpdate("barcode", e.target.value)}
              className="font-mono"
            />
            <p className="text-sm text-gray-500">
              For in-store scanning
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrCode">QR Code</Label>
            <Input
              id="qrCode"
              placeholder="Enter QR code data or URL"
              value={formData.qrCode}
              onChange={(e) => onUpdate("qrCode", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              QR code will be auto-generated if left blank
            </p>
          </div>
        </div>
      )}

      {/* External URL */}
      {formData.redemptionType === "external_url" && (
        <div className="space-y-4 pt-6 border-t">
          <div>
            <h3 className="text-lg font-semibold mb-3">External Website</h3>
            <p className="text-sm text-gray-500 mb-4">
              Redirect customers to an external website to redeem
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalUrl">
              External URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="externalUrl"
              type="url"
              placeholder="https://example.com/offer"
              value={formData.externalUrl}
              onChange={(e) => onUpdate("externalUrl", e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Customers will be redirected to this URL when they click "Redeem"
            </p>
          </div>
        </div>
      )}

      {/* Usage Limits */}
      <div className="space-y-4 pt-6 border-t">
        <div>
          <h3 className="text-lg font-semibold mb-3">Usage Limits</h3>
          <p className="text-sm text-gray-500 mb-4">
            Control how many times this offer can be redeemed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="usageLimitPerCustomer">
            Uses Per Customer <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.usageLimitPerCustomer}
            onValueChange={(value) => onUpdate("usageLimitPerCustomer", value)}
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
          <p className="text-sm text-gray-500">
            How many times each customer can use this offer
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalUsageLimit">
            Total Redemptions Allowed
          </Label>
          <Input
            id="totalUsageLimit"
            type="number"
            placeholder="e.g., 1000"
            value={formData.totalUsageLimit}
            onChange={(e) => onUpdate("totalUsageLimit", e.target.value)}
            min="1"
          />
          <p className="text-sm text-gray-500">
            Total number of redemptions across all customers. Leave blank for
            unlimited.
          </p>
        </div>

        <div className="space-y-2">
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
          <p className="text-sm text-gray-500">
            Which merchant locations can redeem this offer
          </p>
        </div>

        {formData.locationScope === "specific" && (
          <div className="space-y-2">
            <Label>Select Locations</Label>
            <Card className="p-4 bg-muted/20">
              <p className="text-sm text-gray-500">
                Location selector will be implemented here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                (V1 Placeholder - will show merchant locations list with
                checkboxes)
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
