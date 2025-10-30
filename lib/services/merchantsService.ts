import {
  Merchant,
  CreateMerchantInput,
  UpdateMerchantInput,
  CreateLocationInput,
  BulkLocationUpload,
  MerchantListParams,
  MerchantListResponse,
  MerchantLocation,
  LocationClosureReport,
  MerchantApiError,
} from "@/types/merchants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const MERCHANTS_ENDPOINT = "/dashboard/merchants";

type ApiResponse<T> = {
  data: T | null;
  error: MerchantApiError | null;
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

function buildQueryString(params: MerchantListParams): string {
  const query = new URLSearchParams();
  for (const key in params) {
    const value = params[key as keyof MerchantListParams];
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

export const merchantsService = {
  /**
   * Fetches a list of merchants with optional filtering, sorting, and pagination.
   */
  async listMerchants(
    params: MerchantListParams = {}
  ): Promise<ApiResponse<MerchantListResponse>> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}${queryString ? `?${queryString}` : ""}`;
    return fetchApi<MerchantListResponse>(url);
  },

  /**
   * Fetches a single merchant by its ID.
   */
  async getMerchantById(id: string): Promise<ApiResponse<Merchant>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${id}`;
    return fetchApi<Merchant>(url);
  },

  /**
   * Creates a new merchant.
   */
  async createMerchant(
    merchantData: CreateMerchantInput
  ): Promise<ApiResponse<Merchant>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}`;
    return fetchApi<Merchant>(url, {
      method: "POST",
      body: JSON.stringify(merchantData),
    });
  },

  /**
   * Updates an existing merchant.
   */
  async updateMerchant(
    id: string,
    merchantData: UpdateMerchantInput
  ): Promise<ApiResponse<Merchant>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${id}`;
    return fetchApi<Merchant>(url, {
      method: "PATCH",
      body: JSON.stringify(merchantData),
    });
  },

  /**
   * Deletes a merchant by its ID.
   */
  async deleteMerchant(id: string): Promise<ApiResponse<{}>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${id}`;
    return fetchApi<{}>(url, {
      method: "DELETE",
    });
  },

  /**
   * Fetches all locations for a specific merchant.
   */
  async getMerchantLocations(
    merchantId: string
  ): Promise<ApiResponse<MerchantLocation[]>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${merchantId}/locations`;
    return fetchApi<MerchantLocation[]>(url);
  },

  /**
   * Adds a single location to a merchant.
   */
  async addLocation(
    locationData: CreateLocationInput
  ): Promise<ApiResponse<MerchantLocation>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${locationData.merchant_id}/locations`;
    return fetchApi<MerchantLocation>(url, {
      method: "POST",
      body: JSON.stringify(locationData),
    });
  },

  /**
   * Bulk uploads multiple locations for a merchant.
   */
  async bulkUploadLocations(
    uploadData: BulkLocationUpload
  ): Promise<
    ApiResponse<{ created: number; duplicates: number; errors: any[] }>
  > {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${uploadData.merchant_id}/locations/bulk`;
    return fetchApi<{ created: number; duplicates: number; errors: any[] }>(
      url,
      {
        method: "POST",
        body: JSON.stringify(uploadData),
      }
    );
  },

  /**
   * Updates a specific location.
   */
  async updateLocation(
    merchantId: string,
    locationId: string,
    locationData: Partial<CreateLocationInput>
  ): Promise<ApiResponse<MerchantLocation>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${merchantId}/locations/${locationId}`;
    return fetchApi<MerchantLocation>(url, {
      method: "PATCH",
      body: JSON.stringify(locationData),
    });
  },

  /**
   * Deletes a specific location.
   */
  async deleteLocation(
    merchantId: string,
    locationId: string
  ): Promise<ApiResponse<{}>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${merchantId}/locations/${locationId}`;
    return fetchApi<{}>(url, {
      method: "DELETE",
    });
  },

  /**
   * Triggers closure detection for a merchant's locations.
   */
  async detectClosures(
    merchantId: string
  ): Promise<ApiResponse<LocationClosureReport>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${merchantId}/detect-closures`;
    return fetchApi<LocationClosureReport>(url, {
      method: "POST",
    });
  },

  /**
   * Auto-suggests merchant data from Google (URL, highlights, etc.).
   */
  async autoSuggestMerchantData(
    merchantName: string
  ): Promise<
    ApiResponse<{ url?: string; highlights?: string; logo_url?: string }>
  > {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/auto-suggest`;
    return fetchApi<{ url?: string; highlights?: string; logo_url?: string }>(
      url,
      {
        method: "POST",
        body: JSON.stringify({ merchant_name: merchantName }),
      }
    );
  },

  /**
   * Duplicates an existing merchant.
   */
  async duplicateMerchant(id: string): Promise<ApiResponse<Merchant>> {
    const url = `${API_BASE_URL}${MERCHANTS_ENDPOINT}/${id}/duplicate`;
    return fetchApi<Merchant>(url, {
      method: "POST",
    });
  },
};
