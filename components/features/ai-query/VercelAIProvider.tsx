/**
 * Vercel AI SDK Provider
 *
 * Alternative AI provider using Vercel AI SDK for natural language queries.
 * Can be used instead of or alongside CopilotKit.
 */

"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import AIQueryTrigger from "./AIQueryTrigger";

interface VercelAIProviderProps {
  children: React.ReactNode;
  apiEndpoint?: string;
}

export default function VercelAIProvider({
  children,
  apiEndpoint = "/api/ai/chat",
}: VercelAIProviderProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: apiEndpoint,
    });

  // Custom query handler for Vercel AI SDK
  const handleQuery = async (query: string): Promise<string> => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: query }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.content || "Sorry, I could not process your request.";
    } catch (error) {
      console.error("Vercel AI query error:", error);
      throw error;
    }
  };

  return (
    <>
      {children}
      <AIQueryTrigger
        mode="vercel-ai"
        position="bottom-left"
        onQuery={handleQuery}
      />
    </>
  );
}

// Hook for using Vercel AI in components
export function useVercelAI(apiEndpoint = "/api/ai/chat") {
  return useChat({
    api: apiEndpoint,
  });
}
