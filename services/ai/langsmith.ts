// Create a completely mocked version with no real OpenAI dependencies
// This prevents both the node:async_hooks import error and the API key error

// Mock OpenAI class that doesn't require an API key
class MockOpenAI {
  constructor() {}
  // Add any mock methods needed
  async chat() {
    return { choices: [{ message: { content: "This is a mock response" } }] };
  }
  async completions() {
    return { choices: [{ text: "This is a mock response" }] };
  }
}

// Provide a mock OpenAI instance instead of a real one
export const openai = new MockOpenAI();

// Helper that just returns the original function without tracing
export const trace = (fn: any, _options?: any) => fn;

/**
 * Browser-compatible version that doesn't use langsmith
 * Just returns the original function
 */
export function withTracing<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

/**
 * Browser-compatible version that doesn't use langsmith
 * Just returns the original function
 */
export function traceChain<T extends (...args: any[]) => any>(
  fn: T,
  _name?: string
): T {
  return fn;
}

/**
 * Browser-compatible version that doesn't use langsmith
 * Just returns the original function
 */
export function withOpenAITracing<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return fn;
}
