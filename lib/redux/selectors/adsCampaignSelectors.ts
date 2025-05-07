import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Basic selectors
export const selectMerchantId = (state: RootState) =>
  state.adsCampaign.merchantId;
export const selectMerchantName = (state: RootState) =>
  state.adsCampaign.merchantName;
export const selectOfferId = (state: RootState) => state.adsCampaign.offerId;
export const selectCampaignName = (state: RootState) =>
  state.adsCampaign.campaignName;
export const selectCampaignDescription = (state: RootState) =>
  state.adsCampaign.campaignDescription;
export const selectStartDate = (state: RootState) =>
  state.adsCampaign.startDate;
export const selectEndDate = (state: RootState) => state.adsCampaign.endDate;
export const selectCampaignWeight = (state: RootState) =>
  state.adsCampaign.campaignWeight;
export const selectMediaTypes = (state: RootState) =>
  state.adsCampaign.mediaTypes;
export const selectLocations = (state: RootState) =>
  state.adsCampaign.locations;
export const selectBudget = (state: RootState) => state.adsCampaign.budget;
export const selectCostPerActivation = (state: RootState) =>
  state.adsCampaign.costPerActivation;
export const selectCostPerRedemption = (state: RootState) =>
  state.adsCampaign.costPerRedemption;
export const selectImages = (state: RootState) => state.adsCampaign.images;
export const selectIsGenerating = (state: RootState) =>
  state.adsCampaign.isGenerating;
export const selectLastGenerated = (state: RootState) =>
  state.adsCampaign.lastGenerated;

// Computed selectors
export const selectHasRequiredMerchantInfo = createSelector(
  [selectMerchantId, selectMerchantName],
  (merchantId, merchantName) => {
    return merchantId.trim() !== "" && merchantName.trim() !== "";
  }
);

export const selectHasRequiredBasicInfo = createSelector(
  [
    selectCampaignName,
    selectCampaignDescription,
    selectStartDate,
    selectEndDate,
  ],
  (campaignName, campaignDescription, startDate, endDate) => {
    return (
      campaignName.trim() !== "" &&
      campaignDescription.trim() !== "" &&
      startDate !== null &&
      endDate !== null
    );
  }
);

export const selectHasRequiredTargeting = createSelector(
  [selectCampaignWeight, selectMediaTypes, selectLocations],
  (campaignWeight, mediaTypes, locations) => {
    return (
      campaignWeight.trim() !== "" &&
      mediaTypes.length > 0 &&
      locations.length > 0
    );
  }
);

export const selectHasRequiredBudget = createSelector(
  [selectBudget],
  (budget) => {
    return budget.trim() !== "" && parseFloat(budget) > 0;
  }
);

export const selectIsFormValid = createSelector(
  [
    selectHasRequiredMerchantInfo,
    selectHasRequiredBasicInfo,
    selectHasRequiredTargeting,
    selectHasRequiredBudget,
    selectImages,
  ],
  (
    hasRequiredMerchantInfo,
    hasRequiredBasicInfo,
    hasRequiredTargeting,
    hasRequiredBudget,
    images
  ) => {
    return (
      hasRequiredMerchantInfo &&
      hasRequiredBasicInfo &&
      hasRequiredTargeting &&
      hasRequiredBudget &&
      images.length > 0
    );
  }
);

// Complete campaign context for AI
export const selectCompleteCampaignContext = createSelector(
  [
    selectMerchantId,
    selectMerchantName,
    selectOfferId,
    selectCampaignName,
    selectCampaignDescription,
    selectStartDate,
    selectEndDate,
    selectCampaignWeight,
    selectMediaTypes,
    selectLocations,
    selectBudget,
    (state: RootState) => state.aiAssistant.messages,
  ],
  (
    merchantId,
    merchantName,
    offerId,
    campaignName,
    campaignDescription,
    startDate,
    endDate,
    campaignWeight,
    mediaTypes,
    locations,
    budget,
    messages
  ) => {
    return {
      merchantId,
      merchantName,
      offerId,
      campaignName,
      campaignDescription,
      startDate,
      endDate,
      campaignWeight,
      mediaTypes,
      locations,
      budget,
      conversationHistory: messages,
    };
  }
);
