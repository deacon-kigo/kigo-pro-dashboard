import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Activation } from "@/components/features/jd-perks/types";
import { SEED_ACTIVATIONS } from "@/components/features/jd-perks/mockData";

/**
 * Holds the John Deere dealer's campaign activations for the Perks Pro MVP.
 * Pre-seeded with a couple of activations so the reporting dashboard has data.
 */
export interface JdPerksState {
  activations: Record<string, Activation>;
}

const initialState: JdPerksState = {
  activations: { ...SEED_ACTIVATIONS },
};

export const jdPerksSlice = createSlice({
  name: "jdPerks",
  initialState,
  reducers: {
    activateCampaign: (state, action: PayloadAction<Activation>) => {
      state.activations[action.payload.campaignId] = action.payload;
    },
    deactivateCampaign: (state, action: PayloadAction<string>) => {
      delete state.activations[action.payload];
    },
    resetActivations: (state) => {
      state.activations = { ...SEED_ACTIVATIONS };
    },
  },
});

export const { activateCampaign, deactivateCampaign, resetActivations } =
  jdPerksSlice.actions;

export default jdPerksSlice.reducer;
