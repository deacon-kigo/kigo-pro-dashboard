# LangSmith Tracing Integration

This guide explains how to use LangSmith tracing in your application to monitor AI interactions.

## Setup

1. Add environment variables to your `.env.local` file:

   ```
   # LangSmith Configuration
   LANGSMITH_TRACING=true
   LANGSMITH_API_KEY="your-langsmith-api-key"
   ```

2. Get your API key from the [LangSmith settings page](https://smith.langchain.com/settings)

## Using LangSmith Tracing

### 1. Tracing OpenAI Calls

Use the wrapped OpenAI client for automatic tracing:

```typescript
import { openai } from "../services/ai/langsmith";

// All API calls made with this client will be automatically traced
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" },
  ],
});
```

### 2. Tracing Functions

Wrap any function with the `trace` or `withTracing` utility:

```typescript
import { withTracing } from "../services/ai/langsmith";

// Trace a function
const myFunction = withTracing(async (input) => {
  // Function logic here
  return result;
});

// Use as normal
const result = await myFunction(input);
```

### 3. Tracing LangChain Operations

Use `traceChain` for LangChain-related functions:

```typescript
import { traceChain } from "../services/ai/langsmith";

const myChain = traceChain(async (input) => {
  // Chain logic here
  return result;
}, "my-chain-name");
```

### 4. Tracing React Components

You can trace entire components by wrapping them:

```typescript
import { withTracing } from "../services/ai/langsmith";

function MyComponent(props) {
  // Component logic
}

// Export the traced component
export default withTracing(MyComponent);
```

## Catalog Filter Integration

To trace your catalog filter creation:

1. Import the tracing utilities in your filter component
2. Wrap the filter creation function:

```typescript
import { traceChain } from "../services/ai/langsmith";

// Trace your filter creation function
const createFilter = traceChain(async (filterData) => {
  // Your existing filter creation logic
  return createdFilter;
}, "product-filter-creation");
```

## Chat Experience Integration

To trace your chat functionality:

1. Import the tracing utilities in your chat component
2. Wrap the chat message processing function:

```typescript
import { withTracing, openai } from "../services/ai/langsmith";

// Trace your chat message handler
const handleChatMessage = withTracing(async (message) => {
  // Use the traced OpenAI client
  const response = await openai.chat.completions.create({
    // Your chat configuration
  });

  return response;
});
```

## Viewing Traces

Visit your [LangSmith Dashboard](https://smith.langchain.com) to view all traced operations, analyze performance, and debug issues.
