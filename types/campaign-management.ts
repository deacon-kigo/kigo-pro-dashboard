/**
 * Campaign Management Types
 *
 * Type definitions for the Campaign Management feature in KigoPro.
 * This feature allows internal teams to create and manage campaigns
 * that group offers and products for partner programs.
 *
 * Related BRD: documentation/brd/campaign-management.md
 * Related Design: documentation/features/campaign-management-design.md
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Campaign status computed from dates and active flag
 */
export type CampaignManagementStatus =
  | "draft" // Not yet started, inactive
  | "scheduled" // Future start date, not active yet
  | "active" // Currently running
  | "paused" // Was active but manually paused
  | "ended"; // Past end date

/**
 * Campaign type classification
 */
export type CampaignManagementType =
  | "promotional" // Limited-time promotions
  | "targeted" // Targeted at specific audiences
  | "seasonal"; // Seasonal campaigns (holidays, etc.)

/**
 * Main Campaign entity
 */
export interface CampaignManagement {
  /** Unique campaign identifier */
  id: string;

  // Partner & Program (locked after creation)
  /** Partner ID this campaign belongs to */
  partner_id: string;
  /** Partner name (denormalized for display) */
  partner_name: string;
  /** Program ID this campaign belongs to */
  program_id: string;
  /** Program name (denormalized for display) */
  program_name: string;

  // Basic Information
  /** Campaign name (unique within program) */
  name: string;
  /** Campaign type classification */
  type: CampaignManagementType;
  /** Internal description (not customer-facing) */
  description?: string;

  // Scheduling
  /** Start date/time in ISO format (CST timezone) */
  start_date: string;
  /** End date/time in ISO format (CST timezone) */
  end_date: string;
  /** Whether campaign is currently active */
  active: boolean;
  /** Auto-activate on start_date */
  auto_activate: boolean;
  /** Auto-deactivate on end_date */
  auto_deactivate: boolean;

  // Computed fields
  /** Whether any products are linked (computed backend) */
  has_products: boolean;
  /** Current status (computed from dates + active flag) */
  status: CampaignManagementStatus;

  // Audit fields
  /** Creation timestamp */
  created_at: string;
  /** User who created this campaign */
  created_by: string;
  /** Last update timestamp */
  updated_at?: string;
  /** User who last updated this campaign */
  updated_by?: string;
}

// ============================================================================
// API Input/Output Types
// ============================================================================

/**
 * Input for creating a new campaign
 */
export interface CreateCampaignManagementInput {
  partner_id: string;
  program_id: string;
  name: string;
  type: CampaignManagementType;
  description?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
}

/**
 * Input for updating an existing campaign
 * Note: partner_id and program_id cannot be changed after creation
 */
export interface UpdateCampaignManagementInput {
  name?: string;
  type?: CampaignManagementType;
  description?: string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  auto_activate?: boolean;
  auto_deactivate?: boolean;
}

/**
 * Query parameters for listing campaigns
 */
export interface CampaignManagementListParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page (default: 25) */
  limit?: number;
  /** Search by campaign name */
  search?: string;
  /** Filter by partner */
  partner_id?: string;
  /** Filter by program */
  program_id?: string;
  /** Filter by status */
  status?: CampaignManagementStatus;
  /** Sort field */
  sort_by?: "name" | "start_date" | "end_date" | "created_at";
  /** Sort direction */
  sort_order?: "asc" | "desc";
}

/**
 * Response from campaign list API
 */
export interface CampaignManagementListResponse {
  /** Array of campaigns */
  campaigns: CampaignManagement[];
  /** Total count across all pages */
  total: number;
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of pages */
  total_pages: number;
}

/**
 * Campaign statistics for dashboard
 */
export interface CampaignManagementStats {
  /** Total number of campaigns */
  total: number;
  /** Number of active campaigns */
  active: number;
  /** Number of scheduled campaigns */
  scheduled: number;
  /** Number of ended campaigns */
  ended: number;
  /** Number of draft campaigns */
  draft: number;
  /** Number of paused campaigns */
  paused: number;
}

/**
 * Response for name uniqueness check
 */
export interface CampaignNameCheckResponse {
  /** Whether the name is unique within the program */
  unique: boolean;
  /** Existing campaign ID if name exists (for edit mode) */
  existing_campaign_id?: string;
}

// ============================================================================
// Form State Types
// ============================================================================

/**
 * Wizard steps
 */
export type CampaignManagementWizardStep =
  | "basic" // Partner, Program, Name, Type
  | "configuration" // Description, Dates, Active status
  | "review"; // Review & confirm

/**
 * Form data structure for campaign creation/editing
 */
export interface CampaignManagementFormData {
  // Step 1: Basic Information
  partner_id: string;
  program_id: string;
  name: string;
  type: CampaignManagementType | "";

  // Step 2: Configuration
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
}

/**
 * Initial/empty form data
 */
export const initialCampaignFormData: CampaignManagementFormData = {
  partner_id: "",
  program_id: "",
  name: "",
  type: "",
  description: "",
  start_date: null,
  end_date: null,
  active: false,
  auto_activate: false,
  auto_deactivate: false,
};

/**
 * Form validation errors
 */
export interface CampaignManagementFormErrors {
  partner_id?: string;
  program_id?: string;
  name?: string;
  type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  general?: string;
}

// ============================================================================
// Filter & Search Types
// ============================================================================

/**
 * Filter state for campaign list
 */
