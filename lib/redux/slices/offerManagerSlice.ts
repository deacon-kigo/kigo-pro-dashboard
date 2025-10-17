import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OfferManagerState {
  isCreatingOffer: boolean;
  currentStep: "goal" | "details" | "redemption" | "campaign" | "review" | "";
  workflowPhase:
    | "dashboard"
    | "goal_setting"
    | "offer_configuration"
    | "redemption_setup"
    | "campaign_planning"
    | "review_launch";
  formData: {
    businessObjective: string;
    offerType: string;
    offerTitle: string;
    programType: string;
    targetAudience: string[];
  };
}

const initialState: OfferManagerState = {
  isCreatingOffer: false,
  currentStep: "",
  workflowPhase: "dashboard",
  formData: {
    businessObjective: "",
    offerType: "",
    offerTitle: "",
    programType: "",
    targetAudience: [],
  },
};

const offerManagerSlice = createSlice({
  name: "offerManager",
  initialState,
  reducers: {
    setOfferCreationState: (
      state,
      action: PayloadAction<Partial<OfferManagerState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setWorkflowPhase: (
      state,
      action: PayloadAction<OfferManagerState["workflowPhase"]>
    ) => {
      state.workflowPhase = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<OfferManagerState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetOfferManager: () => initialState,
  },
});

export const {
  setOfferCreationState,
  setWorkflowPhase,
  setFormData,
  resetOfferManager,
} = offerManagerSlice.actions;

export default offerManagerSlice.reducer;
