import { Client } from "langsmith";

/**
 * LangSmith Configuration for Observability
 *
 * This module configures LangSmith tracing for monitoring and debugging
 * our AI agents and conversation flows.
 */

// Initialize LangSmith client
export const langSmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
  apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
});

// LangSmith configuration for different environments
export const langSmithConfig = {
  enabled: process.env.LANGSMITH_TRACING === "true",
  projectName: process.env.LANGSMITH_PROJECT || "kigo-pro-copilot",
  apiKey: process.env.LANGSMITH_API_KEY,
  endpoint: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",

  // Session configuration
  sessionId: () => `kigo-pro-${Date.now()}`,

  // Metadata for tracing
  metadata: {
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    feature: "copilot-chat",
  },
};

/**
 * Create a traced function for LangSmith monitoring
 */
export function createTracedFunction<T extends (...args: any[]) => any>(
  name: string,
  fn: T,
  metadata?: Record<string, any>
): T {
  if (!langSmithConfig.enabled) {
    return fn;
  }

  return ((...args: Parameters<T>) => {
    const sessionId = langSmithConfig.sessionId();

    try {
      const result = fn(...args);

      // Log to LangSmith
      if (langSmithClient) {
        langSmithClient
          .createRun({
            name,
            sessionId,
            run_type: "chain",
            inputs: { args: args.length > 0 ? args : undefined },
            outputs: { result },
            project_name: langSmithConfig.projectName,
            extra: {
              ...langSmithConfig.metadata,
              ...metadata,
            },
          })
          .catch((error) => {
            console.warn("LangSmith logging failed:", error);
          });
      }

      return result;
    } catch (error) {
      // Log error to LangSmith
      if (langSmithClient) {
        langSmithClient
          .createRun({
            name,
            sessionId,
            run_type: "chain",
            inputs: { args: args.length > 0 ? args : undefined },
            error: error instanceof Error ? error.message : "Unknown error",
            project_name: langSmithConfig.projectName,
            extra: {
              ...langSmithConfig.metadata,
              ...metadata,
            },
          })
          .catch((logError) => {
            console.warn("LangSmith error logging failed:", logError);
          });
      }

      throw error;
    }
  }) as T;
}

/**
 * Log agent interactions to LangSmith
 */
export function logAgentInteraction(
  agentName: string,
  input: any,
  output: any,
  metadata?: Record<string, any>
) {
  if (!langSmithConfig.enabled || !langSmithClient) {
    return;
  }

  const sessionId = langSmithConfig.sessionId();

  langSmithClient
    .createRun({
      name: `${agentName}_interaction`,
      sessionId,
      run_type: "chain",
      inputs: { input },
      outputs: { output },
      project_name: langSmithConfig.projectName,
      extra: {
        ...langSmithConfig.metadata,
        agentName,
        ...metadata,
      },
    })
    .catch((error) => {
      console.warn(
        `[LangSmith] Failed to log ${agentName} interaction:`,
        error
      );
    });
}

/**
 * Log conversation flow to LangSmith
 */
export function logConversationFlow(
  flow: string,
  steps: Array<{ step: string; data: any; timestamp: string }>,
  metadata?: Record<string, any>
) {
  if (!langSmithConfig.enabled || !langSmithClient) {
    return;
  }

  const sessionId = langSmithConfig.sessionId();

  langSmithClient
    .createRun({
      name: `conversation_flow_${flow}`,
      sessionId,
      run_type: "chain",
      inputs: { flow, steps },
      outputs: { stepCount: steps.length },
      project_name: langSmithConfig.projectName,
      extra: {
        ...langSmithConfig.metadata,
        flow,
        stepCount: steps.length,
        ...metadata,
      },
    })
    .catch((error) => {
      console.warn(
        `[LangSmith] Failed to log conversation flow "${flow}":`,
        error
      );
    });
}

/**
 * Log errors to LangSmith
 */
export function logError(
  error: Error,
  context: string,
  metadata?: Record<string, any>
) {
  if (!langSmithConfig.enabled || !langSmithClient) {
    return;
  }

  const sessionId = langSmithConfig.sessionId();

  langSmithClient
    .createRun({
      name: `error_${context}`,
      sessionId,
      run_type: "chain",
      inputs: { error: error.message, context },
      error: error.message,
      project_name: langSmithConfig.projectName,
      extra: {
        ...langSmithConfig.metadata,
        context,
        errorMessage: error.message,
        errorStack: error.stack,
        ...metadata,
      },
    })
    .catch((logError) => {
      console.warn(`[LangSmith] Failed to log error in ${context}:`, logError);
    });
}

export default langSmithConfig;
