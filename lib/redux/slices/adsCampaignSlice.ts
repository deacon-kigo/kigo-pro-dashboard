import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return (
    Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9)
  );
};

// Define Location type
export interface CampaignLocation {
  id: string;
  type: "state" | "msa" | "zipcode";
  value: string;
}

// Define Image type
export interface CampaignImage {
  id: string;
  fileName: string;
  url?: string;
  file?: File;
}

// Define AdsCampaignState
export interface AdsCampaignState {
  // Basic info
  merchantId: string;
  merchantName: string;
  offerId: string;
  campaignName: string;
  campaignDescription: string;
  startDate: string | null;
  endDate: string | null;

  // Targeting
  campaignWeight: string;
  mediaTypes: string[];
  locations: CampaignLocation[];

  // Budget
  budget: string;
  costPerActivation: string;
  costPerRedemption: string;

  // Images
  images: CampaignImage[];

  // UI state
  isGenerating: boolean;
  lastGenerated: string | null;
}

const initialState: AdsCampaignState = {
  merchantId: "",
  merchantName: "",
  offerId: "",
  campaignName: "",
  campaignDescription: "",
  startDate: null,
  endDate: null,
  campaignWeight: "",
  mediaTypes: [],
  locations: [],
  budget: "",
  costPerActivation: "",
  costPerRedemption: "",
  images: [],
  isGenerating: false,
  lastGenerated: null,
};

// Create action for handling updates from AI
export const applyAICampaignUpdate = createAction<{
  merchantId?: string;
  merchantName?: string;
  offerId?: string;
  campaignName?: string;
  campaignDescription?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  campaignWeight?: string;
  mediaTypes?: string[];
  locations?: Omit<CampaignLocation, "id">[];
  budget?: string;
  costPerActivation?: string;
  costPerRedemption?: string;
}>("adsCampaign/applyAICampaignUpdate");

// Create the slice
export const adsCampaignSlice = createSlice({
  name: "adsCampaign",
  initialState,
  reducers: {
    setMerchantId: (state, action: PayloadAction<string>) => {
      state.merchantId = action.payload;
    },
    setMerchantName: (state, action: PayloadAction<string>) => {
      state.merchantName = action.payload;
    },
    setOfferId: (state, action: PayloadAction<string>) => {
      state.offerId = action.payload;
    },
    setCampaignName: (state, action: PayloadAction<string>) => {
      state.campaignName = action.payload;
    },
    setCampaignDescription: (state, action: PayloadAction<string>) => {
      state.campaignDescription = action.payload;
    },
    _setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    _setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
    setCampaignWeight: (state, action: PayloadAction<string>) => {
      state.campaignWeight = action.payload;
    },
    setMediaTypes: (state, action: PayloadAction<string[]>) => {
      state.mediaTypes = action.payload;
    },
    addMediaType: (state, action: PayloadAction<string>) => {
      if (!state.mediaTypes.includes(action.payload)) {
        state.mediaTypes.push(action.payload);
      }
    },
    removeMediaType: (state, action: PayloadAction<string>) => {
      state.mediaTypes = state.mediaTypes.filter(
        (type) => type !== action.payload
      );
    },
    addLocation: (
      state,
      action: PayloadAction<Omit<CampaignLocation, "id">>
    ) => {
      const id = generateUniqueId();
      state.locations.push({ ...action.payload, id });
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(
        (loc) => loc.id !== action.payload
      );
    },
    setLocations: (state, action: PayloadAction<CampaignLocation[]>) => {
      state.locations = action.payload;
    },
    setBudget: (state, action: PayloadAction<string>) => {
      state.budget = action.payload;
    },
    setCostPerActivation: (state, action: PayloadAction<string>) => {
      state.costPerActivation = action.payload;
    },
    setCostPerRedemption: (state, action: PayloadAction<string>) => {
      state.costPerRedemption = action.payload;
    },
    addImage: (state, action: PayloadAction<Omit<CampaignImage, "id">>) => {
      const id = generateUniqueId();
      state.images.push({ ...action.payload, id });
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.id !== action.payload);
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setLastGenerated: (state, action: PayloadAction<string | null>) => {
      state.lastGenerated = action.payload;
    },
    resetCampaign: (state) => {
      return initialState;
    },
    _applyAICampaignUpdate: (
      state,
      action: PayloadAction<{
        merchantId?: string;
        merchantName?: string;
        offerId?: string;
        campaignName?: string;
        campaignDescription?: string;
        startDate?: string | null;
        endDate?: string | null;
        campaignWeight?: string;
        mediaTypes?: string[];
        locations?: Omit<CampaignLocation, "id">[];
        budget?: string;
        costPerActivation?: string;
        costPerRedemption?: string;
      }>
    ) => {
      const {
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
        costPerActivation,
        costPerRedemption,
      } = action.payload;

      if (merchantId !== undefined) state.merchantId = merchantId;
      if (merchantName !== undefined) state.merchantName = merchantName;
      if (offerId !== undefined) state.offerId = offerId;
      if (campaignName !== undefined) state.campaignName = campaignName;
      if (campaignDescription !== undefined)
        state.campaignDescription = campaignDescription;
      if (startDate !== undefined) state.startDate = startDate;
      if (endDate !== undefined) state.endDate = endDate;
      if (campaignWeight !== undefined) state.campaignWeight = campaignWeight;
      if (mediaTypes !== undefined) state.mediaTypes = mediaTypes;
      if (budget !== undefined) state.budget = budget;
      if (costPerActivation !== undefined)
        state.costPerActivation = costPerActivation;
      if (costPerRedemption !== undefined)
        state.costPerRedemption = costPerRedemption;

      if (locations && locations.length > 0) {
        // Add new locations with IDs
        const newLocations = locations.map((location) => ({
          ...location,
          id: generateUniqueId(),
        }));
        state.locations = [...state.locations, ...newLocations];
      }
    },
  },
  extraReducers: (builder) => {
    // Handle setStartDate with Date object
    builder.addCase(setStartDate, (state, action) => {
      state.startDate = action.payload ? action.payload.toISOString() : null;
    });

    // Handle setEndDate with Date object
    builder.addCase(setEndDate, (state, action) => {
      state.endDate = action.payload ? action.payload.toISOString() : null;
    });

    // Handle AI campaign update
    builder.addCase(applyAICampaignUpdate, (state, action) => {
      const {
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
        costPerActivation,
        costPerRedemption,
      } = action.payload;

      adsCampaignSlice.caseReducers._applyAICampaignUpdate(state, {
        type: "_applyAICampaignUpdate",
        payload: {
          merchantId,
          merchantName,
          offerId,
          campaignName,
          campaignDescription,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
          campaignWeight,
          mediaTypes,
          locations,
          budget,
          costPerActivation,
          costPerRedemption,
        },
      });
    });
  },
});

// Create action creators for date fields that take Date objects
export const setStartDate = createAction<Date | null>(
  "adsCampaign/setStartDate"
);
export const setEndDate = createAction<Date | null>("adsCampaign/setEndDate");

// Export actions
export const {
  setMerchantId,
  setMerchantName,
  setOfferId,
  setCampaignName,
  setCampaignDescription,
  setCampaignWeight,
  setMediaTypes,
  addMediaType,
  removeMediaType,
  addLocation,
  removeLocation,
  setLocations,
  setBudget,
  setCostPerActivation,
  setCostPerRedemption,
  addImage,
  removeImage,
  setIsGenerating,
  setLastGenerated,
  resetCampaign,
} = adsCampaignSlice.actions;

export default adsCampaignSlice.reducer;
