import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SYSTEM_PROMPTS } from "@/services/ai";
import {
  CampaignBasicInfo,
  CampaignTargeting,
  CampaignDistribution,
  CampaignBudget,
  CampaignAd,
} from "./campaignSlice";

// Define FilterCriteria type locally if not imported from a shared location
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

export interface AIMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  responseOptions?: Array<{
    text: string;
    value: string;
  }>;
  severity?: "info" | "warning" | "success" | "error";
  contextId?: string | null;
  systemPrompt?: string;
  error?: string | null;
  currentCriteria?: FilterCriteria[];
  campaignContext?: {
    basicInfo?: CampaignBasicInfo;
    targeting?: CampaignTargeting;
    distribution?: CampaignDistribution;
    budget?: CampaignBudget;
    ads?: CampaignAd[];
    currentStep?: string;
    analysisData?: {
      impressionRate?: number;
      conversionRate?: number;
      recommendedBudget?: number;
      audienceInsight?: string;
      performancePrediction?: string;
    };
  };
}

interface AIAssistantState {
  messages: AIMessage[];
  isProcessing: boolean;
  contextId: string | null;
  systemPrompt: string;
  error: string | null;
  currentCriteria: FilterCriteria[];
  campaignContext?: {
    basicInfo?: CampaignBasicInfo;
    targeting?: CampaignTargeting;
    distribution?: CampaignDistribution;
    budget?: CampaignBudget;
    ads?: CampaignAd[];
    currentStep?: string;
    analysisData?: {
      impressionRate?: number;
      conversionRate?: number;
      recommendedBudget?: number;
      audienceInsight?: string;
      performancePrediction?: string;
    };
  };
}

const initialState: AIAssistantState = {
  messages: [],
  isProcessing: false,
  contextId: null,
  systemPrompt: SYSTEM_PROMPTS.GENERAL_ASSISTANT,
  error: null,
  currentCriteria: [],
};

export const aiAssistantSlice = createSlice({
  name: "aiAssistant",
  initialState,
  reducers: {
    setSystemPrompt: (state, action: PayloadAction<string>) => {
      state.systemPrompt = action.payload;
    },

    addMessage: (
      state,
      action: PayloadAction<{
        type: "user" | "ai" | "system";
        content: string;
        responseOptions?: Array<{ text: string; value: string }>;
        severity?: "info" | "warning" | "success" | "error";
      }>
    ) => {
      const newMessage: AIMessage = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
    },

    setMessages: (state, action: PayloadAction<AIMessage[]>) => {
      state.messages = action.payload;
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    setContextId: (state, action: PayloadAction<string | null>) => {
      state.contextId = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Specialized action for the product filter context
    setProductFilterContext: (
      state,
      action: PayloadAction<{
        filterName?: string;
        filterDescription?: string;
        currentCriteria?: FilterCriteria[];
        expiryDate?: string | null;
      }>
    ) => {
      state.contextId = "productFilterContext";
      state.systemPrompt = SYSTEM_PROMPTS.PRODUCT_FILTER_ASSISTANT;
      state.currentCriteria = action.payload.currentCriteria || [];
    },

    // Enhanced action for the campaign context
    setCampaignContext: (
      state,
      action: PayloadAction<{
        basicInfo?: CampaignBasicInfo;
        targeting?: CampaignTargeting;
        distribution?: CampaignDistribution;
        budget?: CampaignBudget;
        ads?: CampaignAd[];
        currentStep?: string;
      }>
    ) => {
      state.contextId = "campaignContext";
      state.systemPrompt =
        SYSTEM_PROMPTS.CAMPAIGN_ASSISTANT ||
        "You are a helpful assistant for creating marketing campaigns.";
      state.campaignContext = {
        ...state.campaignContext,
        ...action.payload
      };
    },

    // Analyze campaign data and provide recommendations
    analyzeCampaignData: (state) => {
      // This is a trigger action for middleware - no state changes here
    },

    // Set campaign analysis results
    setCampaignAnalysis: (
      state,
      action: PayloadAction<{
        impressionRate?: number;
        conversionRate?: number;
        recommendedBudget?: number;
        audienceInsight?: string;
        performancePrediction?: string;
      }>
    ) => {
      if (state.campaignContext) {
        state.campaignContext.analysisData = action.payload;
      }
    },

    // Generate ad content suggestion
    generateAdSuggestion: (
      state,
      action: PayloadAction<{
        targetAudience?: string;
        campaignGoal?: string;
        productType?: string;
      }>
    ) => {
      // Trigger for middleware - no state changes here
    },

    // Generate campaign targeting suggestion
    generateTargetingSuggestion: (state) => {
      // Trigger for middleware - no state changes here
    },

    // Generate budget recommendation
    generateBudgetRecommendation: (state) => {
      // Trigger for middleware - no state changes here
    },

    // Magic generate action
    magicGenerate: (state) => {
      // This action doesn't need to modify state directly
      // It will be handled by the middleware
    },
  },
});

export const {
  setSystemPrompt,
  addMessage,
  setMessages,
  clearMessages,
  setIsProcessing,
  setContextId,
  setError,
  setProductFilterContext,
  setCampaignContext,
  analyzeCampaignData,
  setCampaignAnalysis,
  generateAdSuggestion,
  generateTargetingSuggestion,
  generateBudgetRecommendation,
  magicGenerate,
} = aiAssistantSlice.actions;

export default aiAssistantSlice.reducer;
