"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DocumentTextIcon,
  CreditCardIcon,
  TagIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface ReviewStepProps {
  formData: any;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function ReviewStepV1({
  formData,
  onPrevious,
  onSubmit,
}: ReviewStepProps) {
  const isFormValid = () => {
    // Basic validation
    return (
      formData.shortText &&
      formData.longText &&
      formData.startDate &&
      formData.termsConditions &&
      formData.offerType &&
      formData.redemptionType &&
      (formData.redemptionType === "external_url"
        ? formData.externalUrl
        : formData.promoCode || formData.promoCodeType === "unique")
    );
  };

  const redemptionTypeLabels: Record<string, string> = {
    mobile: "Mobile",
    online_print: "Online Print",
    external_url: "External URL",
  };

  const offerTypeLabels: Record<string, string> = {
    bogo: "BOGO (Buy One Get One)",
    percent_off: "Percentage Off",
    dollar_off: "Dollar Amount Off",
    free: "Free Item/Service",
    other: "Other",
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Ready to Publish</h4>
            <p className="text-sm text-blue-700 mt-1">
              Review your offer details below. Once published, the offer will be
              available to customers based on your configured settings.
            </p>
          </div>
        </div>
      </div>

      {/* Offer Details Section */}
      <Card className="rounded-md border">
        <div className="bg-muted/20 flex items-center border-b p-3">
          <DocumentTextIcon className="text-primary mr-2 size-5" />
          <div>
            <h3 className="font-medium">Offer Details</h3>
            <p className="text-muted-foreground text-sm">
              Core information about your offer
            </p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <Label>Short Text</Label>
            <p className="text-sm mt-1">{formData.shortText || "(Not set)"}</p>
          </div>

          <div>
            <Label>Long Text</Label>
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {formData.longText || "(Not set)"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleDateString()
                    : "(Not set)"}
                </p>
              </div>
            </div>

            <div>
              <Label>End Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {formData.endDate
                    ? new Date(formData.endDate).toLocaleDateString()
                    : "No expiration"}
                </p>
              </div>
            </div>
          </div>

          {formData.maxDiscount && (
            <div>
              <Label>Max Discount</Label>
              <p className="text-sm mt-1">{formData.maxDiscount}</p>
            </div>
          )}

          <div>
            <Label>Terms & Conditions</Label>
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {formData.termsConditions || "(Not set)"}
            </p>
          </div>
        </div>
      </Card>

      {/* Classification Section */}
      <Card className="rounded-md border">
        <div className="bg-muted/20 flex items-center border-b p-3">
          <TagIcon className="text-primary mr-2 size-5" />
          <div>
            <h3 className="font-medium">Classification</h3>
            <p className="text-muted-foreground text-sm">
              Category and type information
            </p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <Label>Offer Type</Label>
            <div className="mt-1">
              <Badge variant="secondary">
                {offerTypeLabels[formData.offerType] || "(Not set)"}
              </Badge>
            </div>
          </div>

          {formData.discountValue && (
            <div>
              <Label>Discount Value</Label>
              <p className="text-sm mt-1">{formData.discountValue}</p>
            </div>
          )}

          {formData.cuisineType && (
            <div>
              <Label>Cuisine Type</Label>
              <div className="mt-1">
                <Badge variant="outline">
                  {formData.cuisineType.charAt(0).toUpperCase() +
                    formData.cuisineType.slice(1).replace("_", " ")}
                </Badge>
              </div>
            </div>
          )}

          {formData.keywords && formData.keywords.length > 0 && (
            <div>
              <Label>Keywords</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.keywords.map((keyword: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {typeof keyword === "string"
                      ? keyword
                      : keyword.label || keyword.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {formData.firstCategory && (
              <div>
                <Label>First Category</Label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {formData.firstCategory.charAt(0).toUpperCase() +
                      formData.firstCategory.slice(1).replace("_", " ")}
                  </Badge>
                </div>
              </div>
            )}

            {formData.secondCategory && (
              <div>
                <Label>Second Category</Label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {formData.secondCategory.charAt(0).toUpperCase() +
                      formData.secondCategory.slice(1).replace("_", " ")}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Redemption Section */}
      <Card className="rounded-md border">
        <div className="bg-muted/20 flex items-center border-b p-3">
          <CreditCardIcon className="text-primary mr-2 size-5" />
          <div>
            <h3 className="font-medium">Redemption Method</h3>
            <p className="text-muted-foreground text-sm">
              How customers will redeem this offer
            </p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <Label>Redemption Type</Label>
            <div className="mt-1">
              <Badge>
                {redemptionTypeLabels[formData.redemptionType] || "(Not set)"}
              </Badge>
            </div>
          </div>

          {formData.redemptionType === "external_url" ? (
            <div>
              <Label>External URL</Label>
              <p className="text-sm mt-1 text-blue-600 underline break-all">
                {formData.externalUrl || "(Not set)"}
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label>Promo Code Type</Label>
                <p className="text-sm mt-1">
                  {formData.promoCodeType === "single"
                    ? "Single Static Code"
                    : "Unique Codes"}
                </p>
              </div>

              {formData.promoCode && (
                <div>
                  <Label>Promo Code</Label>
                  <p className="text-sm mt-1 font-mono bg-gray-100 px-3 py-2 rounded border inline-block">
                    {formData.promoCode}
                  </p>
                </div>
              )}

              {formData.barcode && (
                <div>
                  <Label>Barcode</Label>
                  <p className="text-sm mt-1 font-mono">{formData.barcode}</p>
                </div>
              )}

              {formData.qrCode && (
                <div>
                  <Label>QR Code</Label>
                  <p className="text-sm mt-1 font-mono">{formData.qrCode}</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Usage Limits Section */}
      <Card className="rounded-md border">
        <div className="bg-muted/20 flex items-center border-b p-3">
          <MapPinIcon className="text-primary mr-2 size-5" />
          <div>
            <h3 className="font-medium">Usage & Location</h3>
            <p className="text-muted-foreground text-sm">
              Usage limits and location restrictions
            </p>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Uses Per Customer</Label>
              <p className="text-sm mt-1">
                {formData.usageLimitPerCustomer === "unlimited"
                  ? "Unlimited"
                  : `${formData.usageLimitPerCustomer} time(s)`}
              </p>
            </div>

            <div>
              <Label>Total Redemptions</Label>
              <p className="text-sm mt-1">
                {formData.totalUsageLimit || "Unlimited"}
              </p>
            </div>
          </div>

          <div>
            <Label>Location Scope</Label>
            <p className="text-sm mt-1">
              {formData.locationScope === "all"
                ? "All Locations"
                : "Specific Locations"}
            </p>
          </div>
        </div>
      </Card>

      {/* Validation Warning */}
      {!isFormValid() && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="text-amber-600">⚠️</div>
            <div>
              <h4 className="font-medium text-amber-900">
                Missing Required Information
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Please complete all required fields before publishing. Go back
                to the previous steps to fill in missing information.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Helper component for labels
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </span>
  );
}
