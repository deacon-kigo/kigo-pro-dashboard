import {
  Campaign,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignListParams,
  CampaignListResponse,
  CampaignPerformance,
  CampaignApiError,
} from "@/types/campaigns";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const CAMPAIGNS_ENDPOINT = "/dashboard/campaigns";

type ApiResponse<T> = {
  data: T | null;
  error: CampaignApiError | null;
};

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          message: errorData.message || "An unknown error occurred",
          statusCode: response.status,
          details: errorData.details,
        },
      };
    }

    const data: T = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Network error",
        statusCode: 0,
      },
    };
  }
}

function buildQueryString(params: CampaignListParams): string {
  const query = new URLSearchParams();
  for (const key in params) {
    const value = params[key as keyof CampaignListParams];
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, String(item)));
      } else {
        query.append(key, String(value));
      }
    }
  }
  return query.toString();
}

export const campaignsService = {
  /**
   * Fetches a list of campaigns with optional filtering, sorting, and pagination.
   */
  async listCampaigns(
    params: CampaignListParams = {}
  ): Promise<ApiResponse<CampaignListResponse>> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}${queryString ? `?${queryString}` : ""}`;
    return fetchApi<CampaignListResponse>(url);
  },

  /**
   * Fetches a single campaign by its ID.
   */
  async getCampaignById(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}`;
    return fetchApi<Campaign>(url);
  },

  /**
   * Creates a new campaign.
   */
  async createCampaign(
    campaignData: CreateCampaignInput
  ): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}`;
    return fetchApi<Campaign>(url, {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
  },

  /**
   * Updates an existing campaign.
   */
  async updateCampaign(
    id: string,
    campaignData: UpdateCampaignInput
  ): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}`;
    return fetchApi<Campaign>(url, {
      method: "PATCH",
      body: JSON.stringify(campaignData),
    });
  },

  /**
   * Deletes a campaign by its ID.
   */
  async deleteCampaign(id: string): Promise<ApiResponse<{}>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}`;
    return fetchApi<{}>(url, {
      method: "DELETE",
    });
  },

  /**
   * Publishes a draft campaign (makes it active).
   */
  async publishCampaign(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/publish`;
    return fetchApi<Campaign>(url, {
      method: "POST",
    });
  },

  /**
   * Starts a scheduled campaign immediately.
   */
  async startCampaign(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/start`;
    return fetchApi<Campaign>(url, {
      method: "POST",
    });
  },

  /**
   * Pauses an active campaign (can be reactivated).
   */
  async pauseCampaign(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/pause`;
    return fetchApi<Campaign>(url, {
      method: "POST",
    });
  },

  /**
   * Ends a campaign permanently (cannot be reactivated).
   */
  async endCampaign(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/end`;
    return fetchApi<Campaign>(url, {
      method: "POST",
    });
  },

  /**
   * Fetches performance metrics for a campaign.
   */
  async getCampaignPerformance(
    id: string
  ): Promise<ApiResponse<CampaignPerformance>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/performance`;
    return fetchApi<CampaignPerformance>(url);
  },

  /**
   * Duplicates an existing campaign.
   */
  async duplicateCampaign(id: string): Promise<ApiResponse<Campaign>> {
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/${id}/duplicate`;
    return fetchApi<Campaign>(url, {
      method: "POST",
    });
  },

  /**
   * Exports campaigns to a CSV file.
   */
  async exportCampaignsCSV(
    params: CampaignListParams = {}
  ): Promise<ApiResponse<string>> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${CAMPAIGNS_ENDPOINT}/csv${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          message: errorData.message || "Failed to export CSV",
          statusCode: response.status,
          details: errorData.details,
        },
      };
    }
    const csvData = await response.text();
    return { data: csvData, error: null };
  },
};
