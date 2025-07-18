import { Client } from "langsmith";

/**
 * LangSmith Configuration for Observability
 *
 * This module configures LangSmith tracing for monitoring and debugging
 * AI agent interactions and LLM calls.
 *
 * NOTE: Manual tracing disabled in favor of automatic tracing via environment variables
 */

// Automatic tracing is enabled when these environment variables are set:
// LANGCHAIN_TRACING_V2=true
// LANGSMITH_API_KEY=your_key
// LANGCHAIN_PROJECT=kigo-pro-design

// LangSmith configuration for different environments
export const langSmithConfig = {
  enabled: process.env.LANGCHAIN_TRACING_V2 === "true", // Use automatic tracing flag
  projectName: process.env.LANGCHAIN_PROJECT || "kigo-pro-copilot",
  apiKey: process.env.LANGSMITH_API_KEY,
  endpoint: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
  environment: process.env.NODE_ENV || "development",
  version: process.env.APP_VERSION || "1.0.0",
  sessionId: () =>
    `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  metadata: {
    feature: "copilot_chat",
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "1.0.0",
  },
};

// Initialize LangSmith client (kept for compatibility but not used for manual tracing)
export const langSmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
  apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
});

/**
 * Create a traced function for LangSmith monitoring
 *
 * NOTE: This now relies on automatic tracing instead of manual createRun() calls
 * Automatic tracing is handled by the LANGCHAIN_TRACING_V2 environment variable
 */
export function createTracedFunction<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  metadata?: Record<string, any>
): T {
  return ((...args: any[]) => {
    // Just execute the function - automatic tracing will handle the rest
    console.log(`[Traced Function] ${name} - automatic tracing enabled`);
    return fn(...args);
  }) as T;
}

/**
 * Log agent interactions to LangSmith
 *
 * NOTE: Now relies on automatic tracing instead of manual logging
 * The traces will be captured automatically by the LANGCHAIN_TRACING_V2 system
 */
export function logAgentInteraction(
  agentName: string,
  input: any,
  output: any,
  metadata?: Record<string, any>
) {
  // No-op: Automatic tracing handles this
  console.log(
    `[Agent Interaction] ${agentName} - logged via automatic tracing`
  );
  return;
}

/**
 * Log conversation flow to LangSmith
 *
 * NOTE: Now relies on automatic tracing instead of manual logging
 */
export function logConversationFlow(
  flow: string,
  data: any,
  metadata?: Record<string, any>
) {
  // No-op: Automatic tracing handles this
  console.log(`[Conversation Flow] ${flow} - logged via automatic tracing`);
  return;
}

/**
 * Log errors to LangSmith
 *
 * NOTE: Now relies on automatic tracing instead of manual logging
 */
export function logError(
  context: string,
  error: Error,
  metadata?: Record<string, any>
) {
  // Still log errors to console for debugging
  console.error(`[Error in ${context}]:`, error);
  // Automatic tracing will capture the error context
  return;
}

export default langSmithConfig;
