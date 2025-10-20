import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Offer } from "@/types/offers";

export interface OfferManagerState {
  isCreatingOffer: boolean;
  currentStep:
    | "offer_selection"
    | "goal"
    | "details"
    | "redemption"
    | "campaign"
    | "review"
    | "";
  workflowPhase:
    | "dashboard"
    | "offer_selection"
    | "goal_setting"
    | "offer_configuration"
    | "redemption_setup"
    | "campaign_planning"
    | "review_launch";
  // Offer selection state
  offerSelectionMode: "select" | "create"; // Select existing or create new
  selectedOffer?: Offer; // When user selects existing offer
  // Form data for creating new offers
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
  offerSelectionMode: "create", // Default to create new offer
  selectedOffer: undefined,
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
    setOfferSelectionMode: (
      state,
      action: PayloadAction<"select" | "create">
    ) => {
      state.offerSelectionMode = action.payload;
      // Clear selected offer when switching to create mode
      if (action.payload === "create") {
        state.selectedOffer = undefined;
      }
    },
    setSelectedOffer: (state, action: PayloadAction<Offer | undefined>) => {
      state.selectedOffer = action.payload;
      // When selecting an offer, switch to select mode
      if (action.payload) {
        state.offerSelectionMode = "select";
      }
    },
    resetOfferManager: () => initialState,
  },
});

export const {
  setOfferCreationState,
  setWorkflowPhase,
  setFormData,
  setOfferSelectionMode,
  setSelectedOffer,
  resetOfferManager,
} = offerManagerSlice.actions;

export default offerManagerSlice.reducer;
