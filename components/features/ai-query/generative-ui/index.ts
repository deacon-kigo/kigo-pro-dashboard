/**
 * Generative UI Components
 *
 * Export all generative UI components that can be dynamically rendered
 * based on user prompts and AI responses
 */

export { default as CampaignBuilderUI } from "./CampaignBuilderUI";
export { default as AnalyticsDashboardUI } from "./AnalyticsDashboardUI";
export { default as CustomerInsightsUI } from "./CustomerInsightsUI";

// Type definitions for generative UI
export interface GenerativeUIComponent {
  type: "campaign-builder" | "analytics-dashboard" | "customer-insights";
  props: Record<string, any>;
}

export interface GenerativeUIResponse {
  message: string;
  ui?: GenerativeUIComponent;
}
