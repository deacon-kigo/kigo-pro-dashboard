import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

// Define the ad creation steps
export const CAMPAIGN_STEPS = [
  {
    id: "ad-creation",
    title: "Ad Asset Creation",
    description: "Select merchant, offer, upload assets and set duration",
  },
  {
    id: "review",
    title: "Review & Launch",
    description: "Review your ad asset before launching",
  },
];

export interface CampaignBasicInfo {
  name: string;
  description: string;
  campaignType?: string; // Optional for backward compatibility
}

export interface CampaignTargeting {
  startDate: string | null;
  endDate: string | null;
  noEndDate: boolean;
  locations: Array<{
    id: string;
    type: "state" | "msa" | "zipcode";
    value: string;
  }>;
  gender: string[];
  ageRange: [number, number] | null;
  campaignWeight: "small" | "medium" | "large";
}

export interface CampaignDistribution {
  channels: string[];
  programs: string[];
  programCampaigns: string[];
}

export interface MediaAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl: string;
  dimensions?: { width: number; height: number };
  mediaType?: string; // Add mediaType to track which media type this asset belongs to
}

export interface CampaignAd {
  id: string;
  name: string;
  merchantId: string;
  merchantName: string;
  offerId: string;
  mediaType: string[];
  mediaAssets: MediaAsset[];
  costPerActivation: number;
  costPerRedemption: number;
}

export interface CampaignBudget {
  maxBudget: number;
  estimatedReach: number | null;
  noMaxBudget: boolean;
}

export interface CampaignState {
  currentStep: number;
  formData: {
    basicInfo: CampaignBasicInfo;
    targeting: CampaignTargeting;
    distribution: CampaignDistribution;
    ads: CampaignAd[];
    budget: CampaignBudget;
  };
  stepValidation: {
    [key: string]: boolean;
  };
  isGenerating: boolean;
  lastGeneratedUpdate: string | null;
}

// Initial state with empty form values
const initialState: CampaignState = {
  currentStep: 0,
  formData: {
    basicInfo: {
      name: "",
      description: "",
      campaignType: "Advertising",
    },
    targeting: {
      startDate: null,
      endDate: null,
      noEndDate: false,
      locations: [],
      gender: [],
      ageRange: null,
      campaignWeight: "medium",
    },
    distribution: {
      channels: ["email", "social", "display", "search", "inapp"], // All selected by default
      programs: [],
      programCampaigns: [],
    },
    ads: [],
    budget: {
      maxBudget: 0,
      estimatedReach: null,
      noMaxBudget: false,
    },
  },
  stepValidation: {
    "basic-info": true,
    "ad-creation": true,
    "targeting-budget": true,
    distribution: true,
    review: true,
  },
  isGenerating: false,
  lastGeneratedUpdate: null,
};

// Create action for updating dates with Date objects
export const setStartDate = createAction<Date | null>("campaign/setStartDate");
export const setEndDate = createAction<Date | null>("campaign/setEndDate");

// Create action for AI updates
export const applyCampaignUpdate = createAction<{
  basicInfo?: Partial<CampaignBasicInfo>;
  targeting?: Partial<CampaignTargeting>;
  distribution?: Partial<CampaignDistribution>;
  ads?: CampaignAd[];
  budget?: Partial<CampaignBudget>;
}>("campaign/applyCampaignUpdate");

// Create actions for ad management
export const addAd = createAction<CampaignAd>("campaign/addAd");
export const updateAd = createAction<{ id: string; data: Partial<CampaignAd> }>(
  "campaign/updateAd"
);
export const removeAd = createAction<string>("campaign/removeAd");
export const addMediaToAd = createAction<{ adId: string; media: MediaAsset }>(
  "campaign/addMediaToAd"
);
export const removeMediaFromAd = createAction<{
  adId: string;
  mediaId: string;
}>("campaign/removeMediaFromAd");

