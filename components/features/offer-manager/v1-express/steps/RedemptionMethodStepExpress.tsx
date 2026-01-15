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
import {
  GlobeAltIcon,
  QrCodeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface RedemptionMethodStepExpressProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function RedemptionMethodStepExpress({
  formData,
  onUpdate,
}: RedemptionMethodStepExpressProps) {
  // Hardcoded values for Express template (online-only, US, static code)
  // These don't need UI - they're automatically set
  React.useEffect(() => {
    // Set hardcoded values on mount if not already set
    if (!formData.redemptionTypes || formData.redemptionTypes.length === 0) {
      onUpdate("redemptionTypes", ["external_url"]);
    }
    if (!formData.promoCodeType) {
      onUpdate("promoCodeType", "single");
    }
    if (!formData.locationScope) {
      onUpdate("locationScope", "all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Online Redemption Notice */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <GlobeAltIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Express Template: Online Redemption Only
            </h4>
            <p className="text-sm text-blue-700">
              This template is optimized for online US offers with a single
              static promo code. Customers will be redirected to an external
              website to redeem this offer.
            </p>
          </div>
        </div>
      </div>

      {/* External URL Configuration */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="size-4" />
              <span>Redemption URL</span>
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
              Customers will be redirected to this URL when they click "Redeem"
            </p>
          </div>
        </div>
      </div>

      {/* Promo Code Configuration */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="size-4" />
              <span>Promo Code</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <Label htmlFor="promoCode">Static Promo Code*</Label>
            <Input
              id="promoCode"
              placeholder="e.g., SAVE20"
              value={formData.promoCode}
              onChange={(e) =>
                onUpdate("promoCode", e.target.value.toUpperCase())
              }
              className="font-mono text-lg"
              maxLength={20}
            />
            <p className="text-muted-foreground text-sm">
              This single code will be shown to all customers
            </p>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="size-4" />
              <span>Usage Limits</span>
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
        </div>
      </div>
    </div>
  );
}
