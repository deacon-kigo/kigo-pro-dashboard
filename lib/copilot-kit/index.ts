// CopilotKit Integration Module
// This module provides the main exports for CopilotKit integration with Redux

export { CopilotKitProvider } from "./provider";
export { useCopilotReduxBridge } from "./redux-bridge";
export {
  langSmithConfig,
  langSmithClient,
  createTracedFunction,
  logAgentInteraction,
  logConversationFlow,
  logError,
} from "./langsmith-config";

// Re-export common CopilotKit hooks and components
export {
  useCopilotAction,
  useCopilotReadable,
  useCopilotChat,
} from "@copilotkit/react-core";

export { CopilotChat, CopilotKit } from "@copilotkit/react-ui";
