import { useMemo } from "react";
import {
  OfferTypeKey,
  getAutoRedemptionMethod,
} from "@/lib/constants/offer-templates";

// ============================================================================
// VALIDATION RANGES — single source of truth for range constraints
// ============================================================================

export const VALIDATION_RANGES: Record<
  string,
  { min: number; max: number; label: string }
> = {
  dollar_off: { min: 1, max: 500, label: "$1 – $500" },
  percent_off: { min: 1, max: 100, label: "1% – 100%" },
  fixed_price: { min: 0.01, max: 10000, label: "$0.01 – $10,000" },
  cashback: { min: 1, max: 100, label: "1% – 100%" },
  dollar_off_with_min: { min: 1, max: 500, label: "$1 – $500" },
};

// ============================================================================
// PURE VALIDATION FUNCTION
// ============================================================================

export type ValidationErrors = Record<string, string>;

export interface ValidationResult {
  errors: ValidationErrors;
  sectionHasErrors: Record<string, boolean>;
  hasErrors: boolean;
  firstSectionWithError: string | null;
}

const SECTION_ORDER = [
  "type-details",
  "content",
  "redemption",
  "classification",
  "dates",
];

/**
 * Compute validation errors for the form.
 *
 * Strategy:
 * - Fields WITH a value that's invalid → error shows immediately
 * - Required fields that are EMPTY → error only when validateAll=true (publish attempt)
 */
export function computeValidationErrors(
  formData: {
    offerType?: OfferTypeKey | null;
    discountValue?: string;
    shortText?: string;
    minimumSpend?: string;
    cashbackCap?: string;
    offerName?: string;
    description?: string;
    externalUrl?: string;
    promoCode?: string;
    category_ids?: string[];
    startDate?: string;
    endDate?: string;
  },
  validateAll: boolean
): ValidationResult {
  const errors: ValidationErrors = {};
  const offerType = formData.offerType;

  // ── type-details ──────────────────────────────────────────────────────
  if (offerType) {
    const discountVal = formData.discountValue?.trim() || "";
    const discountNum = parseFloat(discountVal);

    if (offerType === "bogo") {
      // BOGO: discountValue is text (item name)
      if (discountVal && discountVal.length > 100) {
        errors.discountValue = "Must be 100 characters or less";
      } else if (!discountVal && validateAll) {
        errors.discountValue = "Item description is required";
      }

      // shortText required for bogo
      const shortText = formData.shortText?.trim() || "";
      if (shortText && shortText.length > 100) {
        errors.shortText = "Must be 100 characters or less";
      } else if (!shortText && validateAll) {
        errors.shortText = "Item description is required";
      }
    } else {
      // Numeric discount types
      const range = VALIDATION_RANGES[offerType];

      if (discountVal) {
        if (isNaN(discountNum) || discountNum <= 0) {
          errors.discountValue = "Must be a positive number";
        } else if (range && discountNum < range.min) {
          errors.discountValue = `Must be at least ${range.label.split("–")[0].trim()}`;
        } else if (range && discountNum > range.max) {
          errors.discountValue = `Must be between ${range.label}`;
        }
      } else if (validateAll) {
        errors.discountValue = "Discount value is required";
      }
    }

    // minimumSpend for dollar_off_with_min
    if (offerType === "dollar_off_with_min") {
      const minSpendVal = formData.minimumSpend?.trim() || "";
      const minSpendNum = parseFloat(minSpendVal);
      const discountForCross = parseFloat(formData.discountValue || "0");

      if (minSpendVal) {
        if (isNaN(minSpendNum) || minSpendNum <= 0) {
          errors.minimumSpend = "Must be a positive number";
        } else if (discountForCross > 0 && minSpendNum <= discountForCross) {
          errors.minimumSpend = `Must be greater than the discount amount ($${discountForCross})`;
        }
      } else if (validateAll) {
        errors.minimumSpend = "Minimum spend is required";
      }
    }

    // cashbackCap for cashback (optional, but if provided must be > 0)
    if (offerType === "cashback") {
      const capVal = formData.cashbackCap?.trim() || "";
      const capNum = parseFloat(capVal);
      if (capVal) {
        if (isNaN(capNum) || capNum <= 0) {
          errors.cashbackCap = "Must be greater than $0";
        }
      }
    }
  }

  // ── content ───────────────────────────────────────────────────────────
  const offerName = formData.offerName?.trim() || "";
  if (offerName && offerName.length > 60) {
    errors.offerName = "Must be 60 characters or less";
  } else if (!offerName && validateAll) {
    errors.offerName = "Headline is required";
  }

  const description = formData.description?.trim() || "";
  if (description && description.length > 250) {
    errors.description = "Must be 250 characters or less";
  } else if (!description && validateAll) {
    errors.description = "Description is required";
  }

  // ── redemption ────────────────────────────────────────────────────────
  if (offerType) {
    const method = getAutoRedemptionMethod(offerType);
    if (method === "online") {
      const url = formData.externalUrl?.trim() || "";
      if (url) {
        if (!/^https?:\/\//i.test(url)) {
          errors.externalUrl = "Must start with http:// or https://";
        }
      } else if (validateAll) {
        errors.externalUrl = "Redemption URL is required";
      }

      const promo = formData.promoCode?.trim() || "";
      if (!promo && validateAll) {
        errors.promoCode = "Promo code is required";
      }
    }
  }

  // ── classification ────────────────────────────────────────────────────
  if ((formData.category_ids?.length || 0) === 0 && validateAll) {
    errors.category_ids = "At least one category is required";
  }

  // ── dates ─────────────────────────────────────────────────────────────
  if (!formData.startDate && validateAll) {
    errors.startDate = "Start date is required";
  }

  if (
    formData.endDate &&
    formData.startDate &&
    formData.endDate < formData.startDate
  ) {
    errors.endDate = "End date must be on or after start date";
  }

  // ── Build section error map ───────────────────────────────────────────
  const sectionFields: Record<string, string[]> = {
    "type-details": [
      "discountValue",
      "shortText",
      "minimumSpend",
      "cashbackCap",
    ],
    content: ["offerName", "description"],
    redemption: ["externalUrl", "promoCode"],
    classification: ["category_ids"],
    dates: ["startDate", "endDate"],
  };

  const sectionHasErrors: Record<string, boolean> = {};
  let firstSectionWithError: string | null = null;

  for (const sectionId of SECTION_ORDER) {
    const fields = sectionFields[sectionId] || [];
    const hasError = fields.some((f) => errors[f]);
    sectionHasErrors[sectionId] = hasError;
    if (hasError && !firstSectionWithError) {
      firstSectionWithError = sectionId;
    }
  }

  return {
    errors,
    sectionHasErrors,
    hasErrors: Object.keys(errors).length > 0,
    firstSectionWithError,
  };
}

// ============================================================================
// REACT HOOK WRAPPER
// ============================================================================

export function useFormValidation(
  formData: Parameters<typeof computeValidationErrors>[0],
  validateAll: boolean
): ValidationResult {
  return useMemo(
    () => computeValidationErrors(formData, validateAll),
    [
      formData.offerType,
      formData.discountValue,
      formData.shortText,
      formData.minimumSpend,
      formData.cashbackCap,
      formData.offerName,
      formData.description,
      formData.externalUrl,
      formData.promoCode,
      formData.category_ids,
      formData.startDate,
      formData.endDate,
      validateAll,
    ]
  );
}
