"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Import actual Web SDK components (replicated from mockup-studio)
import {
  MerchantOfferButton,
  OfferDetailPreview,
  MaterialUIProvider,
} from "./sdk";

/**
 * P0.4 Offer Preview Panel
 *
 * Displays live preview of how the offer will appear in the marketplace:
 * - Card View: MerchantOfferButton (actual Web SDK component)
 * - Detail View: OfferDetailPreview (actual Web SDK component)
 *
 * Uses replicated Web SDK components for visual accuracy.
 */

interface OfferPreviewPanelProps {
  formData: {
    // Merchant
    merchant?: string;
    merchantData?: {
      dbaName?: string;
      corpName?: string;
      logoUrl?: string;
      address?: string;
      category?: string;
    } | null;

    // Offer Details
    offerName?: string;
    description?: string;
    termsConditions?: string;
    startDate?: string;
    endDate?: string;

    // Classification
    offerType?: string;
    discountValue?: string;
    maxDiscountAmount?: string;
    minimumSpend?: string;

    // Redemption
    redemptionTypes?: string[];
    promoCode?: string;
    externalUrl?: string;
  };
  className?: string;
}

// Helper to format discount badge text based on offer type
function getDiscountBadgeText(
  offerType: string,
  discountValue: string,
  minimumSpend?: string
): string {
  const value = parseFloat(discountValue) || 0;
  const min = parseFloat(minimumSpend || "0") || 0;

  switch (offerType) {
    case "dollar_off":
      return `$${value} OFF`;
    case "bogo":
      return "BUY 1 GET 1";
    case "dollar_off_minimum":
      return min > 0 ? `$${value} OFF $${min}+` : `$${value} OFF`;
    case "fixed_price":
      return `$${value.toFixed(2)}`;
    case "cash_back":
      return `$${value} BACK`;
    case "tiered":
      return min > 0 ? `$${value} OFF $${min}+` : `$${value} OFF`;
    case "percent_off":
      return `${value}% OFF`;
    default:
      return value > 0 ? `$${value} OFF` : "SAVE";
  }
}

// Helper to format date
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OfferPreviewPanel({
  formData,
  className,
}: OfferPreviewPanelProps) {
  // Extract merchant info
  const merchantName =
    formData.merchantData?.dbaName ||
    formData.merchantData?.corpName ||
    formData.merchant ||
    "Merchant Name";
  const merchantLogo = formData.merchantData?.logoUrl;

  // Extract offer info
  const headline = formData.offerName || "Offer headline will appear here...";
  const description = formData.description || "";
  const terms = formData.termsConditions || "";
  const offerType = formData.offerType || "dollar_off";
  const discountValue = formData.discountValue || "0";
  const minimumSpend = formData.minimumSpend || formData.maxDiscountAmount;
  const startDate = formData.startDate;
  const endDate = formData.endDate;
  const redemptionMethod = formData.redemptionTypes?.includes("external_url")
    ? "Online"
    : "In-Store";
  const promoCode = formData.promoCode;

  // Format discount badge
  const discountBadge = getDiscountBadgeText(
    offerType,
    discountValue,
    minimumSpend
  );

  // Format validity
  const validUntil =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : endDate
        ? `Valid until ${formatDate(endDate)}`
        : startDate
          ? `Starts ${formatDate(startDate)}`
          : "Valid dates TBD";

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Offer Preview</h3>
            <p className="text-sm text-muted-foreground">
              How members will see your offer
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Live Preview
        </Badge>
      </div>

      {/* Preview Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Card View Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-900">
                Card View
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              How the offer appears in marketplace listings
            </p>
            <div className="flex justify-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <MaterialUIProvider>
                <MerchantOfferButton
                  id="preview"
                  logoUrl={merchantLogo}
                  title={headline}
                  subTitle={merchantName}
                  isFeatured={false}
                  isInWallet={false}
                  onClick={() => {}}
                  primaryColor="#4B55FD"
                />
              </MaterialUIProvider>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Detail View Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Detail View
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Full offer details when a member clicks to learn more
            </p>
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              <MaterialUIProvider>
                <OfferDetailPreview
                  title={headline}
                  merchant={merchantName}
                  discount={discountBadge}
                  description={description}
                  terms={terms}
                  logoUrl={merchantLogo}
                  primaryColor="#4B55FD"
                  redemptionMethod={redemptionMethod}
                  validUntil={validUntil}
                  promoCode={promoCode}
                />
              </MaterialUIProvider>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default OfferPreviewPanel;
