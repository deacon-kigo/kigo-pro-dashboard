// LangGraph Agents Module
// This module provides the main exports for our LangGraph multi-agent system

export { createSupervisorWorkflow } from "./supervisor";
export { adCreationAgent } from "./ad-creation";
export type { KigoProAgentState } from "./supervisor";

// Agent utilities and types
export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  nextSteps?: string[];
}

export interface AgentContext {
  currentPage: string;
  userRole: string;
  campaignData?: any;
  sessionId: string;
}

// Agent names for routing
export const AGENT_TYPES = {
  SUPERVISOR: "supervisor",
  AD_CREATION: "ad_creation_agent",
  FILTER_AGENT: "filter_agent",
  ANALYTICS_AGENT: "analytics_agent",
  MERCHANT_AGENT: "merchant_agent",
  GENERAL_ASSISTANT: "general_assistant",
  ERROR_HANDLER: "error_handler",
} as const;

export type AgentType = (typeof AGENT_TYPES)[keyof typeof AGENT_TYPES];
