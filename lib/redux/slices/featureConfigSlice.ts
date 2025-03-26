import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TicketingFeatures {
  useExternalSystem?: boolean;
  externalSystemName?: string;
  requireCustomerId?: boolean;
}

export interface AnalyticsFeatures {
  enableCallVolumeTracking?: boolean;
}

export interface FeatureConfig {
  features: {
    ticketing?: TicketingFeatures;
    analytics?: AnalyticsFeatures;
  };
}

const initialState: FeatureConfig = {
  features: {
    ticketing: {
      useExternalSystem: true,
      externalSystemName: 'ServiceNow',
      requireCustomerId: true
    },
    analytics: {
      enableCallVolumeTracking: true
    }
  }
};

export const featureConfigSlice = createSlice({
  name: 'featureConfig',
  initialState,
  reducers: {
    updateTicketingFeatures: (state, action: PayloadAction<TicketingFeatures>) => {
      state.features.ticketing = {
        ...state.features.ticketing,
        ...action.payload
      };
    },
    updateAnalyticsFeatures: (state, action: PayloadAction<AnalyticsFeatures>) => {
      state.features.analytics = {
        ...state.features.analytics,
        ...action.payload
      };
    }
  }
});

export const { updateTicketingFeatures, updateAnalyticsFeatures } = featureConfigSlice.actions;

export default featureConfigSlice.reducer; 