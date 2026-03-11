import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { LandingPageConfig } from "@/types/tmt-campaign";
import { apiService } from "@/lib/services/tmtCampaignService";

interface TMTCampaignState {
  campaigns: LandingPageConfig[];
  currentCampaign: LandingPageConfig | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  searchQuery: string;
  filterStatus: "all" | "active" | "expired" | "inactive";
  sortBy: "name" | "updated" | "endDate";
}

const initialState: TMTCampaignState = {
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  searchQuery: "",
  filterStatus: "all",
  sortBy: "updated",
};

// Async thunks
export const fetchCampaigns = createAsyncThunk(
  "tmtCampaign/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const campaigns = await apiService.getAllCampaigns();
      return campaigns;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch campaigns"
      );
    }
  }
);

export const fetchCampaignById = createAsyncThunk(
  "tmtCampaign/fetchCampaignById",
  async (id: string, { rejectWithValue }) => {
    try {
      const campaign = await apiService.getCampaignById(id);
      return campaign;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch campaign"
      );
    }
  }
);

export const createCampaign = createAsyncThunk(
  "tmtCampaign/createCampaign",
  async (config: LandingPageConfig, { rejectWithValue }) => {
    try {
      const campaign = await apiService.createCampaign(config);
      return campaign;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create campaign"
      );
    }
  }
);

export const updateCampaign = createAsyncThunk(
  "tmtCampaign/updateCampaign",
  async (
    { id, config }: { id: string; config: LandingPageConfig },
    { rejectWithValue }
  ) => {
    try {
      const campaign = await apiService.updateCampaign(id, config);
      return campaign;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update campaign"
      );
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "tmtCampaign/deleteCampaign",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteCampaign(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete campaign"
      );
    }
  }
);

const tmtCampaignSlice = createSlice({
  name: "tmtCampaign",
  initialState,
  reducers: {
    setCurrentCampaign: (
      state,
      action: PayloadAction<LandingPageConfig | null>
    ) => {
      state.currentCampaign = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (
      state,
      action: PayloadAction<TMTCampaignState["filterStatus"]>
    ) => {
      state.filterStatus = action.payload;
    },
    setSortBy: (state, action: PayloadAction<TMTCampaignState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTMTCampaignState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchCampaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchCampaignById
    builder
      .addCase(fetchCampaignById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // createCampaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.push(action.payload);
        state.currentCampaign = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateCampaign
    builder
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.campaigns.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        state.currentCampaign = action.payload;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // deleteCampaign
    builder
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = state.campaigns.filter(
          (c) => c.id !== action.payload
        );
        if (state.currentCampaign?.id === action.payload) {
          state.currentCampaign = null;
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentCampaign,
  setIsAuthenticated,
  setSearchQuery,
  setFilterStatus,
  setSortBy,
  clearError,
  resetTMTCampaignState,
} = tmtCampaignSlice.actions;

export default tmtCampaignSlice.reducer;
