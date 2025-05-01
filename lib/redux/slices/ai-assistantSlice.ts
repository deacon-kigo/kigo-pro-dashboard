import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SYSTEM_PROMPTS } from "@/services/ai";

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
}

interface AIAssistantState {
  messages: AIMessage[];
  isProcessing: boolean;
  contextId: string | null;
  systemPrompt: string;
  error: string | null;
  currentCriteria: FilterCriteria[];
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
      }>
    ) => {
      state.contextId = "productFilterContext";
      state.systemPrompt = SYSTEM_PROMPTS.PRODUCT_FILTER_ASSISTANT;
      state.currentCriteria = action.payload.currentCriteria || [];
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
} = aiAssistantSlice.actions;

export default aiAssistantSlice.reducer;
