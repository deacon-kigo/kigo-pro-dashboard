/**
 * Campaign Management Service
 *
 * Reusable service for interacting with the campaign management API
 * Provides type-safe methods for all campaign-related operations
 *
 * Related BRD: documentation/brd/campaign-management.md
 * Related Design: documentation/features/campaign-management-design.md
 *
 * @example
 * ```ts
 * import { campaignManagementService } from '@/lib/services/campaignManagementService'
 *
 * // Fetch all campaigns
 * const { data } = await campaignManagementService.listCampaigns()
 *
 * // Fetch campaigns with filters
 * const { data } = await campaignManagementService.listCampaigns({
 *   status: 'active',
 *   partner_id: 'partner-123',
 *   limit: 25
 * })
 *
 * // Get single campaign
 * const { data: campaign } = await campaignManagementService.getCampaignById('campaign-id')
 *
 * // Create new campaign
 * const { data: newCampaign } = await campaignManagementService.createCampaign({
 *   partner_id: 'partner-123',
 *   program_id: 'program-456',
 *   name: 'Summer Savings 2025',
 *   type: 'promotional',
 *   // ...
 * })
 * ```
 */

import type {
  CampaignManagement,
  CreateCampaignManagementInput,
  UpdateCampaignManagementInput,
  CampaignManagementListParams,
  CampaignManagementListResponse,
  CampaignManagementStats,
  CampaignNameCheckResponse,
} from "@/types/campaign-management";

/**
 * API Error type
 */
export interface CampaignApiError {
  error: string;
  message: string;
  status: number;
  details?: any;
}

/**
 * Base API configuration
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const CAMPAIGNS_ENDPOINT = "/api/v1/campaign-management";

/**
 * API Response wrapper type
 */
type ApiResponse<T> = {
  data?: T;
  error?: CampaignApiError;
  success: boolean;
};

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));

      return {
        success: false,
        error: {
          error: "API Error",
          message: errorData.message || "An error occurred",
          status: response.status,
          details: errorData,
        },
      };
    }

    // Parse successful response
    const data = await response.json();

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    // Handle network errors
    return {
      success: false,
      error: {
        error: "Network Error",
        message:
          error instanceof Error ? error.message : "Network request failed",
        status: 0,
      },
    };
  }
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Campaign Management Service
 * Contains all campaign-related API methods
 */
