import { DateTime } from "luxon";

export type MerchantStatus = "open" | "closed" | "cancelled"; // P, C, U in legacy
export type MerchantClassification =
  | "local"
  | "national_chain"
  | "regional_chain";
export type MerchantSubClassification = "franchisee" | "all_locations";

export interface MerchantLocation {
  id: string;
  merchant_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_closed: boolean;
  closure_detected_at?: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface Merchant {
  id: string;
  corporation_name: string;
  dba_name: string;
  status: MerchantStatus;
  crm_id?: string; // Salesforce replacement
  merchant_url?: string;
  highlights?: string; // About Us / Description
  classification: MerchantClassification;
  sub_classification?: MerchantSubClassification;
  logo_url?: string;
  image_urls?: string[]; // Multiple images
  primary_image_url?: string;
  terms_and_conditions?: string;
  welcome_email_sent: boolean;
  welcome_email_bounced: boolean;
  locations?: MerchantLocation[];
  created_at: DateTime;
  updated_at: DateTime;
}

export interface CreateMerchantInput {
  corporation_name: string;
  dba_name: string;
  status?: MerchantStatus;
  crm_id?: string;
  merchant_url?: string;
  highlights?: string;
  classification: MerchantClassification;
  sub_classification?: MerchantSubClassification;
  logo_url?: string;
  terms_and_conditions?: string;
}

export interface UpdateMerchantInput extends Partial<CreateMerchantInput> {}

export interface CreateLocationInput {
  merchant_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface BulkLocationUpload {
  merchant_id: string;
  locations: CreateLocationInput[];
  auto_validate: boolean; // Validate addresses via Google/MapQuest
  detect_duplicates: boolean;
}

export interface MerchantListParams {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
  status?: MerchantStatus;
  classification?: MerchantClassification;
}

export interface MerchantListResponse {
  merchants: Merchant[];
  total: number;
  limit: number;
  offset: number;
}

export interface LocationClosureReport {
  merchant_id: string;
  closed_locations: MerchantLocation[];
  is_single_location: boolean;
  recommended_action: "close_merchant" | "remove_locations";
}

export interface MerchantApiError {
  message: string;
  statusCode: number;
  details?: any;
}
