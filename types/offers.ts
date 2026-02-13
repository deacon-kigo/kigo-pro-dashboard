/**
 * Offer Types and Interfaces
 *
 * Based on kigo-core-server production API schema
 * Aligned with Rust models from kigo-libs/kigo-models
 */

/**
 * Offer Status Enum
 */
export type OfferStatus =
  | "draft"
  | "published"
  | "archived"
  | "expired"
  | "paused"
  | "pending_approval";

/**
 * Redemption Type Enum
 * How the offer is technically delivered/redeemed
 */
export type RedemptionType =
  | "online_code"
  | "airdrop"
  | "gift_card"
  | "card_linked"
  | "stripe_checkout"
  | "augeo_fulfillment"
  | "sms_notification";

/**
 * Offer Type Enum
 * Supported promotional offer types in production
 */
export type OfferType =
  | "bogo" // Buy One Get One
  | "percentage_savings" // X% off
  | "dollars_off" // $X off
  | "cashback" // Cash back rewards
  | "free_with_purchase" // Free item with purchase
  | "price_point" // Fixed price offer
  | "clickthrough" // Online redirect offers
  | "loyalty_points" // Loyalty points (future)
  | "spend_and_get"; // Spend & Get (future)

/**
 * Redemption Method Enum
 * How customers can redeem the offer
 */
export type OfferRedemptionMethod =
  | "in_store" // In-person redemption
  | "print" // Printable voucher
  | "online" // Online redemption
  | "promo_code" // Promo code entry
  | "show_and_save" // QR/barcode display
  | "barcode_scan" // Barcode scanning
  | "online_link"; // Direct link with discount applied

/**
 * Program Type (for context awareness)
 */
export type ProgramType = "john_deere" | "yardi" | "general";

/**
 * Core Offer Interface
 * Represents an offer in the system
 */
export interface Offer {
  id: string;
  version_active_from: string; // ISO 8601 datetime
  merchant_owner: number;
  default_language?: string;
  external_reference?: string;
  offer_expiry_date?: string; // ISO 8601 datetime
  offer_status: OfferStatus;
  offer_type: OfferType;
  offer_redemption_methods: OfferRedemptionMethod[];
  edition_exclusivity?: string[];
  code_type: "S" | "M"; // Single or Multiple codes
  clickthru_url?: string;
  classification?: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime

  // Display fields (may come from translations/metadata)
  title?: string;
  description?: string;
  terms_and_conditions?: string;
  value?: string; // e.g., "20%", "$10", "BOGO"
}

/**
 * Create Offer Input
 * Payload for creating a new offer
 */
export interface CreateOfferInput {
  version_active_from: string;
  merchant_owner: number;
  default_language?: string;
  external_reference?: string;
  offer_expiry_date?: string;
  offer_status?: OfferStatus;
  offer_type: OfferType;
  offer_redemption_methods: OfferRedemptionMethod[];
  edition_exclusivity?: string[];
  code_type: "S" | "M";
  clickthru_url?: string;
  classification?: string;
}

/**
 * Update Offer Input
 * Payload for updating an existing offer
 */
export interface UpdateOfferInput {
  offer_status?: OfferStatus;
  offer_expiry_date?: string;
  offer_redemption_methods?: OfferRedemptionMethod[];
  clickthru_url?: string;
  classification?: string;
}

/**
 * Offer List Query Parameters
 * Filters for fetching offers
 */
export interface OfferListParams {
  merchant_owner?: number;
  offer_status?: OfferStatus;
  offer_type?: OfferType;
  edition_exclusivity?: string;
  limit?: number;
  offset?: number;
  sort_by?: "created_at" | "updated_at" | "offer_expiry_date";
  sort_order?: "asc" | "desc";
}

/**
 * Offer List Response
 * Paginated response for offers
 */
export interface OfferListResponse {
  offers: Offer[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

/**
 * Offer API Error Response
 */
export interface OfferApiError {
  error: string;
  message: string;
  status: number;
  details?: any;
}

/**
 * Offer Selection State
 * For wizard step where user selects/creates offer
 */
export interface OfferSelectionState {
  mode: "select" | "create"; // Select existing or create new
  selectedOffer?: Offer;
  isLoading: boolean;
  error?: string;
}
