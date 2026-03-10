import { useMemo } from "react";

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
  offerName?: string;
  description?: string;
  offerSource?: string;
  startDate?: string;
  discountValue?: string;
  redemptionTypes?: string[];
  codeTypes?: string[];
  usageLimitPerCustomer?: string;
  category_ids?: string[];
}): UseSectionCompletionResult {
  return useMemo(() => {
    // Offer Details: requires name, description, source, start date, and discount
    const offerDetailsComplete =
      !!formData.offerName?.trim() &&
      !!formData.description?.trim() &&
      !!formData.offerSource &&
      !!formData.startDate &&
      !!formData.discountValue;

    // Redemption: requires at least one redemption type and one code type
    const redemptionComplete =
      (formData.redemptionTypes?.length || 0) > 0 &&
      (formData.codeTypes?.length || 0) > 0;

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
        id: "usage-limits",
        label: "Usage Limits",
        complete: !!formData.usageLimitPerCustomer,
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
    formData.offerName,
    formData.description,
    formData.offerSource,
    formData.startDate,
    formData.discountValue,
    formData.redemptionTypes,
    formData.codeTypes,
    formData.usageLimitPerCustomer,
    formData.category_ids,
  ]);
}
