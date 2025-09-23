/**
 * Generative UI Components
 *
 * Export all generative UI components that can be dynamically rendered
 * based on user prompts and AI responses
 */

export { default as CampaignBuilderUI } from "./CampaignBuilderUI";
export { default as AnalyticsDashboardUI } from "./AnalyticsDashboardUI";
export { default as CustomerInsightsUI } from "./CustomerInsightsUI";
export { default as JourneyDiscoveryUI } from "./JourneyDiscoveryUI";
export { default as PatternAnalysisUI } from "./PatternAnalysisUI";
export { default as CampaignArchitectureUI } from "./CampaignArchitectureUI";
export { default as LightningStrategyUI } from "./LightningStrategyUI";
export { default as CampaignLaunchUI } from "./CampaignLaunchUI";

// Type definitions for generative UI
export interface GenerativeUIComponent {
  type:
    | "campaign-builder"
    | "analytics-dashboard"
    | "customer-insights"
    | "journey-discovery"
    | "pattern-analysis"
    | "campaign-architecture"
    | "lightning-strategy"
    | "campaign-launch";
  props: Record<string, any>;
}

export interface GenerativeUIResponse {
  message: string;
  ui?: GenerativeUIComponent;
}
