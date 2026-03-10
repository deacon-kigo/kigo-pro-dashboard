import { useMemo } from "react";
import {
  OfferTypeKey,
  getAutoRedemptionMethod,
} from "@/lib/constants/offer-templates";

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
  offerName?: string;
  description?: string;
  offerSource?: string;
  startDate?: string;
  discountValue?: string;
  externalUrl?: string;
  promoCode?: string;
  category_ids?: string[];
}): UseSectionCompletionResult {
  return useMemo(() => {
    const offerType = formData.offerType;
    const redemptionMethod = offerType
      ? getAutoRedemptionMethod(offerType)
      : null;

    // Offer Details: requires name, description, source, start date, and discount
    const offerDetailsComplete =
      !!formData.offerName?.trim() &&
      !!formData.description?.trim() &&
      !!formData.offerSource &&
      !!formData.startDate &&
      !!formData.discountValue;

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
        complete: !!formData.merchantData,
      },
      {
        id: "offer-details",
        label: "Offer Details",
        complete: offerDetailsComplete,
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
    formData.offerType,
    formData.offerName,
    formData.description,
    formData.offerSource,
    formData.startDate,
    formData.discountValue,
    formData.externalUrl,
    formData.promoCode,
    formData.category_ids,
  ]);
}
