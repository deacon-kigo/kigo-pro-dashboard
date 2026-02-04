"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Import SDK components
import {
  MerchantOfferButton,
  OfferDetailPreviewV2,
  MaterialUIProvider,
} from "./sdk";

/**
 * Offer Preview Panel
 *
 * Displays live preview of how the offer will appear in the marketplace:
 * - Card View: MerchantOfferButton (SDK-style offer card)
 * - Detail View: OfferDetailPreviewV2 (SDK-accurate mobile detail view)
 *
 * Uses ported Web SDK components for visual accuracy matching the
 * actual Kigo marketplace appearance.
 */

interface OfferPreviewPanelProps {
  formData: {
    // Merchant
    merchant?: string;
    merchantData?: {
      dbaName?: string;
      corpName?: string;
      logoUrl?: string; // Legacy field
      logoPreview?: string | null; // Merchant Logo
      bannerPreview?: string | null; // Merchant Banner
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

    // Offer Images (custom uploads that override merchant images)
    offerImagePreview?: string; // Offer Image
    offerBannerPreview?: string; // Offer Banner
    offerImageSource?: "none" | "merchant" | "custom";
    offerBannerSource?: "none" | "merchant" | "custom";
  };
  className?: string;
}

export function OfferPreviewPanel({
  formData,
  className,
}: OfferPreviewPanelProps) {
  // Extract merchant info for card view
  const merchantName =
    formData.merchantData?.dbaName ||
    formData.merchantData?.corpName ||
    formData.merchant ||
    "Merchant Name";
  const headline = formData.offerName || "Offer headline will appear here...";

  // Card view logo follows same fallback as detail view circle:
  // OfferImage || MerchantLogo || OfferBanner || MerchantBanner
  const offerImage = formData.offerImagePreview || "";
  const merchantLogo =
    formData.merchantData?.logoPreview || formData.merchantData?.logoUrl || "";
  const offerBanner = formData.offerBannerPreview || "";
  const merchantBanner = formData.merchantData?.bannerPreview || "";

  const cardLogoUrl =
    offerImage || merchantLogo || offerBanner || merchantBanner || undefined;

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
                  logoUrl={cardLogoUrl}
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
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <OfferDetailPreviewV2
                formData={formData}
                primaryColor="#4B55FD"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default OfferPreviewPanel;
