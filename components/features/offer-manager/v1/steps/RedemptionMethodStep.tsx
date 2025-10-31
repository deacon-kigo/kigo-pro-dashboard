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

export default function RedemptionMethodStepV1({
  formData,
  onUpdate,
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
              <Label>Redemption Type*</Label>
              <RadioGroup
                value={formData.redemptionType}
                onValueChange={(value) => onUpdate("redemptionType", value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
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
                          <p className="text-muted-foreground text-sm">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Promo Code Configuration */}
      {(formData.redemptionType === "mobile" ||
        formData.redemptionType === "online_print") && (
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
      {formData.redemptionType === "external_url" && (
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
                <Label>Select Locations</Label>
                <Card className="p-4 bg-muted/20">
                  <p className="text-muted-foreground text-sm">
                    Location selector will be implemented here
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    (V1 Placeholder - will show merchant locations list with
                    checkboxes)
                  </p>
                </Card>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
