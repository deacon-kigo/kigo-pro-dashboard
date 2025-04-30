import { useState, useEffect, useCallback } from "react";
import { ChatService, ChatMessage, createChatService } from "./chat";
import {
  createProductFilterCriteriaTool,
  createFilterNameSuggestionTool,
  createFilterAnalysisTool,
} from "./tools";

// Hook for using the Chat service
export const useChat = (systemPrompt?: string) => {
  const [chatService] = useState(() => createChatService(systemPrompt));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat with system message
  useEffect(() => {
    chatService.resetChat();
    setMessages(chatService.getMessages());
  }, [chatService]);

  // Send a message to the chat
  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await chatService.sendMessage(message);
        setMessages(chatService.getMessages());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [chatService]
  );

  // Reset the chat
  const resetChat = useCallback(() => {
    chatService.resetChat();
    setMessages(chatService.getMessages());
    setError(null);
  }, [chatService]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
};

// Hook for generating product filter criteria
export const useProductFilterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCriteria = useCallback(
    async (
      filterName: string,
      filterType: string,
      description: string = ""
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const tool = createProductFilterCriteriaTool();
        const result = await tool.invoke({
          filterName,
          filterType,
          description,
        });

        return JSON.parse(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate criteria";
        setError(errorMessage);
        console.error("Filter criteria generation error:", err);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    generateCriteria,
    isLoading,
    error,
  };
};

// Hook for generating filter name suggestions
export const useFilterNameSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNames = useCallback(
    async (
      description: string,
      criteria: Array<{ type: string; value: string }> = []
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const tool = createFilterNameSuggestionTool();
        const result = await tool.invoke({
          description,
          criteria,
        });

        return JSON.parse(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to generate name suggestions";
        setError(errorMessage);
        console.error("Filter name suggestion error:", err);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    generateNames,
    isLoading,
    error,
  };
};

// Hook for analyzing filter criteria
export const useFilterAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCriteria = useCallback(
    async (
      filterName: string,
      criteria: Array<{ type: string; value: string; operator: string }>
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const tool = createFilterAnalysisTool();
        const result = await tool.invoke({
          filterName,
          criteria,
        });

        return JSON.parse(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to analyze criteria";
        setError(errorMessage);
        console.error("Filter analysis error:", err);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    analyzeCriteria,
    isLoading,
    error,
  };
};
