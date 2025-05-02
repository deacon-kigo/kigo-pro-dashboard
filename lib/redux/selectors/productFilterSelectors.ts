import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Basic selectors
export const selectFilterName = (state: RootState) =>
  state.productFilter.filterName;
export const selectQueryViewName = (state: RootState) =>
  state.productFilter.queryViewName;
export const selectDescription = (state: RootState) =>
  state.productFilter.description;
export const selectExpiryDate = (state: RootState) =>
  state.productFilter.expiryDate;
export const selectCriteria = (state: RootState) =>
  state.productFilter.criteria;
export const selectIsGenerating = (state: RootState) =>
  state.productFilter.isGenerating;
export const selectLastGeneratedFilter = (state: RootState) =>
  state.productFilter.lastGeneratedFilter;
export const selectCoverageStats = (state: RootState) =>
  state.productFilter.coverageStats;

// Computed selectors
export const selectHasAllRequiredCriteria = createSelector(
  [selectCriteria],
  (criteria) => {
    const requiredTypes = [
      "MerchantKeyword",
      "MerchantName",
      "OfferCommodity",
      "OfferKeyword",
    ];

    return requiredTypes.every((type) =>
      criteria.some((criteria) => criteria.type === type)
    );
  }
);

export const selectMissingRequiredCriteria = createSelector(
  [selectCriteria],
  (criteria) => {
    const requiredTypes = [
      "MerchantKeyword",
      "MerchantName",
      "OfferCommodity",
      "OfferKeyword",
    ];

    return requiredTypes.filter(
      (type) => !criteria.some((criteria) => criteria.type === type)
    );
  }
);

export const selectIsFormValid = createSelector(
  [
    selectFilterName,
    selectQueryViewName,
    selectExpiryDate,
    selectHasAllRequiredCriteria,
  ],
  (filterName, queryViewName, expiryDate, hasAllRequiredCriteria) => {
    return (
      filterName.trim() !== "" &&
      queryViewName.trim() !== "" &&
      expiryDate !== null &&
      hasAllRequiredCriteria
    );
  }
);

// Complete filter context for AI
export const selectCompleteFilterContext = createSelector(
  [
    selectFilterName,
    selectQueryViewName,
    selectDescription,
    selectExpiryDate,
    selectCriteria,
    (state: RootState) => state.aiAssistant.messages,
  ],
  (filterName, queryViewName, description, expiryDate, criteria, messages) => {
    return {
      filterName,
      queryViewName,
      description,
      expiryDate,
      criteria,
      conversationHistory: messages,
    };
  }
);

// Get criteria by type
export const selectCriteriaByType = (type: string) =>
  createSelector([selectCriteria], (criteria) =>
    criteria.find((c) => c.type === type)
  );

// Get criteria for display (formatted)
export const selectCriteriaForDisplay = createSelector(
  [selectCriteria],
  (criteria) => {
    return criteria.map((c) => ({
      ...c,
      displayValue: `${c.type}: ${c.value} (${c.rule})`,
      isRequired: [
        "MerchantKeyword",
        "MerchantName",
        "OfferCommodity",
        "OfferKeyword",
      ].includes(c.type),
    }));
  }
);
