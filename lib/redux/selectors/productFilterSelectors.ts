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
    return criteria.length > 0;
  }
);

export const selectMissingRequiredCriteria = createSelector(
  [selectCriteria],
  (criteria) => {
    if (criteria.length > 0) {
      return [];
    }

    return [
      "MerchantKeyword",
      "MerchantName",
      "OfferCommodity",
      "OfferKeyword",
    ];
  }
);

export const selectIsFormValid = createSelector(
  [selectFilterName, selectDescription, selectHasAllRequiredCriteria],
  (filterName, description, hasAllRequiredCriteria) => {
    return (
      filterName.trim() !== "" &&
      description.trim() !== "" &&
      hasAllRequiredCriteria
    );
  }
);

// Complete filter context for AI
export const selectCompleteFilterContext = createSelector(
  [
    selectFilterName,
    selectDescription,
    selectExpiryDate,
    selectCriteria,
    (state: RootState) => state.aiAssistant.messages,
  ],
  (filterName, description, expiryDate, criteria, messages) => {
    return {
      filterName,
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
