"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  GlobeAltIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import {
  OfferTypeKey,
  getAutoRedemptionMethod,
} from "@/lib/constants/offer-templates";

interface SectionRedemptionProps {
  offerType: OfferTypeKey;
  formData: {
    externalUrl?: string;
    promoCode?: string;
  };
  onUpdate: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function SectionRedemption({
  offerType,
  formData,
  onUpdate,
  errors = {},
}: SectionRedemptionProps) {
  const method = getAutoRedemptionMethod(offerType);

  return (
    <div className="space-y-4">
      {/* Auto-assigned method indicator */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
        <InformationCircleIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          Redemption method is automatically assigned based on offer type.
        </div>
      </div>

      {/* Method cards */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "rounded-lg border-2 p-4 text-center transition-colors",
            method === "online"
              ? "border-primary bg-primary/5"
              : "border-gray-200 opacity-70"
          )}
        >
          <GlobeAltIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-medium">Online</div>
          <div className="text-sm text-gray-600 mt-1">URL + Promo Code</div>
          {method === "online" && (
            <Badge className="mt-2 text-xs" variant="default">
              Active
            </Badge>
          )}
        </div>
        <div
          className={cn(
            "rounded-lg border-2 p-4 text-center transition-colors",
            method === "in_store"
              ? "border-primary bg-primary/5"
              : "border-gray-200 opacity-70"
          )}
        >
          <BuildingStorefrontIcon className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
          <div className="text-sm font-medium">In-Store</div>
          <div className="text-sm text-gray-600 mt-1">Show & Save</div>
          {method === "in_store" && (
            <Badge className="mt-2 text-xs" variant="default">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* Method-specific fields */}
      {method === "online" ? (
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="externalUrl">Redemption URL*</Label>
            <Input
              id="externalUrl"
              type="url"
              placeholder="https://example.com/offer"
              value={formData.externalUrl || ""}
              onChange={(e) => onUpdate("externalUrl", e.target.value)}
              className={cn(
                "mt-1",
                errors.externalUrl &&
                  "border-red-300 focus-visible:ring-red-500"
              )}
            />
            {errors.externalUrl ? (
              <p className="mt-1 text-red-600 text-sm flex items-center gap-1">
                <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                {errors.externalUrl}
              </p>
            ) : (
              <p className="text-gray-700 text-sm mt-1">
                Where customers go to redeem
              </p>
            )}
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
              <p className="text-gray-700 text-sm mt-1">
                Code shown to all customers (auto-uppercase)
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <BuildingStorefrontIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Show & Save Redemption
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  Customers will present this offer on their device at the point
                  of sale. No external URL or promo code required.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
