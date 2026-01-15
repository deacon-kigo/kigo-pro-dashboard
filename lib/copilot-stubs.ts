/**
 * Stub functions to replace CopilotKit imports
 * These are no-op functions that won't break existing code
 * but won't provide any functionality either
 */

export const useCopilotAction = () => {
  // No-op stub
};

export const useCopilotReadable = () => {
  // No-op stub
};

export const useCopilotChat = () => {
  return {
    appendMessage: () => {},
    setMessages: () => {},
    isLoading: false,
    messages: [],
  };
};

export const createTracedFunction = (fn: any) => fn;

// Stub for runtime-client-gql Message type
export type Message = {
  id: string;
  role: string;
  content: string;
};
