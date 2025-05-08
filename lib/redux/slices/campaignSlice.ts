import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

// Define the campaign steps
export const CAMPAIGN_STEPS = [
  {
    id: "basic-info",
    title: "Basic Information",
    description: "Core campaign parameters",
  },
  {
    id: "targeting",
    title: "Targeting",
    description: "Define your audience",
  },
  {
    id: "distribution",
    title: "Distribution",
    description: "Channels and programs",
  },
  {
    id: "budget",
    title: "Budget",
    description: "Set budget and metrics",
  },
  {
    id: "review",
    title: "Review & Publish",
    description: "Review campaign details",
  },
];

export interface CampaignBasicInfo {
  name: string;
  description: string;
  campaignType: string;
  startDate: string | null;
  endDate: string | null;
}

export interface CampaignTargeting {
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
  partners: string[];
  programs: string[];
  programCampaigns: string[];
}

export interface CampaignBudget {
  maxBudget: number;
  estimatedReach: number | null;
}

export interface CampaignState {
  currentStep: number;
  formData: {
    basicInfo: CampaignBasicInfo;
    targeting: CampaignTargeting;
    distribution: CampaignDistribution;
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
      startDate: null,
      endDate: null,
    },
    targeting: {
      locations: [],
      gender: [],
      ageRange: null,
      campaignWeight: "medium",
    },
    distribution: {
      channels: [],
      partners: [],
      programs: [],
      programCampaigns: [],
    },
    budget: {
      maxBudget: 0,
      estimatedReach: null,
    },
  },
  stepValidation: {
    "basic-info": true,
    targeting: true,
    distribution: true,
    budget: true,
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
  budget?: Partial<CampaignBudget>;
}>("campaign/applyCampaignUpdate");

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
        state.formData.basicInfo.startDate = action.payload
          ? action.payload.toISOString()
          : null;
      })
      .addCase(setEndDate, (state, action) => {
        state.formData.basicInfo.endDate = action.payload
          ? action.payload.toISOString()
          : null;
      })
      .addCase(applyCampaignUpdate, (state, action) => {
        const { basicInfo, targeting, distribution, budget } = action.payload;

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

        if (budget) {
          state.formData.budget = {
            ...state.formData.budget,
            ...budget,
          };
        }

        state.lastGeneratedUpdate = "ai-update";
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
