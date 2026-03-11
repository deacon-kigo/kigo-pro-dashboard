import { LandingPageConfig } from "@/types/tmt-campaign";
import { authService } from "./tmtAuthService";

const KIGO_BASE_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

// Backend API request body structure
interface TMTCampaignRequest {
  campaign_name: string;
  google_tag_manager_id: string;
  affiliate_slug: string;
  is_active: boolean;
  end_campaign_date: string;
  configuration: Omit<
    LandingPageConfig,
    | "campaignName"
    | "googleTagManagerId"
    | "affiliateSlug"
    | "isActive"
    | "endCampaignDate"
  >;
}

// Backend API response structure
interface TMTCampaignResponse {
  id: string;
  campaign_name: string;
  google_tag_manager_id: string;
  affiliate_slug: string;
  is_active: boolean;
  end_campaign_date: string;
  configuration: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

class ApiService {
  private kigoBaseUrl: string;

  constructor(kigoBaseUrl: string) {
    this.kigoBaseUrl = kigoBaseUrl;
  }

  // Encode configuration to Base64 to bypass WAF HTML filtering
  private encodeConfiguration(config: Record<string, unknown>): string {
    return btoa(encodeURIComponent(JSON.stringify(config)));
  }

  // Decode configuration from Base64
  private decodeConfiguration(encoded: string): Record<string, unknown> {
    try {
      return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch {
      // If decoding fails, assume it's already a plain object (backwards compatibility)
      return encoded as unknown as Record<string, unknown>;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = authService.getAccessToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  private async kigoRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.kigoBaseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    // Handle 401 - try to refresh token
    if (response.status === 401) {
      const newToken = await authService.refreshAccessToken();
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({}));
          throw new Error(
            error.message || `HTTP error! status: ${retryResponse.status}`
          );
        }
        return retryResponse.json();
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Transform frontend config to backend request format
  private toBackendFormat(config: LandingPageConfig): TMTCampaignRequest {
    const {
      campaignName,
      googleTagManagerId,
      affiliateSlug,
      isActive,
      endCampaignDate,
      ...configuration
    } = config;

    // Ensure date is in ISO format with timezone
    let formattedDate = endCampaignDate;
    if (endCampaignDate && !endCampaignDate.endsWith("Z")) {
      formattedDate = new Date(endCampaignDate).toISOString();
    }

    return {
      campaign_name: campaignName,
      google_tag_manager_id: googleTagManagerId,
      affiliate_slug: affiliateSlug,
      is_active: isActive,
      end_campaign_date: formattedDate,
      // Encode configuration as Base64 to bypass WAF HTML filtering
      configuration: this.encodeConfiguration(
        configuration
      ) as unknown as TMTCampaignRequest["configuration"],
    };
  }

  // Convert ISO date string to datetime-local format (YYYY-MM-DDTHH:MM)
  private toDatetimeLocalFormat(isoDate: string): string {
    if (!isoDate) {
      return "";
    }
    try {
      const date = new Date(isoDate);
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return isoDate;
    }
  }

  // Transform backend response to frontend config format
  private toFrontendFormat(response: TMTCampaignResponse): LandingPageConfig {
    // Decode configuration from Base64 if it's a string, otherwise use as-is (backwards compatibility)
    const configuration =
      typeof response.configuration === "string"
        ? this.decodeConfiguration(response.configuration)
        : response.configuration;

    return {
      id: response.id,
      campaignName: response.campaign_name,
      googleTagManagerId: response.google_tag_manager_id,
      affiliateSlug: response.affiliate_slug,
      isActive: response.is_active,
      endCampaignDate: this.toDatetimeLocalFormat(response.end_campaign_date),
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      ...(configuration as Omit<
        LandingPageConfig,
        | "id"
        | "campaignName"
        | "googleTagManagerId"
        | "affiliateSlug"
        | "isActive"
        | "endCampaignDate"
        | "createdAt"
        | "updatedAt"
      >),
    };
  }

  // Get all campaigns from backend
  async getAllCampaigns(): Promise<LandingPageConfig[]> {
    const response = await this.kigoRequest<{
      campaigns: TMTCampaignResponse[];
      total_count: number;
    }>("/dashboard/tmt-campaigns");
    return response.campaigns.map((campaign) =>
      this.toFrontendFormat(campaign)
    );
  }

  // Get campaign by ID from backend
  async getCampaignById(id: string): Promise<LandingPageConfig> {
    const response = await this.kigoRequest<TMTCampaignResponse>(
      `/dashboard/tmt-campaigns/${id}`
    );
    return this.toFrontendFormat(response);
  }

  // Get campaign by slug from backend (public endpoint, no auth required)
  async getCampaignBySlug(slug: string): Promise<LandingPageConfig | null> {
    try {
      const response = await fetch(
        `${this.kigoBaseUrl}/tmt-campaigns/${slug}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as TMTCampaignResponse;
      return this.toFrontendFormat(data);
    } catch {
      return null;
    }
  }

  // Create new campaign
  async createCampaign(config: LandingPageConfig): Promise<LandingPageConfig> {
    const backendPayload = this.toBackendFormat(config);
    const response = await this.kigoRequest<TMTCampaignResponse>(
      "/dashboard/tmt-campaigns",
      {
        method: "POST",
        body: JSON.stringify(backendPayload),
      }
    );
    return this.toFrontendFormat(response);
  }

  // Update existing campaign
  async updateCampaign(
    id: string,
    config: LandingPageConfig
  ): Promise<LandingPageConfig> {
    const backendPayload = this.toBackendFormat(config);
    const response = await this.kigoRequest<TMTCampaignResponse>(
      `/dashboard/tmt-campaigns/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(backendPayload),
      }
    );
    return this.toFrontendFormat(response);
  }

  // Delete campaign
  async deleteCampaign(id: string): Promise<void> {
    await this.kigoRequest<void>(`/dashboard/tmt-campaigns/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== Campaign Codes ====================

  // Get campaign codes count
  async getCampaignCodesCount(
    campaignId: string
  ): Promise<{ total_count: number }> {
    return this.kigoRequest<{ total_count: number }>(
      `/dashboard/tmt-campaigns/${campaignId}/codes`
    );
  }

  // Get used codes count
  async getUsedCodesCount(
    campaignId: string
  ): Promise<{ total_count: number }> {
    return this.kigoRequest<{ total_count: number }>(
      `/dashboard/tmt-campaigns/${campaignId}/codes/used-count`
    );
  }

  // Export campaign codes as CSV
  async exportCampaignCodesCsv(
    campaignId: string,
    isUsed?: boolean
  ): Promise<Blob> {
    const params = new URLSearchParams();
    if (isUsed !== undefined) {
      params.append("is_used", String(isUsed));
    }
    const queryString = params.toString();
    const url = `${this.kigoBaseUrl}/dashboard/tmt-campaigns/${campaignId}/codes/csv${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.blob();
  }

  // Delete campaign codes
  async deleteCampaignCodes(campaignId: string): Promise<void> {
    await this.kigoRequest<void>(
      `/dashboard/tmt-campaigns/${campaignId}/codes`,
      {
        method: "DELETE",
      }
    );
  }

  // Generate campaign codes
  async generateCampaignCodes(
    campaignId: string,
    numberOfCodes: number,
    prefix?: string,
    suffix?: string
  ): Promise<{ generated_count: number }> {
    const payload: {
      number_of_codes: number;
      prefix?: string;
      suffix?: string;
    } = { number_of_codes: numberOfCodes };

    // Only include prefix/suffix if they have values
    if (prefix) {
      payload.prefix = prefix;
    }
    if (suffix) {
      payload.suffix = suffix;
    }

    return this.kigoRequest<{ generated_count: number }>(
      `/dashboard/tmt-campaigns/${campaignId}/codes`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }

  // Generate test code
  async generateTestCode(
    campaignId: string
  ): Promise<{ code: string; message: string }> {
    return this.kigoRequest<{ code: string; message: string }>(
      `/dashboard/tmt-campaigns/${campaignId}/codes/test`,
      {
        method: "POST",
      }
    );
  }

  // Upload CSV codes
  async uploadCampaignCodesCsv(
    campaignId: string,
    file: File
  ): Promise<{ message: string; job_id?: string }> {
    const url = `${this.kigoBaseUrl}/dashboard/tmt-campaigns/${campaignId}/codes/csv`;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
      },
      body: formData,
    });

    // Handle 401 - try to refresh token
    if (response.status === 401) {
      const newToken = await authService.refreshAccessToken();
      if (newToken) {
        const retryResponse = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          body: formData,
        });
        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({}));
          throw new Error(
            error.message || `HTTP error! status: ${retryResponse.status}`
          );
        }
        return retryResponse.json();
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }
}

export const apiService = new ApiService(KIGO_BASE_URL || "");
