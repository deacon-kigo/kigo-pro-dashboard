import { DateTime } from "luxon";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "ended";
export type CampaignType =
  | "activation_link" // Partner-branded shareable URLs
  | "hub_airdrop" // Direct delivery to Kigo Hub wallets
  | "marketplace_promoted" // Paid promotion on Kigo Marketplace
  | "marketplace_organic"; // Natural discovery on Kigo Marketplace

export type ProgramType = "closed_loop" | "open_loop"; // John Deere vs Yardi
export type TargetingMethod =
  | "customer_list_upload" // CSV/Excel with customer IDs
  | "engagement_based" // App usage, loyalty activity
  | "redemption_based" // Past redemption behavior
  | "combined"; // Blend of multiple methods

export interface CampaignTargeting {
  partner_ids?: string[]; // Which programs will receive offers
  geographic_scope?: string[]; // Regions, states, cities
  targeting_method: TargetingMethod;
  customer_list_file?: string; // S3 URL for uploaded CSV
  customer_ids?: string[]; // Direct list of customer IDs
  audience_segment_ids?: string[]; // Pre-defined segments
}

export interface CampaignSchedule {
  start_date: DateTime;
  end_date: DateTime;
  timezone: string;
  seasonal_considerations?: string;
}

export interface DeliveryChannel {
  campaign_type: CampaignType;
  landing_page_url?: string; // For activation campaigns
  tracking_parameters?: Record<string, string>;
  promotion_budget?: number; // For marketplace_promoted
  bid_strategy?: string; // For marketplace_promoted
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  program_type: ProgramType;
  offer_id: string; // Link to offer
  merchant_id?: string; // Optional direct merchant link
  targeting: CampaignTargeting;
  schedule: CampaignSchedule;
  delivery_channels: DeliveryChannel[];
  performance_projections?: {
    expected_reach?: number;
    expected_engagement?: number;
    expected_redemption_rate?: number;
  };
  budget_impact?: {
    total_discount_liability?: number;
    operational_costs?: number;
  };
  created_by: string;
  approved_by?: string;
  approved_at?: DateTime;
  deployed_at?: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  program_type: ProgramType;
  offer_id: string;
  merchant_id?: string;
  targeting: CampaignTargeting;
  schedule: CampaignSchedule;
  delivery_channels: DeliveryChannel[];
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  status?: CampaignStatus;
}

export interface CampaignListParams {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
  status?: CampaignStatus;
  program_type?: ProgramType;
  offer_id?: string;
  merchant_id?: string;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
  limit: number;
  offset: number;
}

export interface CampaignPerformance {
  campaign_id: string;
  reach: number; // Total users reached
  impressions: number; // Times offer was viewed
  clicks: number; // Times offer was clicked
  activations: number; // Times offer was activated/saved
  redemptions: number; // Times offer was redeemed
  revenue_impact: number; // Total revenue generated
  discount_given: number; // Total discounts given
  redemption_rate: number; // redemptions / activations
  conversion_rate: number; // activations / impressions
  roi: number; // (revenue - discount) / operational_cost
}

export interface CampaignApiError {
  message: string;
  statusCode: number;
  details?: any;
}
