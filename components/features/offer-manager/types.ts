/**
 * Type definitions for Offer Manager feature
 */

export interface OfferStep {
  id: string;
  description: string;
  status: "pending" | "running" | "complete";
  type:
    | "goal_setting"
    | "offer_creation"
    | "campaign_setup"
    | "validation"
    | "approval";
  updates: string[];
  result?: any;
}

export interface OfferManagerState {
  messages?: any[];
  business_objective?: string;
  program_type?: string;
  offer_config?: any;
  campaign_setup?: any;
  workflow_step?: string;
  validation_results?: any[];
  progress_percentage?: number;
  current_phase?: string;

  // Perplexity-style streaming
  steps: OfferStep[];
  answer?: {
    markdown: string;
    offer_config?: any;
    campaign_setup?: any;
    validation_results?: any[];
  };

  // Approval workflow
  pending_action?: any;
  approval_status?: string;
  requires_approval?: boolean;
}
