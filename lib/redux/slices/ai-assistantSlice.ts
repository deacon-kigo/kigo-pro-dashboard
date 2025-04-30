import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SYSTEM_PROMPTS } from "@/services/ai";

export interface AIMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  responseOptions?: Array<{
    text: string;
    value: string;
  }>;
  severity?: "info" | "warning" | "success" | "error";
}

interface AIAssistantState {
  messages: AIMessage[];
  isProcessing: boolean;
  contextId: string | null;
  systemPrompt: string;
  error: string | null;
}

const initialState: AIAssistantState = {
  messages: [],
  isProcessing: false,
  contextId: null,
  systemPrompt: SYSTEM_PROMPTS.GENERAL_ASSISTANT,
  error: null,
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
      action: PayloadAction<Omit<AIMessage, "id" | "timestamp">>
    ) => {
      state.messages.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      });
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
      }>
    ) => {
      const { filterName, filterDescription } = action.payload;

      // Set the appropriate system prompt for product filters
      state.systemPrompt = SYSTEM_PROMPTS.PRODUCT_FILTER_ASSISTANT;

      // Clear previous messages
      state.messages = [];

      // Add initial greeting with context
      const greeting = `I'm your AI assistant for creating product filters. ${
        filterName ? `I see you're working on "${filterName}". ` : ""
      }I can help you define appropriate criteria, suggest values, and answer questions about product filters.`;

      // Initial message with helpful options
      state.messages.push({
        id: Date.now().toString(),
        type: "ai",
        content: greeting,
        timestamp: new Date(),
        responseOptions: [
          {
            text: "What criteria should I include for this filter?",
            value: "explain_criteria_types",
          },
          {
            text: "How do I choose good criteria values?",
            value: "explain_criteria_values",
          },
          {
            text: "What makes a good product filter?",
            value: "best_practices",
          },
        ],
      });
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
