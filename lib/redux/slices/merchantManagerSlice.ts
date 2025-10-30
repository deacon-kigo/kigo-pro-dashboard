import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Merchant, MerchantLocation } from "@/types/merchants";

export interface MerchantManagerState {
  isCreatingMerchant: boolean;
  currentStep: "profile" | "locations" | "contract" | "images" | "";
  workflowPhase:
    | "dashboard"
    | "profile_setup"
    | "location_management"
    | "contract_setup"
    | "image_approval";
  merchants: Merchant[];
  selectedMerchant?: Merchant;
  formData: {
    corporationName: string;
    dbaName: string;
    merchantUrl: string;
    highlights: string;
    classification: string;
    subClassification: string;
    crmId: string;
    locations: Partial<MerchantLocation>[];
  };
}

const initialState: MerchantManagerState = {
  isCreatingMerchant: false,
  currentStep: "",
  workflowPhase: "dashboard",
  merchants: [],
  selectedMerchant: undefined,
  formData: {
    corporationName: "",
    dbaName: "",
    merchantUrl: "",
    highlights: "",
    classification: "local",
    subClassification: "",
    crmId: "",
    locations: [],
  },
};

const merchantManagerSlice = createSlice({
  name: "merchantManager",
  initialState,
  reducers: {
    setMerchantCreationState: (
      state,
      action: PayloadAction<Partial<MerchantManagerState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setWorkflowPhase: (
      state,
      action: PayloadAction<MerchantManagerState["workflowPhase"]>
    ) => {
      state.workflowPhase = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<MerchantManagerState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSelectedMerchant: (
      state,
      action: PayloadAction<Merchant | undefined>
    ) => {
      state.selectedMerchant = action.payload;
    },
    setMerchants: (state, action: PayloadAction<Merchant[]>) => {
      state.merchants = action.payload;
    },
    addLocation: (state, action: PayloadAction<Partial<MerchantLocation>>) => {
      state.formData.locations.push(action.payload);
    },
    removeLocation: (state, action: PayloadAction<number>) => {
      state.formData.locations.splice(action.payload, 1);
    },
    updateLocation: (
      state,
      action: PayloadAction<{ index: number; data: Partial<MerchantLocation> }>
    ) => {
      state.formData.locations[action.payload.index] = {
        ...state.formData.locations[action.payload.index],
        ...action.payload.data,
      };
    },
    resetMerchantManager: () => initialState,
  },
});

export const {
  setMerchantCreationState,
  setWorkflowPhase,
  setFormData,
  setSelectedMerchant,
  setMerchants,
  addLocation,
  removeLocation,
  updateLocation,
  resetMerchantManager,
} = merchantManagerSlice.actions;

export default merchantManagerSlice.reducer;