export interface CampaignManagementFilters {
  /** Search query for campaign name */
  search: string;
  /** Selected partner ID filter */
  partner_id?: string;
  /** Selected program ID filter */
  program_id?: string;
  /** Selected status filter */
  status?: CampaignManagementStatus;
}

/**
 * Initial/empty filter state
 */
export const initialCampaignFilters: CampaignManagementFilters = {
  search: "",
  partner_id: undefined,
  program_id: undefined,
  status: undefined,
};

/**
 * Sort configuration
 */
export interface CampaignManagementSort {
  field: "name" | "start_date" | "end_date" | "created_at";
  order: "asc" | "desc";
}

/**
 * Pagination state
 */
export interface CampaignManagementPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Initial pagination state
 */
export const initialCampaignPagination: CampaignManagementPagination = {
  page: 1,
  limit: 25,
  total: 0,
  total_pages: 0,
};

// ============================================================================
// Redux State Types
// ============================================================================

/**
 * Redux state for Campaign Management feature
 */
export interface CampaignManagementState {
  // Wizard state
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

  // Stats
  stats: CampaignManagementStats | null;

  // Loading & error states
  loading: boolean;
  error: string | null;

  // Operation-specific loading states
  loadingList: boolean;
  loadingDetails: boolean;
  loadingStats: boolean;
  submitting: boolean;
}

/**
 * Initial Redux state
 */
export const initialCampaignManagementState: CampaignManagementState = {
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

  // Loading & error states
  loading: false,
  error: null,
  loadingList: false,
  loadingDetails: false,
  loadingStats: false,
  submitting: false,
};

// ============================================================================
// Lookup Types (for dropdowns)
// ============================================================================

/**
 * Partner option for dropdown
 */
export interface PartnerOption {
  id: string;
  name: string;
}

/**
 * Program option for dropdown
 */
export interface ProgramOption {
  id: string;
  name: string;
  partner_id: string;
}

/**
 * Campaign type option for radio group
 */
export interface CampaignTypeOption {
  value: CampaignManagementType;
  label: string;
  description: string;
}

/**
 * Campaign type options
 */
export const campaignTypeOptions: CampaignTypeOption[] = [
  {
    value: "promotional",
    label: "Promotional",
    description: "Limited-time promotions and special offers",
  },
  {
    value: "targeted",
    label: "Targeted",
    description: "Campaigns targeted at specific customer segments",
  },
  {
    value: "seasonal",
    label: "Seasonal",
    description: "Holiday and seasonal campaigns",
  },
];

// ============================================================================
// UI Component Props Types
// ============================================================================

/**
 * Props for CampaignCard component
 */
export interface CampaignCardProps {
  campaign: CampaignManagement;
  onEdit?: (campaign: CampaignManagement) => void;
  onDelete?: (campaignId: string) => void;
  onDuplicate?: (campaign: CampaignManagement) => void;
  onStatusToggle?: (campaignId: string, active: boolean) => void;
  onViewDetails?: (campaignId: string) => void;
}

/**
 * Props for CampaignStatusBadge component
 */
export interface CampaignStatusBadgeProps {
  status: CampaignManagementStatus;
  className?: string;
}

/**
 * Props for CampaignFilters component
 */
export interface CampaignFiltersProps {
  filters: CampaignManagementFilters;
  partners: PartnerOption[];
  programs: ProgramOption[];
  onFilterChange: (filters: CampaignManagementFilters) => void;
  onClearFilters: () => void;
}

/**
 * Props for CampaignStats component
 */
export interface CampaignStatsProps {
  stats: CampaignManagementStats;
  loading?: boolean;
}

/**
 * Props for ConfirmActionDialog component
 */
export interface ConfirmActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

/**
 * Props for wizard step components
 */
export interface CampaignWizardStepProps {
  formData: CampaignManagementFormData;
  formErrors: CampaignManagementFormErrors;
  onFormDataChange: (data: Partial<CampaignManagementFormData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onCancel?: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Date range for filtering
 */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Campaign action types
 */
export type CampaignAction =
  | "edit"
  | "delete"
  | "duplicate"
  | "activate"
  | "deactivate";

/**
 * Toast notification types for campaigns
 */
export interface CampaignToastMessages {
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  activateSuccess: string;
  deactivateSuccess: string;
  createError: string;
  updateError: string;
  deleteError: string;
  nameExistsError: string;
  invalidDateError: string;
}

/**
 * Default toast messages
 */
export const defaultCampaignToastMessages: CampaignToastMessages = {
  createSuccess: "Campaign created successfully",
  updateSuccess: "Campaign updated successfully",
  deleteSuccess: "Campaign deleted successfully",
  activateSuccess: "Campaign activated",
  deactivateSuccess: "Campaign deactivated",
  createError: "Failed to create campaign",
  updateError: "Failed to update campaign",
  deleteError: "Failed to delete campaign",
  nameExistsError: "Campaign name already exists in this program",
  invalidDateError: "Invalid date range",
};

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if value is a valid campaign status
 */
export function isCampaignStatus(
  value: any
): value is CampaignManagementStatus {
  return ["draft", "scheduled", "active", "paused", "ended"].includes(value);
}

/**
 * Type guard to check if value is a valid campaign type
 */
export function isCampaignType(value: any): value is CampaignManagementType {
  return ["promotional", "targeted", "seasonal"].includes(value);
}

/**
 * Type guard to check if value is a valid wizard step
 */
export function isWizardStep(
  value: any
): value is CampaignManagementWizardStep {
  return ["basic", "configuration", "review"].includes(value);
}
