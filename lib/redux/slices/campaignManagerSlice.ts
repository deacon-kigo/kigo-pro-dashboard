import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Campaign,
  CampaignTargeting,
  CampaignSchedule,
  DeliveryChannel,
} from "@/types/campaigns";

export interface CampaignManagerState {
  isCreatingCampaign: boolean;
  currentStep: "targeting" | "schedule" | "delivery" | "review" | "";
  workflowPhase:
    | "dashboard"
    | "campaign_targeting"
    | "campaign_schedule"
    | "delivery_configuration"
    | "review_launch";
  campaigns: Campaign[];
  selectedCampaign?: Campaign;
  formData: {
    name: string;
    description: string;
    programType: string;
    offerId: string;
    merchantId: string;
    targeting: Partial<CampaignTargeting>;
    schedule: Partial<CampaignSchedule>;
    deliveryChannels: DeliveryChannel[];
  };
}

const initialState: CampaignManagerState = {
  isCreatingCampaign: false,
  currentStep: "",
  workflowPhase: "dashboard",
  campaigns: [],
  selectedCampaign: undefined,
  formData: {
    name: "",
    description: "",
    programType: "open_loop",
    offerId: "",
    merchantId: "",
    targeting: {
      targeting_method: "customer_list_upload",
      partner_ids: [],
      geographic_scope: [],
      customer_ids: [],
    },
    schedule: {
      timezone: "America/Los_Angeles",
    },
    deliveryChannels: [],
  },
};

const campaignManagerSlice = createSlice({
  name: "campaignManager",
  initialState,
  reducers: {
    setCampaignCreationState: (
      state,
      action: PayloadAction<Partial<CampaignManagerState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setWorkflowPhase: (
      state,
      action: PayloadAction<CampaignManagerState["workflowPhase"]>
    ) => {
      state.workflowPhase = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<Partial<CampaignManagerState["formData"]>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSelectedCampaign: (
      state,
      action: PayloadAction<Campaign | undefined>
    ) => {
      state.selectedCampaign = action.payload;
    },
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
    },
    addDeliveryChannel: (state, action: PayloadAction<DeliveryChannel>) => {
      state.formData.deliveryChannels.push(action.payload);
    },
    removeDeliveryChannel: (state, action: PayloadAction<number>) => {
      state.formData.deliveryChannels.splice(action.payload, 1);
    },
    updateDeliveryChannel: (
      state,
      action: PayloadAction<{ index: number; data: Partial<DeliveryChannel> }>
    ) => {
      state.formData.deliveryChannels[action.payload.index] = {
        ...state.formData.deliveryChannels[action.payload.index],
        ...action.payload.data,
      };
    },
    resetCampaignManager: () => initialState,
  },
});

export const {
  setCampaignCreationState,
  setWorkflowPhase,
  setFormData,
  setSelectedCampaign,
  setCampaigns,
  addDeliveryChannel,
  removeDeliveryChannel,
  updateDeliveryChannel,
  resetCampaignManager,
} = campaignManagerSlice.actions;

export default campaignManagerSlice.reducer;
