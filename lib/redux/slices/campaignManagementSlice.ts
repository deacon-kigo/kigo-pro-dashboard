/**
 * Campaign Management Redux Slice
 *
 * Manages state for the Campaign Management feature including:
 * - Campaign list with filters and pagination
 * - Campaign creation wizard
 * - Campaign details and editing
 * - Loading and error states
 *
 * Related BRD: documentation/brd/campaign-management.md
 * Related Design: documentation/features/campaign-management-design.md
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CampaignManagement,
  CampaignManagementWizardStep,
  CampaignManagementFormData,
  CampaignManagementFormErrors,
  CampaignManagementFilters,
  CampaignManagementSort,
  CampaignManagementPagination,
  CampaignManagementStats,
  initialCampaignFormData,
  initialCampaignFilters,
  initialCampaignPagination,
} from "@/types/campaign-management";

/**
 * Campaign Management State interface
 */
export interface CampaignManagementState {
  // Wizard state for campaign creation
  isCreating: boolean;
  currentStep: CampaignManagementWizardStep;
  formData: CampaignManagementFormData;
  formErrors: CampaignManagementFormErrors;

  // List state
  campaigns: CampaignManagement[];
  filters: CampaignManagementFilters;
  sort: CampaignManagementSort;
  pagination: CampaignManagementPagination;

  // Selected campaign (for details/edit view)
  selectedCampaign: CampaignManagement | null;
  isEditMode: boolean;

  // Dashboard stats
  stats: CampaignManagementStats | null;

  // Loading states
  loading: boolean; // General loading state
  loadingList: boolean; // Loading campaign list
  loadingDetails: boolean; // Loading campaign details
  loadingStats: boolean; // Loading stats
  submitting: boolean; // Submitting form (create/update)

  // Error state
  error: string | null;
}

/**
 * Initial state
 */
const initialState: CampaignManagementState = {
  // Wizard state
  isCreating: false,
  currentStep: "basic",
  formData: initialCampaignFormData,
  formErrors: {},

  // List state
  campaigns: [],
  filters: initialCampaignFilters,
  sort: {
    field: "created_at",
    order: "desc",
  },
  pagination: initialCampaignPagination,

  // Selected campaign
  selectedCampaign: null,
  isEditMode: false,

  // Stats
  stats: null,

  // Loading states
  loading: false,
  loadingList: false,
  loadingDetails: false,
  loadingStats: false,
  submitting: false,

  // Error state
  error: null,
};

/**
 * Campaign Management Slice
 */
