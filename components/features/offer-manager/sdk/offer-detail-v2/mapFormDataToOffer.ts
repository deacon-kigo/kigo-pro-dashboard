/**
 * mapFormDataToOffer - Transform form data to preview offer format
 *
 * Maps the offer creation form data structure to the PreviewOffer format
 * expected by the SDK-style components.
 */

import { PreviewOffer } from "./PreviewOfferContext";

export interface OfferFormData {
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
}

/**
 * Derive estimated savings from offer type and discount value
 */
function deriveEstimatedSavings(formData: OfferFormData): number | undefined {
  const value = parseFloat(formData.discountValue || "0") || 0;

  switch (formData.offerType) {
    case "dollar_off":
    case "dollar_off_minimum":
    case "cash_back":
    case "tiered":
      return value > 0 ? value : undefined;
    case "percent_off":
      // For percent off, estimated savings depends on typical purchase
      // Return undefined as it varies
      return undefined;
    case "bogo":
      // BOGO estimated savings varies
      return undefined;
    case "fixed_price":
      // Fixed price doesn't have a direct savings number
      return undefined;
    default:
      return value > 0 ? value : undefined;
  }
}

/**
 * Convert form data to PreviewOffer format
 *
 * Image fallback logic (matches production database):
 * - Circle Image (Logo): OfferImage || MerchantLogo || OfferBanner || MerchantBanner
 * - Hero Banner: OfferBanner || MerchantBanner || OfferImage || MerchantLogo
 */
export function mapFormDataToOffer(formData: OfferFormData): PreviewOffer {
  const merchantName =
    formData.merchantData?.dbaName ||
    formData.merchantData?.corpName ||
    formData.merchant ||
    "Merchant Name";

  // Extract all 4 image sources
  const offerImage = formData.offerImagePreview || undefined;
  const merchantLogo =
    formData.merchantData?.logoPreview ||
    formData.merchantData?.logoUrl ||
    undefined;
  const offerBanner = formData.offerBannerPreview || undefined;
  const merchantBanner = formData.merchantData?.bannerPreview || undefined;

  return {
    // Basic info
    description: formData.offerName || "Offer headline will appear here...",
    estimated_savings: deriveEstimatedSavings(formData),
    max_discount: formData.maxDiscountAmount
      ? parseFloat(formData.maxDiscountAmount)
      : undefined,

    // Merchant info - includes both logo and banner
    merchant_name: merchantName,
    merchant: {
      name: merchantName,
      image: merchantLogo ? { url: merchantLogo } : undefined,
      banner: merchantBanner ? { url: merchantBanner } : undefined,
      stub_copy: formData.description || "",
    },

    // Offer-level images (custom uploads)
    image: offerImage ? { url: offerImage } : undefined,
    banner: offerBanner ? { url: offerBanner } : undefined,

    // Redemption
    redemption_methods: formData.redemptionTypes,
    conditions: formData.termsConditions,

    // Validity
    start_date: formData.startDate,
    end_date: formData.endDate,
  };
}

/**
 * Get redemption method display text
 */
export function getRedemptionMethodText(
  redemptionTypes?: string[]
): string | undefined {
  if (!redemptionTypes || redemptionTypes.length === 0) {
    return undefined;
  }

  const hasOnline = redemptionTypes.includes("external_url");
  const hasInStore =
    redemptionTypes.includes("show_and_save") ||
    redemptionTypes.includes("print");

  if (hasOnline && hasInStore) {
    return "Online & In-store";
  } else if (hasOnline) {
    return "Online";
  } else if (hasInStore) {
    return "In-store";
  }

  return undefined;
}

/**
 * Get CTA button text based on redemption methods
 */
export function getCtaButtonText(redemptionTypes?: string[]): string {
  if (!redemptionTypes || redemptionTypes.length === 0) {
    return "Redeem offer";
  }

  const hasOnline = redemptionTypes.includes("external_url");
  const hasInStore =
    redemptionTypes.includes("show_and_save") ||
    redemptionTypes.includes("print");

  if (hasInStore && !hasOnline) {
    return "Redeem in-store";
  } else if (hasOnline && !hasInStore) {
    return "Redeem online";
  }

  return "Redeem offer";
}
