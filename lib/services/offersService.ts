/**
 * Offers Service
 *
 * Reusable service for interacting with the offers API
 * Provides type-safe methods for all offer-related operations
 *
 * @example
 * ```ts
 * import { offersService } from '@/lib/services/offersService'
 *
 * // Fetch all offers
 * const { offers } = await offersService.listOffers()
 *
 * // Fetch offers with filters
 * const { offers } = await offersService.listOffers({
 *   offer_status: 'published',
 *   merchant_owner: 12345,
 *   limit: 20
 * })
 *
 * // Get single offer
 * const offer = await offersService.getOfferById('offer-id')
 *
 * // Create new offer
 * const newOffer = await offersService.createOffer({
 *   merchant_owner: 12345,
 *   offer_type: 'percentage_savings',
 *   // ...
 * })
 * ```
 */

import type {
  Offer,
  CreateOfferInput,
  UpdateOfferInput,
  OfferListParams,
  OfferListResponse,
  OfferApiError,
} from "@/types/offers";

/**
 * Base API configuration
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const OFFERS_ENDPOINT = "/dashboard/offers";

/**
 * API Response wrapper type
 */
type ApiResponse<T> = {
  data?: T;
  error?: OfferApiError;
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
 * Offers Service
 * Contains all offer-related API methods
 */
export const offersService = {
  /**
   * List offers with optional filtering and pagination
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of offers
   *
   * @example
   * ```ts
   * const { data } = await offersService.listOffers({
   *   offer_status: 'published',
   *   limit: 50,
   *   sort_by: 'created_at',
   *   sort_order: 'desc'
   * })
   * ```
   */
  async listOffers(
    params?: OfferListParams
  ): Promise<ApiResponse<OfferListResponse>> {
    const queryString = params ? buildQueryString(params) : "";
    return fetchApi<OfferListResponse>(`${OFFERS_ENDPOINT}${queryString}`);
  },

  /**
   * Get a single offer by ID
   *
   * @param offerId - The offer ID
   * @returns Single offer details
   *
   * @example
   * ```ts
   * const { data: offer } = await offersService.getOfferById('550e8400-e29b-41d4-a716-446655440000')
   * ```
   */
  async getOfferById(offerId: string): Promise<ApiResponse<Offer>> {
    return fetchApi<Offer>(`${OFFERS_ENDPOINT}/${offerId}`);
  },

  /**
   * Create a new offer
   *
   * @param input - Offer creation payload
   * @returns Created offer
   *
   * @example
   * ```ts
   * const { data: newOffer } = await offersService.createOffer({
   *   version_active_from: new Date().toISOString(),
   *   merchant_owner: 12345,
   *   offer_type: 'percentage_savings',
   *   offer_redemption_methods: ['in_store', 'online'],
   *   code_type: 'S',
   *   offer_status: 'draft'
   * })
   * ```
   */
  async createOffer(input: CreateOfferInput): Promise<ApiResponse<Offer>> {
    return fetchApi<Offer>(OFFERS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /**
   * Update an existing offer
   *
   * @param offerId - The offer ID
   * @param input - Fields to update
   * @returns Updated offer
   *
   * @example
   * ```ts
   * const { data: updatedOffer } = await offersService.updateOffer(
   *   'offer-id',
   *   { offer_status: 'published' }
   * )
   * ```
   */
  async updateOffer(
    offerId: string,
    input: UpdateOfferInput
  ): Promise<ApiResponse<Offer>> {
    return fetchApi<Offer>(`${OFFERS_ENDPOINT}/${offerId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  /**
   * Delete an offer
   *
   * @param offerId - The offer ID
   * @returns Success/error response
   *
   * @example
   * ```ts
   * const { success } = await offersService.deleteOffer('offer-id')
   * ```
   */
  async deleteOffer(offerId: string): Promise<ApiResponse<void>> {
    return fetchApi<void>(`${OFFERS_ENDPOINT}/${offerId}`, {
      method: "DELETE",
    });
  },

  /**
   * Export offers to CSV
   *
   * @param params - Optional filters for export
   * @returns CSV file blob
   *
   * @example
   * ```ts
   * const { data: csvBlob } = await offersService.exportOffersCSV({
   *   offer_status: 'published'
   * })
   * ```
   */
  async exportOffersCSV(params?: OfferListParams): Promise<ApiResponse<Blob>> {
    const queryString = params ? buildQueryString(params) : "";

    try {
      const url = `${API_BASE_URL}${OFFERS_ENDPOINT}/csv${queryString}`;
      const response = await fetch(url);

      if (!response.ok) {
        return {
          success: false,
          error: {
            error: "Export Failed",
            message: "Failed to export offers",
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
   * Duplicate an existing offer
   * Creates a copy with draft status
   *
   * @param offerId - The offer ID to duplicate
   * @returns New duplicated offer
   *
   * @example
   * ```ts
   * const { data: duplicatedOffer } = await offersService.duplicateOffer('offer-id')
   * ```
   */
  async duplicateOffer(offerId: string): Promise<ApiResponse<Offer>> {
    // Note: This endpoint may need to be added to backend
    return fetchApi<Offer>(`${OFFERS_ENDPOINT}/${offerId}/duplicate`, {
      method: "POST",
    });
  },
};

/**
 * Export type-safe service instance
 */
export type OffersService = typeof offersService;
