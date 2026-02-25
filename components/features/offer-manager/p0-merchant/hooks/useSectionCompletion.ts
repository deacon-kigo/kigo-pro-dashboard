import { useMemo } from "react";
import {
  OfferTypeKey,
  getAutoRedemptionMethod,
} from "@/lib/constants/offer-templates";
import { isMultiBrandPublisher } from "@/lib/constants/publisher-brands";

export interface SectionStatus {
  id: string;
  label: string;
  complete: boolean;
}

interface UseSectionCompletionResult {
  sections: SectionStatus[];
  completedCount: number;
  totalCount: number;
  allComplete: boolean;
  firstIncompleteSection: string | null;
}

export function useSectionCompletion(formData: {
  merchantData?: any;
  offerType?: OfferTypeKey | null;
  discountValue?: string;
  minimumSpend?: string;
  cashbackPercentage?: string;
  shortText?: string;
  offerName?: string;
  description?: string;
  externalUrl?: string;
  promoCode?: string;
  category_ids?: string[];
  startDate?: string;
  termsConditions?: string;
  usageLimitPerCustomer?: string;
  publisherBrandTag?: string | null;
}): UseSectionCompletionResult {
  return useMemo(() => {
    const offerType = formData.offerType;
    const redemptionMethod = offerType
      ? getAutoRedemptionMethod(offerType)
      : null;

    // Determine if type-specific fields are complete
    let typeDetailsComplete = !!formData.discountValue;

    if (offerType === "dollar_off_with_min") {
      const discount = parseFloat(formData.discountValue || "0");
      const minSpend = parseFloat(formData.minimumSpend || "0");
      typeDetailsComplete =
        typeDetailsComplete && !!formData.minimumSpend && minSpend > discount;
    }

    if (offerType === "cashback") {
      typeDetailsComplete = typeDetailsComplete && !!formData.discountValue;
    }

    if (offerType === "bogo") {
      typeDetailsComplete = typeDetailsComplete && !!formData.shortText?.trim();
    }

    // Redemption: online needs URL + promo; in-store is always complete
    let redemptionComplete = true;
    if (redemptionMethod === "online") {
      redemptionComplete =
        !!formData.externalUrl?.trim() && !!formData.promoCode?.trim();
    }

    const sections: SectionStatus[] = [
      {
        id: "merchant",
        label: "Merchant & Brand",
        complete:
          !!formData.merchantData &&
          (!isMultiBrandPublisher() || !!formData.publisherBrandTag),
      },
      {
        id: "type-details",
        label: "Offer Type Details",
        complete: typeDetailsComplete,
      },
      {
        id: "content",
        label: "Content",
        complete:
          !!formData.offerName?.trim() && !!formData.description?.trim(),
      },
      {
        id: "redemption",
        label: "Redemption",
        complete: redemptionComplete,
      },
      {
        id: "classification",
        label: "Classification",
        complete: (formData.category_ids?.length || 0) > 0,
      },
      {
        id: "dates",
        label: "Dates & Duration",
        complete: !!formData.startDate,
      },
      {
        id: "terms",
        label: "Terms & Settings",
        complete: true, // Smart defaults always present
      },
    ];

    const completedCount = sections.filter((s) => s.complete).length;
    const totalCount = sections.length;
    const allComplete = completedCount === totalCount;
    const firstIncomplete = sections.find((s) => !s.complete);

    return {
      sections,
      completedCount,
      totalCount,
      allComplete,
      firstIncompleteSection: firstIncomplete?.id ?? null,
    };
  }, [
    formData.merchantData,
    formData.publisherBrandTag,
    formData.offerType,
    formData.discountValue,
    formData.minimumSpend,
    formData.cashbackPercentage,
    formData.shortText,
    formData.offerName,
    formData.description,
    formData.externalUrl,
    formData.promoCode,
    formData.category_ids,
    formData.startDate,
    formData.termsConditions,
    formData.usageLimitPerCustomer,
  ]);
}