// Create the slice
export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateBasicInfo: (
      state,
      action: PayloadAction<Partial<CampaignBasicInfo>>
    ) => {
      state.formData.basicInfo = {
        ...state.formData.basicInfo,
        ...action.payload,
      };
    },
    updateTargeting: (
      state,
      action: PayloadAction<Partial<CampaignTargeting>>
    ) => {
      state.formData.targeting = {
        ...state.formData.targeting,
        ...action.payload,
      };
    },
    updateDistribution: (
      state,
      action: PayloadAction<Partial<CampaignDistribution>>
    ) => {
      state.formData.distribution = {
        ...state.formData.distribution,
        ...action.payload,
      };
    },
    updateBudget: (state, action: PayloadAction<Partial<CampaignBudget>>) => {
      state.formData.budget = {
        ...state.formData.budget,
        ...action.payload,
      };
    },
    setStepValidation: (
      state,
      action: PayloadAction<{ step: string; isValid: boolean }>
    ) => {
      state.stepValidation[action.payload.step] = action.payload.isValid;
    },
    addLocation: (
      state,
      action: PayloadAction<{
        id: string;
        type: "state" | "msa" | "zipcode";
        value: string;
      }>
    ) => {
      state.formData.targeting.locations.push(action.payload);
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.formData.targeting.locations =
        state.formData.targeting.locations.filter(
          (loc) => loc.id !== action.payload
        );
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setLastGeneratedUpdate: (state, action: PayloadAction<string | null>) => {
      state.lastGeneratedUpdate = action.payload;
    },
    resetCampaign: () => initialState,
  },
  extraReducers: (builder) => {
    // Handle date serialization
    builder
      .addCase(setStartDate, (state, action) => {
        state.formData.targeting.startDate = action.payload
          ? action.payload.toISOString()
          : null;
      })
      .addCase(setEndDate, (state, action) => {
        state.formData.targeting.endDate = action.payload
          ? action.payload.toISOString()
          : null;
      })
      .addCase(applyCampaignUpdate, (state, action) => {
        const { basicInfo, targeting, distribution, ads, budget } =
          action.payload;

        if (basicInfo) {
          state.formData.basicInfo = {
            ...state.formData.basicInfo,
            ...basicInfo,
          };
        }

        if (targeting) {
          state.formData.targeting = {
            ...state.formData.targeting,
            ...targeting,
          };
        }

        if (distribution) {
          state.formData.distribution = {
            ...state.formData.distribution,
            ...distribution,
          };
        }

        if (ads) {
          state.formData.ads = ads;
        }

        if (budget) {
          state.formData.budget = {
            ...state.formData.budget,
            ...budget,
          };
        }

        state.lastGeneratedUpdate = "ai-update";
      })
      .addCase(addAd, (state, action) => {
        state.formData.ads.push(action.payload);
      })
      .addCase(updateAd, (state, action) => {
        const { id, data } = action.payload;
        const adIndex = state.formData.ads.findIndex((ad) => ad.id === id);

        if (adIndex !== -1) {
          state.formData.ads[adIndex] = {
            ...state.formData.ads[adIndex],
            ...data,
          };
        }
      })
      .addCase(removeAd, (state, action) => {
        state.formData.ads = state.formData.ads.filter(
          (ad) => ad.id !== action.payload
        );
      })
      .addCase(addMediaToAd, (state, action) => {
        const { adId, media } = action.payload;
        const adIndex = state.formData.ads.findIndex((ad) => ad.id === adId);

        if (adIndex !== -1) {
          state.formData.ads[adIndex].mediaAssets.push(media);
        }
      })
      .addCase(removeMediaFromAd, (state, action) => {
        const { adId, mediaId } = action.payload;
        const adIndex = state.formData.ads.findIndex((ad) => ad.id === adId);

        if (adIndex !== -1) {
          state.formData.ads[adIndex].mediaAssets = state.formData.ads[
            adIndex
          ].mediaAssets.filter((media) => media.id !== mediaId);
        }
      });
  },
});

// Export actions
export const {
  setCurrentStep,
  updateBasicInfo,
  updateTargeting,
  updateDistribution,
  updateBudget,
  setStepValidation,
  addLocation,
  removeLocation,
  setIsGenerating,
  setLastGeneratedUpdate,
  resetCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
