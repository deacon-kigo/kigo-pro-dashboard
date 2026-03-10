import { useMemo } from "react";

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

const SECTION_ORDER = ["offer-details", "redemption", "classification"];

/**
 * Compute validation errors for the form.
 *
 * Strategy:
 * - Fields WITH a value that's invalid → error shows immediately
 * - Required fields that are EMPTY → error only when validateAll=true (publish attempt)
 */
export function computeValidationErrors(
  formData: {
    discountValue?: string;
    offerName?: string;
    description?: string;
    externalUrl?: string;
    promoCode?: string;
    category_ids?: string[];
    startDate?: string;
    endDate?: string;
    redemptionTypes?: string[];
  },
  validateAll: boolean
): ValidationResult {
  const errors: ValidationErrors = {};

  // ── offer-details ──────────────────────────────────────────────────────
  const discountVal = formData.discountValue?.trim() || "";
  if (discountVal) {
    const discountNum = parseFloat(discountVal);
    if (isNaN(discountNum) || discountNum <= 0) {
      errors.discountValue = "Must be a positive number";
    }
  } else if (validateAll) {
    errors.discountValue = "Discount value is required";
  }

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

  // ── redemption ────────────────────────────────────────────────────────
  const hasExternalLink = formData.redemptionTypes?.includes("online");

  if (hasExternalLink) {
    const url = formData.externalUrl?.trim() || "";
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        errors.externalUrl = "Must start with http:// or https://";
      }
    } else if (validateAll) {
      errors.externalUrl = "External URL is required";
    }
  }

  // ── classification ────────────────────────────────────────────────────
  if ((formData.category_ids?.length || 0) === 0 && validateAll) {
    errors.category_ids = "At least one category is required";
  }

  // ── Build section error map ───────────────────────────────────────────
  const sectionFields: Record<string, string[]> = {
    "offer-details": [
      "offerName",
      "description",
      "discountValue",
      "startDate",
      "endDate",
    ],
    redemption: ["externalUrl"],
    classification: ["category_ids"],
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
      formData.discountValue,
      formData.offerName,
      formData.description,
      formData.externalUrl,
      formData.promoCode,
      formData.category_ids,
      formData.startDate,
      formData.endDate,
      formData.redemptionTypes,
      validateAll,
    ]
  );
}