const campaignManagementSlice = createSlice({
  name: "campaignManagement",
  initialState,
  reducers: {
    // ========================================================================
    // Wizard Actions
    // ========================================================================

    /**
     * Start campaign creation wizard
     */
    startCampaignCreation: (state) => {
      state.isCreating = true;
      state.currentStep = "basic";
      state.formData = initialCampaignFormData;
      state.formErrors = {};
      state.error = null;
    },

    /**
     * Set current wizard step
     */
    setCurrentStep: (
      state,
      action: PayloadAction<CampaignManagementWizardStep>
    ) => {
      state.currentStep = action.payload;
    },

    /**
     * Update form data (partial update)
     */
    updateFormData: (
      state,
      action: PayloadAction<Partial<CampaignManagementFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    /**
     * Set form data (full replacement)
     */
    setFormData: (state, action: PayloadAction<CampaignManagementFormData>) => {
      state.formData = action.payload;
    },

    /**
     * Set form validation errors
     */
    setFormErrors: (
      state,
      action: PayloadAction<CampaignManagementFormErrors>
    ) => {
      state.formErrors = action.payload;
    },

    /**
     * Clear form errors
     */
    clearFormErrors: (state) => {
      state.formErrors = {};
    },

    /**
     * Reset wizard to initial state
     */
    resetWizard: (state) => {
      state.isCreating = false;
      state.currentStep = "basic";
      state.formData = initialCampaignFormData;
      state.formErrors = {};
      state.error = null;
    },

    // ========================================================================
    // List Actions
    // ========================================================================

    /**
     * Set campaigns list
     */
    setCampaigns: (state, action: PayloadAction<CampaignManagement[]>) => {
      state.campaigns = action.payload;
    },

    /**
     * Add campaign to list (used after creation)
     */
    addCampaign: (state, action: PayloadAction<CampaignManagement>) => {
      state.campaigns.unshift(action.payload); // Add to beginning
      state.pagination.total += 1;
    },

    /**
     * Update campaign in list
     */
    updateCampaignInList: (
      state,
      action: PayloadAction<CampaignManagement>
    ) => {
      const index = state.campaigns.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },

    /**
     * Remove campaign from list
     */
    removeCampaignFromList: (state, action: PayloadAction<string>) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
      state.pagination.total -= 1;
    },

    /**
     * Set filters
     */
    setFilters: (
      state,
      action: PayloadAction<Partial<CampaignManagementFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change
      state.pagination.page = 1;
    },

    /**
     * Clear filters
     */
    clearFilters: (state) => {
      state.filters = initialCampaignFilters;
      state.pagination.page = 1;
    },

    /**
     * Set sort configuration
     */
    setSort: (state, action: PayloadAction<CampaignManagementSort>) => {
      state.sort = action.payload;
    },

    /**
     * Set pagination
     */
    setPagination: (
      state,
      action: PayloadAction<Partial<CampaignManagementPagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    /**
     * Go to next page
     */
    nextPage: (state) => {
      if (state.pagination.page < state.pagination.total_pages) {
        state.pagination.page += 1;
      }
    },

    /**
     * Go to previous page
     */
    previousPage: (state) => {
      if (state.pagination.page > 1) {
        state.pagination.page -= 1;
      }
    },

    // ========================================================================
    // Selected Campaign Actions
    // ========================================================================

    /**
     * Set selected campaign for details view
     */
    setSelectedCampaign: (
      state,
      action: PayloadAction<CampaignManagement | null>
    ) => {
      state.selectedCampaign = action.payload;
    },

    /**
     * Enter edit mode for selected campaign
     */
    enterEditMode: (state) => {
      if (state.selectedCampaign) {
        state.isEditMode = true;
        // Populate form with campaign data
        state.formData = {
          partner_id: state.selectedCampaign.partner_id,
          program_id: state.selectedCampaign.program_id,
          name: state.selectedCampaign.name,
          type: state.selectedCampaign.type,
          description: state.selectedCampaign.description || "",
          start_date: new Date(state.selectedCampaign.start_date),
          end_date: new Date(state.selectedCampaign.end_date),
          active: state.selectedCampaign.active,
          auto_activate: state.selectedCampaign.auto_activate,
          auto_deactivate: state.selectedCampaign.auto_deactivate,
        };
        state.formErrors = {};
      }
    },

    /**
     * Exit edit mode
     */
    exitEditMode: (state) => {
      state.isEditMode = false;
      state.formData = initialCampaignFormData;
      state.formErrors = {};
    },

    /**
     * Update selected campaign (after edit)
     */
    updateSelectedCampaign: (
      state,
      action: PayloadAction<CampaignManagement>
    ) => {
      state.selectedCampaign = action.payload;
      // Also update in list if present
      const index = state.campaigns.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },

    // ========================================================================
    // Stats Actions
    // ========================================================================

    /**
     * Set campaign statistics
     */
    setStats: (state, action: PayloadAction<CampaignManagementStats>) => {
      state.stats = action.payload;
    },

    // ========================================================================
    // Loading & Error Actions
    // ========================================================================

    /**
     * Set general loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set list loading state
     */
    setLoadingList: (state, action: PayloadAction<boolean>) => {
      state.loadingList = action.payload;
    },

    /**
     * Set details loading state
     */
    setLoadingDetails: (state, action: PayloadAction<boolean>) => {
      state.loadingDetails = action.payload;
    },

    /**
     * Set stats loading state
     */
    setLoadingStats: (state, action: PayloadAction<boolean>) => {
      state.loadingStats = action.payload;
    },

    /**
     * Set submitting state (for forms)
     */
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },

    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    // ========================================================================
    // Reset Actions
    // ========================================================================

    /**
     * Reset entire campaign management state
     */
    resetCampaignManagement: () => initialState,
  },
});

/**
 * Export actions
 */
export const {
  // Wizard actions
  startCampaignCreation,
  setCurrentStep,
  updateFormData,
  setFormData,
  setFormErrors,
  clearFormErrors,
  resetWizard,

  // List actions
  setCampaigns,
  addCampaign,
  updateCampaignInList,
  removeCampaignFromList,
  setFilters,
  clearFilters,
  setSort,
  setPagination,
  nextPage,
  previousPage,

  // Selected campaign actions
  setSelectedCampaign,
  enterEditMode,
  exitEditMode,
  updateSelectedCampaign,

  // Stats actions
  setStats,

  // Loading & error actions
  setLoading,
  setLoadingList,
  setLoadingDetails,
  setLoadingStats,
  setSubmitting,
  setError,
  clearError,

  // Reset actions
  resetCampaignManagement,
} = campaignManagementSlice.actions;

/**
 * Export reducer
 */
export default campaignManagementSlice.reducer;