export const campaignManagementService = {
  /**
   * List campaigns with optional filtering and pagination
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of campaigns
   *
   * @example
   * ```ts
   * const { data } = await campaignManagementService.listCampaigns({
   *   status: 'active',
   *   partner_id: 'partner-123',
   *   limit: 25,
   *   sort_by: 'start_date',
   *   sort_order: 'desc'
   * })
   * ```
   */
  async listCampaigns(
    params?: CampaignManagementListParams
  ): Promise<ApiResponse<CampaignManagementListResponse>> {
    const queryString = params ? buildQueryString(params) : "";
    return fetchApi<CampaignManagementListResponse>(
      `${CAMPAIGNS_ENDPOINT}${queryString}`
    );
  },

  /**
   * Get a single campaign by ID
   *
   * @param campaignId - The campaign ID
   * @returns Single campaign details
   *
   * @example
   * ```ts
   * const { data: campaign } = await campaignManagementService.getCampaignById('campaign-123')
   * ```
   */
  async getCampaignById(
    campaignId: string
  ): Promise<ApiResponse<CampaignManagement>> {
    return fetchApi<CampaignManagement>(`${CAMPAIGNS_ENDPOINT}/${campaignId}`);
  },

  /**
   * Create a new campaign
   *
   * @param input - Campaign creation payload
   * @returns Created campaign
   *
   * @example
   * ```ts
   * const { data: newCampaign } = await campaignManagementService.createCampaign({
   *   partner_id: 'partner-123',
   *   program_id: 'program-456',
   *   name: 'Summer Savings 2025',
   *   type: 'promotional',
   *   description: 'Limited time summer promotion',
   *   start_date: '2025-06-01T00:00:00Z',
   *   end_date: '2025-08-31T23:59:59Z',
   *   active: false,
   *   auto_activate: true,
   *   auto_deactivate: true
   * })
   * ```
   */
  async createCampaign(
    input: CreateCampaignManagementInput
  ): Promise<ApiResponse<CampaignManagement>> {
    return fetchApi<CampaignManagement>(CAMPAIGNS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /**
   * Update an existing campaign
   * Note: partner_id and program_id cannot be changed after creation
   *
   * @param campaignId - The campaign ID
   * @param input - Fields to update
   * @returns Updated campaign
   *
   * @example
   * ```ts
   * const { data: updatedCampaign } = await campaignManagementService.updateCampaign(
   *   'campaign-123',
   *   {
   *     name: 'Updated Campaign Name',
   *     active: true
   *   }
   * )
   * ```
   */
  async updateCampaign(
    campaignId: string,
    input: UpdateCampaignManagementInput
  ): Promise<ApiResponse<CampaignManagement>> {
    return fetchApi<CampaignManagement>(`${CAMPAIGNS_ENDPOINT}/${campaignId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  /**
   * Delete a campaign
   *
   * @param campaignId - The campaign ID
   * @returns Success/error response
   *
   * @example
   * ```ts
   * const { success } = await campaignManagementService.deleteCampaign('campaign-123')
   * if (success) {
   *   console.log('Campaign deleted successfully')
   * }
   * ```
   */
  async deleteCampaign(campaignId: string): Promise<ApiResponse<void>> {
    return fetchApi<void>(`${CAMPAIGNS_ENDPOINT}/${campaignId}`, {
      method: "DELETE",
    });
  },

  /**
   * Get campaign statistics for dashboard
   *
   * @returns Campaign counts by status
   *
   * @example
   * ```ts
   * const { data: stats } = await campaignManagementService.getCampaignStats()
   * console.log(`Active campaigns: ${stats.active}`)
   * ```
   */
  async getCampaignStats(): Promise<ApiResponse<CampaignManagementStats>> {
    return fetchApi<CampaignManagementStats>(`${CAMPAIGNS_ENDPOINT}/stats`);
  },

  /**
   * Check if campaign name is unique within a program
   * Used for form validation
   *
   * @param programId - The program ID
   * @param name - The campaign name to check
   * @param excludeId - Optional campaign ID to exclude (for edit mode)
   * @returns Whether the name is unique
   *
   * @example
   * ```ts
   * const { data } = await campaignManagementService.checkNameUnique(
   *   'program-456',
   *   'Summer Savings 2025'
   * )
   * if (!data?.unique) {
   *   console.error('Campaign name already exists')
   * }
   * ```
   */
  async checkNameUnique(
    programId: string,
    name: string,
    excludeId?: string
  ): Promise<ApiResponse<CampaignNameCheckResponse>> {
    const params: Record<string, string> = {
      program_id: programId,
      name,
    };
    if (excludeId) {
      params.exclude_id = excludeId;
    }

    const queryString = buildQueryString(params);
    return fetchApi<CampaignNameCheckResponse>(
      `${CAMPAIGNS_ENDPOINT}/check-name${queryString}`
    );
  },

  /**
   * Export campaigns to CSV
   * Respects current filters
   *
   * @param params - Optional filters for export
   * @returns CSV file blob
   *
   * @example
   * ```ts
   * const { data: csvBlob } = await campaignManagementService.exportCampaignsCSV({
   *   status: 'active',
   *   partner_id: 'partner-123'
   * })
   * if (csvBlob) {
   *   const url = URL.createObjectURL(csvBlob)
   *   const link = document.createElement('a')
   *   link.href = url
   *   link.download = 'campaigns.csv'
   *   link.click()
   * }
   * ```
   */
  async exportCampaignsCSV(
    params?: CampaignManagementListParams
  ): Promise<ApiResponse<Blob>> {
    const queryString = params ? buildQueryString(params) : "";

    try {
      const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/export${queryString}`;
      const response = await fetch(url);

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: "Export Failed",
            message: "Failed to export campaigns",
            status: response.status,
          },
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          error: "Export Error",
          message: error instanceof Error ? error.message : "Export failed",
          status: 0,
        },
      };
    }
  },

  /**
   * Duplicate an existing campaign
   * Creates a copy with draft status and appends "(Copy)" to name
   *
   * @param campaignId - The campaign ID to duplicate
   * @returns New duplicated campaign
   *
   * @example
   * ```ts
   * const { data: duplicatedCampaign } = await campaignManagementService.duplicateCampaign('campaign-123')
   * // Returns campaign with name "Original Campaign Name (Copy)"
   * ```
   */
  async duplicateCampaign(
    campaignId: string
  ): Promise<ApiResponse<CampaignManagement>> {
    return fetchApi<CampaignManagement>(
      `${CAMPAIGNS_ENDPOINT}/${campaignId}/duplicate`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Toggle campaign active status
   * Shows confirmation before activating/deactivating
   *
   * @param campaignId - The campaign ID
   * @param active - New active status
   * @returns Updated campaign
   *
   * @example
   * ```ts
   * // Activate campaign
   * const { data } = await campaignManagementService.toggleCampaignStatus('campaign-123', true)
   *
   * // Deactivate campaign
   * const { data } = await campaignManagementService.toggleCampaignStatus('campaign-123', false)
   * ```
   */
  async toggleCampaignStatus(
    campaignId: string,
    active: boolean
  ): Promise<ApiResponse<CampaignManagement>> {
    return this.updateCampaign(campaignId, { active });
  },
};

/**
 * Export type-safe service instance
 */
export type CampaignManagementService = typeof campaignManagementService;
